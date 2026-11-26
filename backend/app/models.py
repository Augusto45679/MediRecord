from datetime import UTC, date, datetime
from typing import Optional

from sqlalchemy import JSON, Column, UniqueConstraint
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


class Medicine(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="user.id", index=True)
    name: str
    dose: str
    concentration: str = ""
    amount: str = ""
    times: list[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    days: list[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    status: str = "active"  # 'active' | 'paused'
    added_by: str = ""
    created_at: datetime = Field(default_factory=utcnow)
    # Desde cuándo rige el horario actual (alta, último cambio de horario/días o reactivación).
    # Los días anteriores se reconstruyen solo con los DoseLog guardados.
    schedule_from: Optional[datetime] = None
    deleted_at: Optional[datetime] = None


class DoseLog(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("medicine_id", "day", "scheduled_time"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    medicine_id: int = Field(foreign_key="medicine.id", index=True)
    patient_id: int = Field(foreign_key="user.id", index=True)
    day: date = Field(index=True)
    scheduled_time: str
    status: str = "pending"  # 'pending' | 'taken' | 'omitted' | 'unconfirmed' (consolidada)
    registered_at: Optional[datetime] = None
    omission_reason: Optional[str] = None
    postponed_until: Optional[str] = None
    caregiver_attended_at: Optional[datetime] = None


class CareLink(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="user.id", index=True)
    caregiver_id: int = Field(foreign_key="user.id", index=True)
    status: str = "pending"  # 'pending' | 'accepted' | 'rejected'
    created_at: datetime = Field(default_factory=utcnow)
