from functools import lru_cache

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict
from typing import Annotated


DEV_JWT_SECRET = "dev-secret-change-me-dev-secret-change-me"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./medirecord.db"
    jwt_secret: str = DEV_JWT_SECRET
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:5173"]
    token_days: int = 30

    @field_validator("database_url")
    @classmethod
    def _driver(cls, v: str) -> str:
        for prefix in ("postgres://", "postgresql://"):
            if v.startswith(prefix):
                return "postgresql+psycopg://" + v[len(prefix):]
        return v

    @model_validator(mode="after")
    def _require_secret(self):
        if not self.database_url.startswith("sqlite") and self.jwt_secret == DEV_JWT_SECRET:
            raise ValueError("JWT_SECRET es obligatoria fuera de desarrollo (no uses el valor por defecto)")
        if len(self.jwt_secret) < 32:
            raise ValueError("JWT_SECRET debe tener al menos 32 caracteres")
        return self

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split(cls, v):
        if isinstance(v, str):
            return [o.strip().rstrip("/") for o in v.split(",") if o.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
