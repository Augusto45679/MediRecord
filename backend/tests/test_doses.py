from datetime import UTC, datetime, timedelta

import pytest

from tests.helpers import auth, register

ALL = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"]
AT_1402 = datetime(2026, 11, 26, 17, 2, tzinfo=UTC)


def _med(client, token, times):
    body = {"name": "Metformina", "dose": "500 mg · 1 comprimido", "times": times, "days": ALL}
    return client.post("/api/medicines", json=body, headers=auth(token)).json()["id"]


def _today(client, token):
    return client.get("/api/doses/today", headers=auth(token)).json()


@pytest.fixture
def at_1402(set_now):
    set_now(AT_1402)


def _dose_1400(client, token):
    _med(client, token, ["14:00"])
    return _today(client, token)["doses"][0]["id"]


def test_today_lists_scheduled_doses(client, patient, set_now):
    set_now(AT_1402 - timedelta(days=1))
    _med(client, patient, ["08:00", "14:00"])
    set_now(AT_1402)
    day = _today(client, patient)
    assert day["date"] == "2026-11-26" and day["isToday"] is True
    assert [(d["time"], d["status"]) for d in day["doses"]] == [("08:00", "unconfirmed"), ("14:00", "pending")]
    assert day["doses"][0]["medicineName"] == "Metformina"
    assert day["doses"][0]["doseDescription"] == "500 mg · 1 comprimido"


def test_take_dose(client, patient, at_1402):
    did = _dose_1400(client, patient)
    d = client.post(f"/api/doses/{did}/take", headers=auth(patient)).json()
    assert (d["status"], d["takenAt"], d["isDelayed"]) == ("taken", "14:02", False)


def test_omit_requires_valid_reason(client, patient, at_1402):
    did = _dose_1400(client, patient)
    assert client.post(f"/api/doses/{did}/omit", json={"reason": "x"}, headers=auth(patient)).status_code == 422
    d = client.post(f"/api/doses/{did}/omit", json={"reason": "Me sentí mal"}, headers=auth(patient)).json()
    assert (d["status"], d["omissionReason"], d["omittedAt"]) == ("omitted", "Me sentí mal", "14:02")


def test_postpone(client, patient, at_1402):
    did = _dose_1400(client, patient)
    d = client.post(f"/api/doses/{did}/postpone", json={"minutes": 10}, headers=auth(patient)).json()
    assert (d["status"], d["postponedUntil"]) == ("pending", "14:12")


def test_undo(client, patient, at_1402):
    did = _dose_1400(client, patient)
    client.post(f"/api/doses/{did}/take", headers=auth(patient))
    d = client.post(f"/api/doses/{did}/undo", headers=auth(patient)).json()
    assert (d["status"], d["takenAt"]) == ("pending", None)


def test_caregiver_cannot_take_dose(client, linked_pair, at_1402):
    pt, ct = linked_pair
    did = _dose_1400(client, pt)
    assert client.post(f"/api/doses/{did}/take", headers=auth(ct)).status_code == 403


def test_caregiver_attend(client, linked_pair, at_1402):
    pt, ct = linked_pair
    did = _dose_1400(client, pt)
    assert client.post(f"/api/doses/{did}/attend", headers=auth(ct)).json()["noticeAttended"] is True
    assert client.post(f"/api/doses/{did}/attend", headers=auth(pt)).status_code == 403
    assert _today(client, ct)["doses"][0]["noticeAttended"] is True


def test_bad_dose_id_404(client, patient, at_1402):
    assert client.post("/api/doses/nope/take", headers=auth(patient)).status_code == 404
    other, _ = register(client, "otra", "patient")
    did = _dose_1400(client, other)
    assert client.post(f"/api/doses/{did}/take", headers=auth(patient)).status_code == 404
    mid = _med(client, patient, ["14:00"])
    assert client.post(f"/api/doses/{mid}_2026-11-26_0930/take", headers=auth(patient)).status_code == 404
    assert client.post(f"/api/doses/{mid}_2026-11-27_1400/take", headers=auth(patient)).status_code == 404


def test_cannot_take_past_day_409(client, patient, set_now):
    set_now(AT_1402 - timedelta(days=2))
    mid = _med(client, patient, ["14:00"])
    set_now(AT_1402)
    assert client.post(f"/api/doses/{mid}_2026-11-25_1400/take", headers=auth(patient)).status_code == 409


def test_history_7_days(client, patient, set_now):
    set_now(AT_1402 - timedelta(days=10))
    _med(client, patient, ["08:00"])
    set_now(AT_1402)
    days = client.get("/api/history?days=7", headers=auth(patient)).json()
    assert len(days) == 7
    assert days[0]["isToday"] is True and days[0]["date"] == "2026-11-26"
    assert days[6]["date"] == "2026-11-20"
    assert all(d["doses"][0]["status"] == "unconfirmed" for d in days[1:])
    assert client.get("/api/history?days=40", headers=auth(patient)).status_code == 422


def test_undo_after_schedule_change_removes_dose(client, patient, at_1402):
    mid = _med(client, patient, ["14:00"])
    did = _today(client, patient)["doses"][0]["id"]
    client.post(f"/api/doses/{did}/take", headers=auth(patient))
    client.patch(f"/api/medicines/{mid}", json={"times": ["18:00"]}, headers=auth(patient))
    r = client.post(f"/api/doses/{did}/undo", headers=auth(patient))
    assert r.status_code == 200 and r.json()["status"] == "pending"
    assert [d["time"] for d in _today(client, patient)["doses"]] == ["18:00"]


