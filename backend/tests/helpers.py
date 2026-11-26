def register(client, username, role, display_name=None, password="secret123"):
    r = client.post(
        "/api/auth/register",
        json={
            "username": username,
            "password": password,
            "displayName": display_name or username,
            "role": role,
        },
    )
    assert r.status_code == 201, r.text
    body = r.json()
    return body["token"], body["user"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}
