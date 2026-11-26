"""Cálculo puro de las tomas de un día a partir de horarios y registros."""

from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta
from typing import Optional
from zoneinfo import ZoneInfo

from app.models import DoseLog, Medicine

DAY_KEYS = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"]
TERMINAL = ("taken", "omitted")


@dataclass
class DoseView:
    id: str
    medicine_id: int
    medicine_name: str
    time: str
    dose_description: str
    status: str  # 'pending' | 'taken' | 'omitted' | 'unconfirmed'
    taken_at: Optional[str] = None
    omitted_at: Optional[str] = None
    omission_reason: Optional[str] = None
    is_delayed: bool = False
    postponed_until: Optional[str] = None
    notice_attended: bool = False


def dose_id(medicine_id: int, day: date, time: str) -> str:
    return f"{medicine_id}_{day.isoformat()}_{time.replace(':', '')}"


def parse_dose_id(value: str) -> tuple[int, date, str]:
    try:
        med, day, hhmm = value.split("_")
        if len(hhmm) != 4 or not hhmm.isdigit():
            raise ValueError
        h, m = int(hhmm[:2]), int(hhmm[2:])
        if h > 23 or m > 59:
            raise ValueError
        return int(med), date.fromisoformat(day), f"{hhmm[:2]}:{hhmm[2:]}"
    except ValueError:
        raise ValueError(f"dose id inválido: {value!r}") from None


def as_utc(dt: datetime) -> datetime:
    """SQLite devuelve datetimes naive: se asumen UTC."""
    return dt.replace(tzinfo=UTC) if dt.tzinfo is None else dt.astimezone(UTC)


def to_local(dt: datetime, tz: str) -> datetime:
    return as_utc(dt).astimezone(ZoneInfo(tz))


def local_today(now_utc: datetime, tz: str) -> date:
    return to_local(now_utc, tz).date()


def hhmm(dt: datetime) -> str:
    return dt.strftime("%H:%M")


def minutes(time: str) -> int:
    h, m = time.split(":")
    return int(h) * 60 + int(m)


def day_key(day: date) -> str:
    return DAY_KEYS[day.weekday()]


def is_scheduled_on(medicine: Medicine, day: date, tz: str) -> bool:
    if medicine.status != "active":
        return False
    if to_local(medicine.created_at, tz).date() > day:
        return False
    if medicine.deleted_at is not None and to_local(medicine.deleted_at, tz).date() <= day:
        return False
    return not medicine.days or day_key(day) in medicine.days


def build_day_doses(
    medicines: list[Medicine],
    logs: list[DoseLog],
    day: date,
    now_utc: datetime,
    tz: str,
    wait_minutes: int,
) -> list[DoseView]:
    zone = ZoneInfo(tz)
    now_local = to_local(now_utc, tz)
    today = now_local.date()
    by_id = {m.id: m for m in medicines}
    day_logs = {(l.medicine_id, l.scheduled_time): l for l in logs if l.day == day}

    slots: dict[tuple[int, str], Medicine] = {}
    for m in medicines:
        if is_scheduled_on(m, day, tz):
            for t in m.times:
                slots[(m.id, t)] = m
    for (med_id, t), l in day_logs.items():
        if l.status in TERMINAL and med_id in by_id:
            slots[(med_id, t)] = by_id[med_id]

    result: list[DoseView] = []
    for (med_id, t), m in slots.items():
        view = DoseView(
            id=dose_id(med_id, day, t),
            medicine_id=med_id,
            medicine_name=m.name,
            time=t,
            dose_description=m.dose,
            status="pending",
        )
        l = day_logs.get((med_id, t))
        if l is not None:
            view.notice_attended = l.caregiver_attended_at is not None
            view.postponed_until = l.postponed_until
        if l is not None and l.status in TERMINAL:
            view.status = l.status
            registered = hhmm(to_local(l.registered_at, tz)) if l.registered_at else None
            if l.status == "taken":
                view.taken_at = registered
                view.is_delayed = registered is not None and minutes(registered) > minutes(t) + wait_minutes
            else:
                view.omitted_at = registered
                view.omission_reason = l.omission_reason
            view.postponed_until = None
        else:
            deadline = datetime.combine(day, datetime.min.time(), zone) + timedelta(minutes=minutes(t) + wait_minutes)
            if day < today or now_local > deadline:
                view.status = "unconfirmed"
        result.append(view)

    result.sort(key=lambda v: (v.time, v.medicine_name))
    return result
