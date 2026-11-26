import re
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel

Role = Literal["patient", "caregiver"]
FontSize = Literal["normal", "large", "xlarge"]
AlertWait = Literal[30, 60, 90]


class Camel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class RegisterIn(Camel):
    username: str = Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_.]+$")
    password: str = Field(min_length=6, max_length=128)
    display_name: str = Field(min_length=1, max_length=60)
    role: Role

    @field_validator("display_name")
    @classmethod
    def _strip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("El nombre no puede estar vacío")
        return v


class LoginIn(Camel):
    username: str
    password: str


class UserOut(Camel):
    id: int
    username: str
    display_name: str
    role: Role
    link_code: Optional[str]
    font_size: FontSize
    high_contrast: bool
    sound_enabled: bool
    vibration_enabled: bool
    voice_confirmation_enabled: bool
    alert_wait_minutes: int


class AuthOut(Camel):
    token: str
    user: UserOut


class SettingsIn(Camel):
    font_size: Optional[FontSize] = None
    high_contrast: Optional[bool] = None
    sound_enabled: Optional[bool] = None
    vibration_enabled: Optional[bool] = None
    voice_confirmation_enabled: Optional[bool] = None
    alert_wait_minutes: Optional[AlertWait] = None


class LinkOut(Camel):
    status: Literal["none", "pending", "accepted", "rejected"]
    other_display_name: Optional[str] = None
    other_username: Optional[str] = None


class InviteIn(Camel):
    code: str


DayKey = Literal["lun", "mar", "mie", "jue", "vie", "sab", "dom"]
OmissionReason = Literal["Me olvidé", "Me sentí mal", "Otro motivo"]
_TIME_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")


def _check_times(v: list[str]) -> list[str]:
    if not 1 <= len(v) <= 2:
        raise ValueError("Elegí uno o dos horarios")
    for t in v:
        if not _TIME_RE.match(t):
            raise ValueError(f"Horario inválido: {t}")
    if len(set(v)) != len(v):
        raise ValueError("Los horarios no pueden repetirse")
    return sorted(v)


def _check_days(v: list[str]) -> list[str]:
    if not v:
        raise ValueError("Elegí al menos un día")
    return [d for d in ("lun", "mar", "mie", "jue", "vie", "sab", "dom") if d in set(v)]


def _check_text(v: str) -> str:
    v = v.strip()
    if not v:
        raise ValueError("No puede estar vacío")
    return v


class MedicineIn(Camel):
    name: str = Field(max_length=80)
    dose: str = Field(max_length=120)
    concentration: str = Field(default="", max_length=60)
    amount: str = Field(default="", max_length=60)
    times: list[str]
    days: list[DayKey]

    _t = field_validator("times")(classmethod(lambda cls, v: _check_times(v)))
    _d = field_validator("days")(classmethod(lambda cls, v: _check_days(v)))
    _n = field_validator("name", "dose")(classmethod(lambda cls, v: _check_text(v)))


class MedicineUpdate(Camel):
    name: Optional[str] = Field(default=None, max_length=80)
    dose: Optional[str] = Field(default=None, max_length=120)
    concentration: Optional[str] = Field(default=None, max_length=60)
    amount: Optional[str] = Field(default=None, max_length=60)
    times: Optional[list[str]] = None
    days: Optional[list[DayKey]] = None

    _t = field_validator("times")(classmethod(lambda cls, v: v if v is None else _check_times(v)))
    _d = field_validator("days")(classmethod(lambda cls, v: v if v is None else _check_days(v)))
    _n = field_validator("name", "dose")(classmethod(lambda cls, v: v if v is None else _check_text(v)))


class MedicineOut(Camel):
    id: str
    name: str
    dose: str
    concentration: str
    amount: str
    times: list[str]
    days: list[str]
    frequency: str
    added_by: str
    status: Literal["active", "paused"]


class DoseOut(Camel):
    id: str
    medicine_id: str
    medicine_name: str
    time: str
    dose_description: str
    status: Literal["pending", "taken", "omitted", "unconfirmed"]
    taken_at: Optional[str] = None
    omitted_at: Optional[str] = None
    omission_reason: Optional[str] = None
    is_delayed: bool = False
    postponed_until: Optional[str] = None
    notice_attended: bool = False


class DayOut(Camel):
    date: str
    is_today: bool
    doses: list[DoseOut]


class OmitIn(Camel):
    reason: OmissionReason


class PostponeIn(Camel):
    minutes: int = Field(default=10, ge=1, le=120)
