from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import inspect, text
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from app import models  # noqa: F401  (registra tablas)
from app.config import get_settings
from app.db import engine
from app.routers import auth, doses, link, medicines


@asynccontextmanager
async def lifespan(_: FastAPI):
    SQLModel.metadata.create_all(engine)
    _add_missing_columns()
    yield


# create_all no agrega columnas a tablas existentes: migraciones mínimas a mano.
_NEW_COLUMNS = {
    "medicine": {
        "interval_days": "INTEGER NOT NULL DEFAULT 1",
        "end_date": "DATE",
        "form": "VARCHAR NOT NULL DEFAULT 'comprimido'",
        "stock": "INTEGER",
        "stock_per_dose": "INTEGER NOT NULL DEFAULT 1",
    },
}


def _add_missing_columns() -> None:
    insp = inspect(engine)
    with engine.begin() as conn:
        for table, cols in _NEW_COLUMNS.items():
            existing = {c["name"] for c in insp.get_columns(table)}
            for name, ddl in cols.items():
                if name not in existing:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))


app = FastAPI(title="MediRecord API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(link.router)
app.include_router(medicines.router)
app.include_router(doses.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
