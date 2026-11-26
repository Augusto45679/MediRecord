from tests.helpers import auth, register


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_register_patient_gets_link_code(client):
    token, user = register(client, "Ana", "patient", display_name="Ana")
    assert user["username"] == "ana"
    assert len(user["linkCode"]) == 6 and user["linkCode"].isdigit()
    assert user["alertWaitMinutes"] == 60 and user["fontSize"] == "large"


def test_register_caregiver_has_no_link_code(client):
    _, user = register(client, "augusto", "caregiver")
    assert user["linkCode"] is None


def test_duplicate_username_case_insensitive_409(client):
    register(client, "ana", "patient")
    r = client.post(
        "/api/auth/register",
        json={"username": "ANA", "password": "secret123", "displayName": "X", "role": "patient"},
    )
    assert r.status_code == 409


def test_login_ok_and_wrong_password(client):
    register(client, "ana", "patient")
    assert client.post("/api/auth/login", json={"username": "Ana", "password": "secret123"}).status_code == 200
    assert client.post("/api/auth/login", json={"username": "ana", "password": "nope"}).status_code == 401


def test_me_requires_token(client):
    assert client.get("/api/me").status_code == 401
    assert client.get("/api/me", headers={"Authorization": "Bearer basura"}).status_code == 401


def test_update_settings(client):
    token, _ = register(client, "ana", "patient")
    r = client.patch("/api/me/settings", json={"alertWaitMinutes": 90, "fontSize": "xlarge"}, headers=auth(token))
    assert r.json()["alertWaitMinutes"] == 90 and r.json()["fontSize"] == "xlarge"


def test_invalid_alert_wait_422(client):
    token, _ = register(client, "ana", "patient")
    assert client.patch("/api/me/settings", json={"alertWaitMinutes": 45}, headers=auth(token)).status_code == 422


def test_short_password_422(client):
    r = client.post(
        "/api/auth/register",
        json={"username": "ana", "password": "123", "displayName": "Ana", "role": "patient"},
    )
    assert r.status_code == 422
