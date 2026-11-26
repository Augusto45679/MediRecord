from typing import Optional

from fastapi import HTTPException, status
from sqlmodel import Session, col, select

from app.models import CareLink, User

ACTIVE = ("pending", "accepted")


def latest_link(user: User, session: Session) -> Optional[CareLink]:
    field = CareLink.patient_id if user.role == "patient" else CareLink.caregiver_id
    return session.exec(
        select(CareLink).where(field == user.id).order_by(col(CareLink.id).desc())
    ).first()


def active_link(user: User, session: Session) -> Optional[CareLink]:
    link = latest_link(user, session)
    return link if link is not None and link.status in ACTIVE else None


def require_patient(user: User) -> User:
    if user.role != "patient":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Solo la persona que toma la medicina puede hacer esto")
    return user


def require_caregiver(user: User) -> User:
    if user.role != "caregiver":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Solo la persona de apoyo puede hacer esto")
    return user


def resolve_patient(user: User, session: Session) -> User:
    if user.role == "patient":
        return user
    link = active_link(user, session)
    if link is None or link.status != "accepted":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Sin persona vinculada")
    patient = session.get(User, link.patient_id)
    if patient is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Sin persona vinculada")
    return patient
