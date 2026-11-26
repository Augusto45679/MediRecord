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
