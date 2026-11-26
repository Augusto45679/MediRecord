from tests.helpers import auth, register


def _pair(client):
    pt, p = register(client, "ana", "patient", display_name="Ana")
    ct, _ = register(client, "augusto", "caregiver", display_name="Augusto")
    return pt, p, ct


def test_invite_accept_flow(client):
    pt, p, ct = _pair(client)
    code = p["linkCode"][:3] + " " + p["linkCode"][3:]
    assert client.post("/api/link/invite", json={"code": code}, headers=auth(ct)).json()["status"] == "pending"
    assert client.get("/api/link", headers=auth(pt)).json() == {
        "status": "pending",
        "otherDisplayName": "Augusto",
        "otherUsername": "augusto",
    }
    assert client.post("/api/link/accept", headers=auth(pt)).json()["status"] == "accepted"
    assert client.get("/api/link", headers=auth(ct)).json()["otherDisplayName"] == "Ana"


def test_reject(client):
    pt, p, ct = _pair(client)
    client.post("/api/link/invite", json={"code": p["linkCode"]}, headers=auth(ct))
    assert client.post("/api/link/reject", headers=auth(pt)).json()["status"] == "rejected"
    assert client.get("/api/link", headers=auth(ct)).json()["status"] == "rejected"


def test_wrong_code_404(client):
    pt, p, ct = _pair(client)
    code = "000000" if p["linkCode"] != "000000" else "111111"
    assert client.post("/api/link/invite", json={"code": code}, headers=auth(ct)).status_code == 404


def test_patient_cannot_invite_403(client):
    pt, p, ct = _pair(client)
    assert client.post("/api/link/invite", json={"code": p["linkCode"]}, headers=auth(pt)).status_code == 403


def test_caregiver_cannot_accept_403(client):
    pt, p, ct = _pair(client)
    client.post("/api/link/invite", json={"code": p["linkCode"]}, headers=auth(ct))
    assert client.post("/api/link/accept", headers=auth(ct)).status_code == 403


def test_accept_without_pending_404(client):
    pt, p, ct = _pair(client)
    assert client.post("/api/link/accept", headers=auth(pt)).status_code == 404


def test_double_invite_409(client):
    pt, p, ct = _pair(client)
    client.post("/api/link/invite", json={"code": p["linkCode"]}, headers=auth(ct))
    assert client.post("/api/link/invite", json={"code": p["linkCode"]}, headers=auth(ct)).status_code == 409


def test_unlink(client):
    pt, p, ct = _pair(client)
    client.post("/api/link/invite", json={"code": p["linkCode"]}, headers=auth(ct))
    client.post("/api/link/accept", headers=auth(pt))
    assert client.delete("/api/link", headers=auth(ct)).status_code == 204
    assert client.get("/api/link", headers=auth(pt)).json()["status"] == "rejected"


def test_get_link_none(client):
    pt, p, ct = _pair(client)
    assert client.get("/api/link", headers=auth(pt)).json() == {
        "status": "none",
        "otherDisplayName": None,
        "otherUsername": None,
    }


def test_caregiver_alert_wait_applies_to_patient(client):
    pt, p, ct = _pair(client)
    client.patch("/api/me/settings", json={"alertWaitMinutes": 90}, headers=auth(ct))
    client.post("/api/link/invite", json={"code": p["linkCode"]}, headers=auth(ct))
    client.post("/api/link/accept", headers=auth(pt))
    assert client.get("/api/me", headers=auth(pt)).json()["alertWaitMinutes"] == 90
    client.patch("/api/me/settings", json={"alertWaitMinutes": 30}, headers=auth(ct))
    assert client.get("/api/me", headers=auth(pt)).json()["alertWaitMinutes"] == 30
    assert client.get("/api/me", headers=auth(ct)).json()["alertWaitMinutes"] == 30
