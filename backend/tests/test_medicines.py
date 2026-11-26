from datetime import UTC, datetime

from tests.helpers import auth, register

ALL = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"]
MET = {
    "name": "Metformina",
    "dose": "500 mg · 1 comprimido",
    "concentration": "500 mg",
    "amount": "1 comprimido",
    "times": ["14:00", "20:00"],
    "days": ALL,
}


def test_create_and_list(client, patient):
    r = client.post("/api/medicines", json=MET, headers=auth(patient))
    assert r.status_code == 201
    assert r.json()["frequency"] == "Todos los días" and r.json()["addedBy"] == "Ana"
    assert isinstance(r.json()["id"], str)
    assert [m["name"] for m in client.get("/api/medicines", headers=auth(patient)).json()] == ["Metformina"]


def test_frequency_weekdays(client, patient):
    r = client.post("/api/medicines", json={**MET, "days": ["lun", "mar", "mie", "jue", "vie"]}, headers=auth(patient))
    assert r.json()["frequency"] == "Lunes a Viernes"


def test_invalid_time_422(client, patient):
    assert client.post("/api/medicines", json={**MET, "times": ["25:00"]}, headers=auth(patient)).status_code == 422
    assert client.post("/api/medicines", json={**MET, "times": []}, headers=auth(patient)).status_code == 422
    assert client.post("/api/medicines", json={**MET, "days": []}, headers=auth(patient)).status_code == 422
    assert client.post("/api/medicines", json={**MET, "name": "  "}, headers=auth(patient)).status_code == 422


def test_update(client, patient):
    mid = client.post("/api/medicines", json=MET, headers=auth(patient)).json()["id"]
    r = client.patch(f"/api/medicines/{mid}", json={"times": ["21:00", "09:00"], "days": ["sab", "dom"]}, headers=auth(patient))
    assert r.json()["times"] == ["09:00", "21:00"] and r.json()["frequency"] == "Fines de semana"


def test_toggle_pause(client, patient):
    mid = client.post("/api/medicines", json=MET, headers=auth(patient)).json()["id"]
    assert client.post(f"/api/medicines/{mid}/toggle-pause", headers=auth(patient)).json()["status"] == "paused"
    assert client.post(f"/api/medicines/{mid}/toggle-pause", headers=auth(patient)).json()["status"] == "active"


def test_delete_medicine_keeps_history(client, patient, set_now):
    set_now(datetime(2026, 11, 26, 11, 10, tzinfo=UTC))  # 08:10 local
    mid = client.post("/api/medicines", json={**MET, "times": ["08:00"]}, headers=auth(patient)).json()["id"]
    did = client.get("/api/doses/today", headers=auth(patient)).json()["doses"][0]["id"]
    client.post(f"/api/doses/{did}/take", headers=auth(patient))
    assert client.delete(f"/api/medicines/{mid}", headers=auth(patient)).status_code == 204
    assert client.get("/api/medicines", headers=auth(patient)).json() == []
    doses = client.get("/api/doses/today", headers=auth(patient)).json()["doses"]
    assert [(d["time"], d["status"]) for d in doses] == [("08:00", "taken")]
    assert client.delete(f"/api/medicines/{mid}", headers=auth(patient)).status_code == 404


def test_caregiver_linked_can_add_medicine(client, linked_pair):
    pt, ct = linked_pair
    r = client.post("/api/medicines", json=MET, headers=auth(ct))
    assert r.json()["addedBy"] == "Augusto"
    assert len(client.get("/api/medicines", headers=auth(pt)).json()) == 1


def test_unlinked_caregiver_gets_404(client):
    ct, _ = register(client, "solo", "caregiver")
    assert client.get("/api/medicines", headers=auth(ct)).status_code == 404
    assert client.get("/api/doses/today", headers=auth(ct)).status_code == 404


def test_other_patients_medicine_404(client, patient):
    other, _ = register(client, "otra", "patient")
    mid = client.post("/api/medicines", json=MET, headers=auth(other)).json()["id"]
    assert client.patch(f"/api/medicines/{mid}", json={"name": "X"}, headers=auth(patient)).status_code == 404
    assert client.patch("/api/medicines/abc", json={"name": "X"}, headers=auth(patient)).status_code in (404, 422)
