from datetime import UTC, datetime
from typing import Optional

from sqlmodel import Field, SQLModel

DEFAULT_TZ = "America/Argentina/Buenos_Aires"


def utcnow() -> datetime:
    return datetime.now(UTC)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    display_name: str
    password_hash: str
    role: str  # 'patient' | 'caregiver'
    timezone: str = DEFAULT_TZ
    link_code: Optional[str] = Field(default=None, unique=True, index=True)
    font_size: str = "large"
    high_contrast: bool = False
    sound_enabled: bool = True
    vibration_enabled: bool = True
    voice_confirmation_enabled: bool = True
    alert_wait_minutes: int = 60
    created_at: datetime = Field(default_factory=utcnow)
