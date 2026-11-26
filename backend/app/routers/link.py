from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select

from app.access import active_link, latest_link, require_caregiver, require_patient
from app.db import get_session
from app.models import CareLink, User
from app.schemas import InviteIn, LinkOut
from app.security import get_current_user

router = APIRouter(prefix="/api/link")


def _out(user: User, link: CareLink | None, session: Session) -> LinkOut:
    if link is None:
        return LinkOut(status="none")
    other_id = link.caregiver_id if user.role == "patient" else link.patient_id
    other = session.get(User, other_id)
    return LinkOut(
        status=link.status,
        other_display_name=other.display_name if other else None,
        other_username=other.username if other else None,
    )


@router.get("", response_model=LinkOut)
def get_link(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return _out(user, latest_link(user, session), session)


@router.post("/invite", response_model=LinkOut, status_code=status.HTTP_201_CREATED)
def invite(data: InviteIn, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    require_caregiver(user)
    if active_link(user, session) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Ya tenés una persona vinculada o una invitación pendiente")
    code = "".join(ch for ch in data.code if ch.isdigit())
    patient = session.exec(select(User).where(User.link_code == code, User.role == "patient")).first()
    if patient is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No encontramos a nadie con ese código")
    if active_link(patient, session) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Esa persona ya tiene a alguien vinculado")
    link = CareLink(patient_id=patient.id, caregiver_id=user.id)
    session.add(link)
    session.commit()
    session.refresh(link)
    return _out(user, link, session)


def _answer(user: User, session: Session, new_status: str) -> LinkOut:
    require_patient(user)
    link = latest_link(user, session)
    if link is None or link.status != "pending":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No tenés invitaciones pendientes")
    link.status = new_status
    session.add(link)
    session.commit()
    session.refresh(link)
    return _out(user, link, session)


@router.post("/accept", response_model=LinkOut)
def accept(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return _answer(user, session, "accepted")


@router.post("/reject", response_model=LinkOut)
def reject(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return _answer(user, session, "rejected")


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def unlink(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    link = active_link(user, session)
    if link is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No hay vínculo activo")
    link.status = "rejected"
    session.add(link)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
