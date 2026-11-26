import os

os.environ["DATABASE_URL"] = "sqlite://"
os.environ.setdefault("JWT_SECRET", "test-secret-test-secret-test-secret")

from datetime import UTC, datetime

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel

from app import db
from app.clock import get_now
from app.main import app

from tests.helpers import auth, register

_now = {"value": datetime(2026, 11, 26, 15, 0, tzinfo=UTC)}


@pytest.fixture
def set_now():
    def _set(dt: datetime) -> None:
        _now["value"] = dt

    return _set


@pytest.fixture
def client():
    SQLModel.metadata.drop_all(db.engine)
    SQLModel.metadata.create_all(db.engine)
    _now["value"] = datetime(2026, 11, 26, 15, 0, tzinfo=UTC)
    app.dependency_overrides[get_now] = lambda: _now["value"]
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def patient(client):
    token, _ = register(client, "ana", "patient", display_name="Ana")
    return token


@pytest.fixture
def linked_pair(client):
    pt, p = register(client, "ana", "patient", display_name="Ana")
    ct, _ = register(client, "augusto", "caregiver", display_name="Augusto")
    client.post("/api/link/invite", json={"code": p["linkCode"]}, headers=auth(ct))
    client.post("/api/link/accept", headers=auth(pt))
    return pt, ct
