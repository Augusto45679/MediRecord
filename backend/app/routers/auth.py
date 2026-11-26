import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.access import active_link
from app.db import get_session
from app.models import User
from app.schemas import AuthOut, LoginIn, RegisterIn, SettingsIn, UserOut
from app.security import create_token, get_current_user, hash_password, verify_password

router = APIRouter(prefix="/api")


def _new_link_code(session: Session) -> str:
    while True:
        code = f"{secrets.randbelow(10**6):06d}"
        if session.exec(select(User).where(User.link_code == code)).first() is None:
            return code


@router.post("/auth/register", response_model=AuthOut, status_code=status.HTTP_201_CREATED)
def register(data: RegisterIn, session: Session = Depends(get_session)):
    username = data.username.lower()
    if session.exec(select(User).where(User.username == username)).first():
        raise HTTPException(status.HTTP_409_CONFLICT, "Ese nombre de usuario ya existe")
    user = User(
        username=username,
        display_name=data.display_name,
        password_hash=hash_password(data.password),
        role=data.role,
        link_code=_new_link_code(session) if data.role == "patient" else None,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return AuthOut(token=create_token(user.id), user=UserOut.model_validate(user))


@router.post("/auth/login", response_model=AuthOut)
def login(data: LoginIn, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == data.username.strip().lower())).first()
    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Usuario o contraseña incorrectos")
    return AuthOut(token=create_token(user.id), user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.patch("/me/settings", response_model=UserOut)
def update_settings(
    data: SettingsIn,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    changes = data.model_dump(exclude_unset=True, exclude_none=True)
    for key, value in changes.items():
        setattr(user, key, value)
    session.add(user)
    if user.role == "caregiver" and "alert_wait_minutes" in changes:
        # El umbral de aviso vive en la paciente: es lo que usa el cálculo de "sin confirmar".
        link = active_link(user, session)
        if link is not None and link.status == "accepted":
            patient = session.get(User, link.patient_id)
            if patient is not None:
                patient.alert_wait_minutes = changes["alert_wait_minutes"]
                session.add(patient)
    session.commit()
    session.refresh(user)
    return user
