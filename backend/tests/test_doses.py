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


def test_today_lists_scheduled_doses(client, patient, at_1402):
    _med(client, patient, ["08:00", "14:00"])
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
