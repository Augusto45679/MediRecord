from collections.abc import Iterator

from sqlalchemy.pool import StaticPool
from sqlmodel import Session, create_engine

from app.config import get_settings

_url = get_settings().database_url

if _url.startswith("sqlite"):
    _kwargs: dict = {"connect_args": {"check_same_thread": False}}
    if _url in ("sqlite://", "sqlite:///:memory:"):
        _kwargs["poolclass"] = StaticPool
    engine = create_engine(_url, **_kwargs)
else:
    engine = create_engine(_url, pool_pre_ping=True)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
