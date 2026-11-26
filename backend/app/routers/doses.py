from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select

from app.access import require_caregiver, require_patient, resolve_patient
from app.clock import get_now
from app.db import get_session
from app.models import DoseLog, Medicine, User
from app.schedule import DoseView, build_day_doses, dose_id, hhmm, local_today, minutes, parse_dose_id, to_local
from app.schemas import DayOut, DoseOut, OmitIn, PostponeIn
from app.security import get_current_user

router = APIRouter(prefix="/api")


def to_dose_out(v: DoseView) -> DoseOut:
    return DoseOut(
        id=v.id,
        medicine_id=str(v.medicine_id),
        medicine_name=v.medicine_name,
        time=v.time,
        dose_description=v.dose_description,
        status=v.status,
        taken_at=v.taken_at,
        omitted_at=v.omitted_at,
        omission_reason=v.omission_reason,
        is_delayed=v.is_delayed,
        postponed_until=v.postponed_until,
        notice_attended=v.notice_attended,
    )


def _days(patient: User, session: Session, now: datetime, first: date, last: date) -> list[DayOut]:
    meds = list(session.exec(select(Medicine).where(Medicine.patient_id == patient.id)).all())
    logs = list(
        session.exec(
            select(DoseLog).where(DoseLog.patient_id == patient.id, DoseLog.day >= first, DoseLog.day <= last)
        ).all()
    )
    today = local_today(now, patient.timezone)
    out = []
    day = last
    while day >= first:
        views = build_day_doses(meds, logs, day, now, patient.timezone, patient.alert_wait_minutes)
        out.append(DayOut(date=day.isoformat(), is_today=day == today, doses=[to_dose_out(v) for v in views]))
        day -= timedelta(days=1)
    return out


@router.get("/doses/today", response_model=DayOut)
def today(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    now: datetime = Depends(get_now),
):
    patient = resolve_patient(user, session)
    t = local_today(now, patient.timezone)
    return _days(patient, session, now, t, t)[0]


@router.get("/history", response_model=list[DayOut])
def history(
    days: int = Query(default=7, ge=1, le=31),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    now: datetime = Depends(get_now),
):
    patient = resolve_patient(user, session)
    t = local_today(now, patient.timezone)
    return _days(patient, session, now, t - timedelta(days=days - 1), t)


class _Ctx:
    def __init__(self, patient: User, medicine: Medicine, day: date, time: str, log: DoseLog, now: datetime):
        self.patient, self.medicine, self.day, self.time, self.log, self.now = patient, medicine, day, time, log, now


def _load(dose_id: str, patient: User, session: Session, now: datetime) -> _Ctx:
    not_found = HTTPException(status.HTTP_404_NOT_FOUND, "Toma no encontrada")
    try:
        med_id, day, time = parse_dose_id(dose_id)
    except ValueError:
        raise not_found
    medicine = session.get(Medicine, med_id)
    if medicine is None or medicine.patient_id != patient.id:
        raise not_found
    if day > local_today(now, patient.timezone):
        raise not_found
    log = session.exec(
        select(DoseLog).where(DoseLog.medicine_id == med_id, DoseLog.day == day, DoseLog.scheduled_time == time)
    ).first()
    views = build_day_doses([medicine], [log] if log else [], day, now, patient.timezone, patient.alert_wait_minutes)
    if not any(v.time == time for v in views):
        raise not_found
    if log is None:
        log = DoseLog(medicine_id=med_id, patient_id=patient.id, day=day, scheduled_time=time)
    return _Ctx(patient, medicine, day, time, log, now)


def _save(ctx: _Ctx, session: Session) -> DoseOut:
    session.add(ctx.log)
    session.commit()
    session.refresh(ctx.log)
    p = ctx.patient
    views = build_day_doses([ctx.medicine], [ctx.log], ctx.day, ctx.now, p.timezone, p.alert_wait_minutes)
    view = next((v for v in views if v.time == ctx.time), None)
    if view is None:  # el horario ya no existe (se editó la medicina): la toma deshecha desaparece
        view = DoseView(
            id=dose_id(ctx.medicine.id, ctx.day, ctx.time),
            medicine_id=ctx.medicine.id,
            medicine_name=ctx.medicine.name,
            time=ctx.time,
            dose_description=ctx.medicine.dose,
            status="pending",
        )
    return to_dose_out(view)


def _patient_ctx(dose_id: str, user: User, session: Session, now: datetime) -> _Ctx:
    require_patient(user)
    ctx = _load(dose_id, user, session, now)
    if ctx.day != local_today(now, user.timezone):
        raise HTTPException(status.HTTP_409_CONFLICT, "Solo se pueden registrar tomas de hoy")
    return ctx


@router.post("/doses/{dose_id}/take", response_model=DoseOut)
def take(dose_id: str, user: User = Depends(get_current_user), session: Session = Depends(get_session), now: datetime = Depends(get_now)):
    ctx = _patient_ctx(dose_id, user, session, now)
    ctx.log.status, ctx.log.registered_at = "taken", now
    ctx.log.omission_reason = ctx.log.postponed_until = None
    return _save(ctx, session)


@router.post("/doses/{dose_id}/omit", response_model=DoseOut)
def omit(dose_id: str, data: OmitIn, user: User = Depends(get_current_user), session: Session = Depends(get_session), now: datetime = Depends(get_now)):
    ctx = _patient_ctx(dose_id, user, session, now)
    ctx.log.status, ctx.log.registered_at, ctx.log.omission_reason = "omitted", now, data.reason
    ctx.log.postponed_until = None
    return _save(ctx, session)


@router.post("/doses/{dose_id}/postpone", response_model=DoseOut)
def postpone(dose_id: str, data: PostponeIn, user: User = Depends(get_current_user), session: Session = Depends(get_session), now: datetime = Depends(get_now)):
    ctx = _patient_ctx(dose_id, user, session, now)
    if ctx.log.status != "pending":
        raise HTTPException(status.HTTP_409_CONFLICT, "Esa toma ya está registrada")
    base = max(minutes(hhmm(to_local(now, user.timezone))), minutes(ctx.time)) + data.minutes
    base = min(base, 23 * 60 + 59)
    ctx.log.postponed_until = f"{base // 60:02d}:{base % 60:02d}"
    return _save(ctx, session)


@router.post("/doses/{dose_id}/undo", response_model=DoseOut)
def undo(dose_id: str, user: User = Depends(get_current_user), session: Session = Depends(get_session), now: datetime = Depends(get_now)):
    ctx = _patient_ctx(dose_id, user, session, now)
    ctx.log.status = "pending"
    ctx.log.registered_at = ctx.log.omission_reason = ctx.log.postponed_until = None
    return _save(ctx, session)


@router.post("/doses/{dose_id}/attend", response_model=DoseOut)
def attend(dose_id: str, user: User = Depends(get_current_user), session: Session = Depends(get_session), now: datetime = Depends(get_now)):
    require_caregiver(user)
    patient = resolve_patient(user, session)
    ctx = _load(dose_id, patient, session, now)
    ctx.log.caregiver_attended_at = now
    return _save(ctx, session)
