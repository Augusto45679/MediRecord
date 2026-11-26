from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, col, select

from app.access import resolve_patient
from app.clock import get_now
from app.db import get_session
from app.models import DoseLog, Medicine, User
from app.schedule import format_days_frequency, unconfirmed_to_persist
from app.schemas import MedicineIn, MedicineOut, MedicineUpdate
from app.security import get_current_user

router = APIRouter(prefix="/api/medicines")


def to_medicine_out(m: Medicine) -> MedicineOut:
    return MedicineOut(
        id=str(m.id),
        name=m.name,
        dose=m.dose,
        concentration=m.concentration,
        amount=m.amount,
        times=list(m.times),
        days=list(m.days),
        frequency=format_days_frequency(list(m.days)),
        added_by=m.added_by,
        status=m.status,
    )


def _persist_unconfirmed(m: Medicine, patient: User, session: Session, now: datetime) -> None:
    """Antes de pausar, editar horarios o borrar, guarda las tomas vencidas sin registro
    para que el historial pasado no cambie."""
    logs = list(session.exec(select(DoseLog).where(DoseLog.medicine_id == m.id)).all())
    by_key = {(l.day, l.scheduled_time): l for l in logs}
    for day, time in unconfirmed_to_persist(m, logs, now, patient.timezone, patient.alert_wait_minutes):
        log = by_key.get((day, time)) or DoseLog(medicine_id=m.id, patient_id=patient.id, day=day, scheduled_time=time)
        log.status = "unconfirmed"
        session.add(log)


def _get_owned(med_id: int, patient: User, session: Session) -> Medicine:
    m = session.get(Medicine, med_id)
    if m is None or m.patient_id != patient.id or m.deleted_at is not None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Medicina no encontrada")
    return m


@router.get("", response_model=list[MedicineOut])
def list_medicines(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    patient = resolve_patient(user, session)
    meds = session.exec(
        select(Medicine)
        .where(Medicine.patient_id == patient.id, col(Medicine.deleted_at).is_(None))
        .order_by(col(Medicine.id))
    ).all()
    return [to_medicine_out(m) for m in meds]


@router.post("", response_model=MedicineOut, status_code=status.HTTP_201_CREATED)
def create_medicine(
    data: MedicineIn,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    now: datetime = Depends(get_now),
):
    patient = resolve_patient(user, session)
    m = Medicine(**data.model_dump(), patient_id=patient.id, added_by=user.display_name, created_at=now)
    session.add(m)
    session.commit()
    session.refresh(m)
    return to_medicine_out(m)


@router.patch("/{med_id}", response_model=MedicineOut)
def update_medicine(
    med_id: int,
    data: MedicineUpdate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    now: datetime = Depends(get_now),
):
    patient = resolve_patient(user, session)
    m = _get_owned(med_id, patient, session)
    if data.times is not None or data.days is not None:
        _persist_unconfirmed(m, patient, session, now)
        m.schedule_from = now
    for key, value in data.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(m, key, value)
    session.add(m)
    session.commit()
    session.refresh(m)
    return to_medicine_out(m)


@router.post("/{med_id}/toggle-pause", response_model=MedicineOut)
def toggle_pause(
    med_id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    now: datetime = Depends(get_now),
):
    patient = resolve_patient(user, session)
    m = _get_owned(med_id, patient, session)
    if m.status == "active":
        _persist_unconfirmed(m, patient, session, now)
    else:
        m.schedule_from = now  # los días en pausa no generan tomas
    m.status = "paused" if m.status == "active" else "active"
    session.add(m)
    session.commit()
    session.refresh(m)
    return to_medicine_out(m)


@router.delete("/{med_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medicine(
    med_id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    now: datetime = Depends(get_now),
):
    patient = resolve_patient(user, session)
    m = _get_owned(med_id, patient, session)
    _persist_unconfirmed(m, patient, session, now)
    m.deleted_at = now
    session.add(m)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