# --- Hallazgos de la revisión final ---

def test_pause_keeps_past_unconfirmed_in_history(client, patient, set_now):
    set_now(AT_1402 - timedelta(days=3))
    mid = _med(client, patient, ["08:00"])
    set_now(AT_1402)
    client.post(f"/api/medicines/{mid}/toggle-pause", headers=auth(patient))
    days = client.get("/api/history?days=3", headers=auth(patient)).json()
    assert [d["date"] for d in days] == ["2026-11-26", "2026-11-25", "2026-11-24"]
    assert [x["status"] for x in days[0]["doses"]] == ["unconfirmed"]  # la de 08:00 de hoy ya venció
    assert [x["status"] for x in days[1]["doses"]] == ["unconfirmed"]
    assert [x["status"] for x in days[2]["doses"]] == ["unconfirmed"]


def test_schedule_edit_keeps_past_slots(client, patient, set_now):
    set_now(AT_1402 - timedelta(days=2))
    mid = _med(client, patient, ["08:00"])
    set_now(AT_1402)
    client.patch(f"/api/medicines/{mid}", json={"times": ["21:00"]}, headers=auth(patient))
    yesterday = client.get("/api/history?days=2", headers=auth(patient)).json()[1]
    assert [(d["time"], d["status"]) for d in yesterday["doses"]] == [("08:00", "unconfirmed")]


def test_medicine_added_midday_skips_earlier_slots(client, patient, at_1402):
    _med(client, patient, ["08:00", "20:00"])
    assert [(d["time"], d["status"]) for d in _today(client, patient)["doses"]] == [("20:00", "pending")]


def test_concurrent_insert_does_not_500(client, patient, at_1402, monkeypatch):
    from app.routers import doses as doses_router

    did = _dose_1400(client, patient)
    # Simula la carrera: otra request ya insertó el log, pero esta no lo vio al cargar.
    client.post(f"/api/doses/{did}/postpone", json={"minutes": 10}, headers=auth(patient))
    real = doses_router._find_log
    calls = {"n": 0}

    def stale_first(*args):
        calls["n"] += 1
        return None if calls["n"] == 1 else real(*args)

    monkeypatch.setattr(doses_router, "_find_log", stale_first)
    r = client.post(f"/api/doses/{did}/take", headers=auth(patient))
    assert r.status_code == 200 and r.json()["status"] == "taken"


def test_resume_does_not_backfill_paused_days(client, patient, set_now):
    set_now(AT_1402 - timedelta(days=5))
    mid = _med(client, patient, ["08:00"])
    set_now(AT_1402 - timedelta(days=3))
    client.post(f"/api/medicines/{mid}/toggle-pause", headers=auth(patient))
    set_now(AT_1402)
    client.post(f"/api/medicines/{mid}/toggle-pause", headers=auth(patient))
    days = {d["date"]: d["doses"] for d in client.get("/api/history?days=6", headers=auth(patient)).json()}
    assert days["2026-11-24"] == [] and days["2026-11-25"] == []
    assert [x["status"] for x in days["2026-11-22"]] == ["unconfirmed"]


def test_take_and_undo_adjust_stock(client, patient, at_1402):
    body = {"name": "Metformina", "dose": "1 comprimido", "times": ["14:00"], "days": ALL, "stock": 10, "stockPerDose": 2}
    mid = client.post("/api/medicines", json=body, headers=auth(patient)).json()["id"]
    did = _today(client, patient)["doses"][0]["id"]

    def stock():
        return next(m for m in client.get("/api/medicines", headers=auth(patient)).json() if m["id"] == mid)["stock"]

    client.post(f"/api/doses/{did}/take", headers=auth(patient))
    client.post(f"/api/doses/{did}/take", headers=auth(patient))  # doble toque no descuenta dos veces
    assert stock() == 8
    client.post(f"/api/doses/{did}/undo", headers=auth(patient))
    assert stock() == 10


def test_upcoming_lists_future_pending_doses(client, patient, at_1402):
    _med(client, patient, ["08:00", "20:00"])
    up = client.get("/api/doses/upcoming?days=2", headers=auth(patient)).json()
    # hoy ya pasó 08:00 → 20:00 de hoy, 08:00 y 20:00 de mañana
    assert [u["at"][11:16] for u in up] == ["20:00", "08:00", "20:00"]
    assert up[0]["at"].endswith("-03:00") and up[0]["medicineName"] == "Metformina"


def test_upcoming_skips_taken_and_caregiver_forbidden(client, linked_pair, at_1402):
    pt, ct = linked_pair
    _med(client, pt, ["14:30"])
    did = _today(client, pt)["doses"][0]["id"]
    client.post(f"/api/doses/{did}/take", headers=auth(pt))
    up = client.get("/api/doses/upcoming?days=1", headers=auth(pt)).json()
    assert up == []
    assert client.get("/api/doses/upcoming", headers=auth(ct)).status_code == 403


def test_omit_after_take_restores_stock(client, patient, at_1402):
    body = {"name": "Metformina", "dose": "1 comprimido", "times": ["14:00"], "days": ALL, "stock": 5}
    mid = client.post("/api/medicines", json=body, headers=auth(patient)).json()["id"]
    did = _today(client, patient)["doses"][0]["id"]
    client.post(f"/api/doses/{did}/take", headers=auth(patient))
    client.post(f"/api/doses/{did}/omit", json={"reason": "Me olvidé"}, headers=auth(patient))
    meds = client.get("/api/medicines", headers=auth(patient)).json()
    assert next(m for m in meds if m["id"] == mid)["stock"] == 5
