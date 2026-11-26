from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, col, select

from app.access import resolve_patient
from app.clock import get_now
from app.db import get_session
from app.models import Medicine, User
from app.schedule import format_days_frequency
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
):
    m = _get_owned(med_id, resolve_patient(user, session), session)
    for key, value in data.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(m, key, value)
    session.add(m)
    session.commit()
    session.refresh(m)
    return to_medicine_out(m)


@router.post("/{med_id}/toggle-pause", response_model=MedicineOut)
def toggle_pause(med_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    m = _get_owned(med_id, resolve_patient(user, session), session)
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
    m = _get_owned(med_id, resolve_patient(user, session), session)
    m.deleted_at = now
    session.add(m)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
