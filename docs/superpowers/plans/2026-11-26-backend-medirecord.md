# MediRecord: plan de backend real y deploy

> **Para agentes:** SUB-SKILL REQUERIDA: usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan checkboxes (`- [ ]`) para seguimiento.

**Goal:** Convertir el prototipo hardcodeado de MediRecord en una app real en producción (API FastAPI + Postgres en Railway, frontend React en Vercel) para gestionar tomas de pastillas de una paciente real y, opcionalmente, un familiar vinculado.

**Architecture:** Un servicio FastAPI en `backend/` guarda usuarios, medicinas y registros de tomas en Postgres. Las tomas del día **no se guardan por adelantado**: se calculan con una función pura (`build_day_doses`) a partir del horario de cada medicina más los registros (`DoseLog`) que existan, usando la hora real en la zona horaria de la paciente. El frontend mantiene sus componentes y su `MediRecordContext` (mismos nombres de acciones), pero el Context pasa a llamar a la API en vez de mutar estado local, y los componentes dejan de asumir 3 tomas fijas (08:00/14:00/20:00), la fecha "Jueves 15 de octubre" y los nombres "Roberto"/"Silvana".

**Tech Stack:** Python 3.12, FastAPI, SQLModel, psycopg 3, PyJWT, bcrypt, pytest + httpx (TestClient), SQLite en tests; uv para dependencias. Frontend: React 19 + Vite + TypeScript existentes, vitest para utilidades nuevas.

**Spec:** no hay documento de spec. Este plan argumenta desde el pedido del usuario (2026-11-26): "hacer un backend rápido en Python, que funcione en Railway y Vercel, login simple (usuario, o mail y usuario), sacar todo lo hardcodeado del frontend", y desde el comportamiento del prototipo actual (`src/context/MediRecordContext.tsx`, `src/types.ts`, `README.md`).

## Decisiones tomadas (revisar antes de ejecutar)

- **Login: usuario + contraseña** (sin mail). Solo nombre de usuario, sin contraseña, dejaría los datos de salud abiertos a cualquiera que adivine el usuario, así que se agrega una contraseña. No hay recuperación de contraseña. Si alguien la olvida, se resetea a mano en la DB.
- **Roles:** `patient` (vista "Roberto") y `caregiver` (vista "Silvana"). Un familiar puede tener **un** paciente vinculado, que es lo que la UI ya asume. Los valores internos de la UI `'roberto' | 'silvana'` (`UserRole` en `src/types.ts`) **se mantienen** como claves de vista para no tocar 20 archivos. Se mapean desde el rol del backend.
- **Solo la paciente registra tomas** (tomada / no tomada / posponer / deshacer). El familiar solo puede "marcar aviso atendido". Es el axioma actual de la UI: "solo Roberto puede registrarla".
- **Fuera de alcance (fase 2):** notificaciones push / alarmas con la app cerrada, recuperación de contraseña, migraciones con Alembic (se usa `create_all` al iniciar), varios pacientes por familiar, confirmación por voz real.
- Se quitan del producto `DemoControlBar`, los parámetros `?role=&tab=&status=` y `resetDemo`.

## Global Constraints

- Zona horaria por defecto de usuario: `America/Argentina/Buenos_Aires`. "Hoy" y "ahora" siempre se calculan en la zona de la **paciente**, nunca en UTC del servidor.
- Microcopy en voseo rioplatense (ver `CONSTRAINTS.md` §3): «confirmá», «tomaste», «tenés».
- Paleta institucional sin cambios (`CONSTRAINTS.md` §2).
- Umbral de aviso por defecto: 60 min, opciones 30/60/90.
- Motivos de omisión válidos: exactamente `'Me olvidé' | 'Me sentí mal' | 'Otro motivo'`.
- La API responde JSON en camelCase (alias generator de pydantic) para que coincida con los tipos TS existentes (`DoseRecord`, `Medicine`).
- Todas las rutas de la API bajo el prefijo `/api`.
- Variables de entorno backend: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS` (lista separada por comas). Frontend: `VITE_API_URL`.
- Token JWT con expiración de 30 días, enviado como `Authorization: Bearer <token>`, guardado en `localStorage` bajo la clave `medirecord_token`.

## Review Focus

1. **Cambio de día por zona horaria:** a las 22:30 hora Argentina (01:30 UTC del día siguiente), "hoy" tiene que seguir siendo el día argentino. Test en Task 2 (`test_day_uses_patient_timezone`).
2. **Editar el horario de una medicina después de registrar una toma:** si se tomó la de 08:00 y después se cambia el horario a 09:00, la toma de las 08:00 tiene que seguir apareciendo como tomada en hoy y en el historial, y la de 09:00 aparece pendiente. Test en Task 2 (`test_logged_dose_survives_schedule_change`).
3. **Borrar una medicina conserva el historial** (la UI ya lo promete: "El historial se conserva"). Soft delete. Tests en Task 2 (`test_deleted_medicine_keeps_past_logs`) y Task 4 (`test_delete_medicine_keeps_history`).
4. **El familiar intenta registrar una toma** → 403, y el familiar sin vínculo aceptado no ve datos de nadie → 404. Tests en Task 4 (`test_caregiver_cannot_take_dose`, `test_unlinked_caregiver_gets_404`).
5. **Token vencido o inválido en el frontend:** cualquier 401 borra el token y vuelve a la pantalla de login, sin pantalla en blanco. Test en Task 6 (`client.test.ts › 401 clears token and calls onUnauthorized`).

---

## Estructura de archivos

```
backend/
  pyproject.toml            # deps (uv)
  railway.json              # start command
  app/
    main.py                 # FastAPI app, CORS, routers, create_all
    config.py               # Settings (env vars)
    db.py                   # engine, get_session
    models.py               # SQLModel tablas: User, Medicine, DoseLog, CareLink
    schemas.py              # Pydantic in/out (camelCase)
    security.py             # hash/verify password, create/decode JWT, get_current_user
    clock.py                # get_now() dependencia inyectable
    schedule.py             # lógica pura: build_day_doses, dose ids
    access.py               # resolve_patient(user) y require_patient(user)
    routers/
      auth.py               # /api/auth/*, /api/me
      medicines.py          # /api/medicines
      doses.py              # /api/doses/*, /api/history
      link.py               # /api/link/*
  tests/
    conftest.py             # SQLite en memoria, client, fixed clock, helpers de usuario
    test_auth.py
    test_schedule.py
    test_medicines.py
    test_doses.py
    test_link.py
src/
  api/client.ts             # NUEVO: fetch wrapper + token + 401
  api/client.test.ts        # NUEVO
  utils/dateFormat.ts       # NUEVO: formatLongDate, nowHHMM
  utils/dateFormat.test.ts  # NUEVO
  utils/doseSelectors.ts    # NUEVO: pickCurrentDose, countTaken
  utils/doseSelectors.test.ts
  components/common/AuthScreen.tsx   # NUEVO: login/registro
  context/MediRecordContext.tsx      # REESCRITO contra la API
  types.ts                           # MODIFICADO
  App.tsx                            # MODIFICADO
  (componentes de roberto/ y silvana/)  # MODIFICADOS: sin valores fijos
  data/initialData.ts                # BORRADO
  components/DemoControlBar.tsx      # BORRADO
```

---

### Task 1: Scaffold del backend, auth y ajustes de usuario

**Files:**
- Create: `backend/pyproject.toml`, `backend/railway.json`, `backend/app/{main,config,db,models,schemas,security,clock}.py`, `backend/app/routers/auth.py`, `backend/tests/conftest.py`, `backend/tests/test_auth.py`
- Modify: `.gitignore` (agregar `backend/.venv`, `__pycache__`, `*.db`, `.env`)

**Interfaces:**
- Produces:
  - `models.User`: `id:int`, `username:str` (único, guardado en minúsculas), `display_name:str`, `password_hash:str`, `role:Literal['patient','caregiver']`, `timezone:str='America/Argentina/Buenos_Aires'`, `link_code:str|None` (6 dígitos, solo pacientes, único), `font_size:Literal['normal','large','xlarge']='large'`, `high_contrast:bool=False`, `sound_enabled:bool=True`, `vibration_enabled:bool=True`, `voice_confirmation_enabled:bool=True`, `alert_wait_minutes:int=60`, `created_at:datetime`.
  - `security.get_current_user(token) -> User` (dependencia FastAPI, 401 si falta, es inválido o venció).
  - `security.create_token(user_id:int) -> str`.
  - `clock.get_now() -> datetime` (aware, UTC). En los tests se sobreescribe con `app.dependency_overrides`.
  - `db.get_session()` generador de `Session`.
  - Fixtures de `conftest.py`: `client`, `set_now(dt)`, `register(client, username, role, display_name=None, password='secret123') -> tuple[str, dict]` (token, user json), `auth(token) -> dict` (headers).
  - Endpoints:
    - `POST /api/auth/register` `{username, password, displayName, role}` → `201 {token, user}`
    - `POST /api/auth/login` `{username, password}` → `200 {token, user}`
    - `GET /api/me` → `UserOut`
    - `PATCH /api/me/settings` `{fontSize?, highContrast?, soundEnabled?, vibrationEnabled?, voiceConfirmationEnabled?, alertWaitMinutes?}` → `UserOut`
    - `GET /api/health` → `{"status":"ok"}`
  - `schemas.UserOut`: `id, username, displayName, role, linkCode, fontSize, highContrast, soundEnabled, vibrationEnabled, voiceConfirmationEnabled, alertWaitMinutes`.

- [ ] **Step 1: Crear el proyecto con uv**

Run: `cd backend && uv init --app --python 3.12 && uv add fastapi "uvicorn[standard]" sqlmodel "psycopg[binary]" pyjwt bcrypt pydantic-settings && uv add --dev pytest httpx`
Expected: `pyproject.toml` y `uv.lock` creados.

- [ ] **Step 2: Escribir los tests que fallan en `backend/tests/test_auth.py`**

```python
def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}

def test_register_patient_gets_link_code(client):
    token, user = register(client, "Ana", "patient", display_name="Ana")
    assert user["username"] == "ana"
    assert len(user["linkCode"]) == 6 and user["linkCode"].isdigit()
    assert user["alertWaitMinutes"] == 60 and user["fontSize"] == "large"

def test_register_caregiver_has_no_link_code(client):
    _, user = register(client, "augusto", "caregiver")
    assert user["linkCode"] is None

def test_duplicate_username_case_insensitive_409(client):
    register(client, "ana", "patient")
    r = client.post("/api/auth/register", json={"username": "ANA", "password": "secret123", "displayName": "X", "role": "patient"})
    assert r.status_code == 409

def test_login_ok_and_wrong_password(client):
    register(client, "ana", "patient")
    assert client.post("/api/auth/login", json={"username": "Ana", "password": "secret123"}).status_code == 200
    assert client.post("/api/auth/login", json={"username": "ana", "password": "nope"}).status_code == 401

def test_me_requires_token(client):
    assert client.get("/api/me").status_code == 401
    assert client.get("/api/me", headers={"Authorization": "Bearer basura"}).status_code == 401

def test_update_settings(client):
    token, _ = register(client, "ana", "patient")
    r = client.patch("/api/me/settings", json={"alertWaitMinutes": 90, "fontSize": "xlarge"}, headers=auth(token))
    assert r.json()["alertWaitMinutes"] == 90 and r.json()["fontSize"] == "xlarge"

def test_invalid_alert_wait_422(client):
    token, _ = register(client, "ana", "patient")
    assert client.patch("/api/me/settings", json={"alertWaitMinutes": 45}, headers=auth(token)).status_code == 422

def test_short_password_422(client):
    r = client.post("/api/auth/register", json={"username": "ana", "password": "123", "displayName": "Ana", "role": "patient"})
    assert r.status_code == 422
```

Validaciones: `username` de 3 a 30 caracteres `[a-zA-Z0-9_.]`, `password` de 6 caracteres como mínimo, `alertWaitMinutes ∈ {30,60,90}`.

- [ ] **Step 3: Verificar que fallan**

Run: `cd backend && uv run pytest tests/test_auth.py -v`
Expected: FAIL (ImportError, `app.main` no existe)

- [ ] **Step 4: Implementar** `config.py` (pydantic-settings: `database_url` default `sqlite:///./medirecord.db`, `jwt_secret`, `cors_origins: list[str]`). Si `database_url` empieza con `postgres://` o `postgresql://`, reescribirlo a `postgresql+psycopg://` porque Railway entrega el formato sin driver. Después `db.py`, `models.py`, `schemas.py` (base con `alias_generator=to_camel, populate_by_name=True`), `security.py` (bcrypt + PyJWT HS256, claim `sub`, `exp` a 30 días), `clock.py`, `routers/auth.py` y `main.py` (CORS con `settings.cors_origins`, `SQLModel.metadata.create_all` en el lifespan). `link_code` se genera con `secrets.randbelow(10**6)` con padding de 6 dígitos y se reintenta si choca. `conftest.py` usa SQLite en memoria con `StaticPool`.

- [ ] **Step 5: Verificar que pasan**

Run: `cd backend && uv run pytest tests/test_auth.py -v`
Expected: 9 passed

- [ ] **Step 6: `railway.json`**

```json
{ "build": { "builder": "NIXPACKS" },
  "deploy": { "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT", "healthcheckPath": "/api/health" } }
```

Run: `cd backend && uv run uvicorn app.main:app --port 8000` y en otra terminal `curl localhost:8000/api/health`
Expected: `{"status":"ok"}`

- [ ] **Step 7: Commit**

```bash
git add backend .gitignore
git commit -m "feat(backend): scaffold FastAPI con auth usuario+contraseña y ajustes"
```

---

### Task 2: Lógica pura de agenda (`schedule.py`)

**Files:**
- Create: `backend/app/schedule.py`, `backend/tests/test_schedule.py`
- Modify: `backend/app/models.py` (agregar `Medicine`, `DoseLog`)

**Interfaces:**
- Consumes: nada de HTTP. Solo modelos.
- Produces:
  - `models.Medicine`: `id:int`, `patient_id:int` (FK user), `name:str`, `dose:str`, `concentration:str=''`, `amount:str=''`, `times:list[str]` (columna JSON, "HH:MM" ordenados), `days:list[str]` (JSON, claves `lun..dom`), `status:Literal['active','paused']='active'`, `added_by:str` (display_name de quien la cargó), `created_at:datetime`, `deleted_at:datetime|None`.
  - `models.DoseLog`: `id:int`, `medicine_id:int`, `patient_id:int`, `day:date`, `scheduled_time:str`, `status:Literal['pending','taken','omitted']`, `registered_at:datetime|None` (UTC), `omission_reason:str|None`, `postponed_until:str|None`, `caregiver_attended_at:datetime|None`. `UniqueConstraint(medicine_id, day, scheduled_time)`. `status='pending'` solo existe para guardar un posponer o un aviso atendido.
  - `schedule.DoseView` (dataclass): `id, medicine_id, medicine_name, time, dose_description, status: 'pending'|'taken'|'omitted'|'unconfirmed', taken_at:str|None, omitted_at:str|None, omission_reason, is_delayed:bool, postponed_until, notice_attended:bool`. Los campos `taken_at` y `omitted_at` van en "HH:MM" en la zona de la paciente.
  - `schedule.dose_id(medicine_id:int, day:date, time:str) -> str` → `"{medicine_id}_{YYYY-MM-DD}_{HHMM}"`. `schedule.parse_dose_id(s) -> tuple[int, date, str]` lanza `ValueError` si el formato es inválido.
  - `schedule.local_today(now_utc:datetime, tz:str) -> date`
  - `schedule.build_day_doses(medicines:list[Medicine], logs:list[DoseLog], day:date, now_utc:datetime, tz:str, wait_minutes:int) -> list[DoseView]`, ordenado por `time`.

Reglas de `build_day_doses` (las fija este plan):
1. Una medicina aporta tomas a `day` si cumple todo esto: `created_at` (en tz local) ≤ `day`, `deleted_at` es nulo o su fecha local es > `day`, `status=='active'` y la clave del día de la semana de `day` está en `days` (los `days` vacíos significan todos los días).
2. Todo `DoseLog` de ese día con estado `taken` u `omitted` aparece **siempre**, aunque la medicina esté pausada, borrada o con otro horario (Review Focus 2 y 3).
3. Estado de una toma sin log terminal: `unconfirmed` si `day < hoy_local` o si `now_local > day+time+wait_minutes`. Si no, `pending`.
4. `is_delayed = taken_at > time + wait_minutes`. Es lo que la UI muestra como "con retraso".
5. `dose_description` = `medicine.dose`.

- [ ] **Step 1: Escribir los tests que fallan en `tests/test_schedule.py`**

Helpers locales: `med(id, times, days=ALL, created=date(2026,11,1), status='active', deleted=None)` y `log(med_id, day, time, status, registered_utc=None, reason=None)`. `TZ='America/Argentina/Buenos_Aires'` (UTC−3). `D = date(2026,11,26)` (jueves).

```python
def test_dose_id_roundtrip():
    assert dose_id(7, D, "08:00") == "7_2026-11-26_0800"
    assert parse_dose_id("7_2026-11-26_0800") == (7, D, "08:00")
    with pytest.raises(ValueError): parse_dose_id("basura")

def test_day_uses_patient_timezone():
    assert local_today(datetime(2026,11,27,1,30,tzinfo=UTC), TZ) == D

def test_pending_before_threshold_unconfirmed_after():
    m = med(1, ["14:00"])
    at_1459 = datetime(2026,11,26,17,59,tzinfo=UTC)   # 14:59 local
    at_1501 = datetime(2026,11,26,18,1,tzinfo=UTC)    # 15:01 local
    assert build_day_doses([m], [], D, at_1459, TZ, 60)[0].status == "pending"
    assert build_day_doses([m], [], D, at_1501, TZ, 60)[0].status == "unconfirmed"

def test_past_day_without_log_is_unconfirmed():
    doses = build_day_doses([med(1, ["08:00"])], [], D - timedelta(days=1), NOW, TZ, 60)
    assert doses[0].status == "unconfirmed"

def test_taken_log_sets_local_taken_at_and_delay():
    l = log(1, D, "14:00", "taken", registered_utc=datetime(2026,11,26,18,20,tzinfo=UTC))  # 15:20 local
    d = build_day_doses([med(1, ["14:00"])], [l], D, NOW, TZ, 60)[0]
    assert (d.status, d.taken_at, d.is_delayed) == ("taken", "15:20", True)

def test_days_filter_excludes_other_weekdays():
    assert build_day_doses([med(1, ["08:00"], days=["lun"])], [], D, NOW, TZ, 60) == []

def test_paused_medicine_has_no_new_doses():
    assert build_day_doses([med(1, ["08:00"], status="paused")], [], D, NOW, TZ, 60) == []

def test_medicine_created_after_day_not_in_past():
    assert build_day_doses([med(1, ["08:00"], created=D)], [], D - timedelta(days=1), NOW, TZ, 60) == []

def test_logged_dose_survives_schedule_change():
    l = log(1, D, "08:00", "taken", registered_utc=datetime(2026,11,26,11,5,tzinfo=UTC))
    doses = build_day_doses([med(1, ["09:00"])], [l], D, NOW, TZ, 60)
    assert [(d.time, d.status) for d in doses] == [("08:00", "taken"), ("09:00", "pending")]

def test_deleted_medicine_keeps_past_logs():
    m = med(1, ["08:00"], deleted=datetime(2026,11,26,12,0,tzinfo=UTC))
    l = log(1, D - timedelta(days=1), "08:00", "taken", registered_utc=datetime(2026,11,25,11,0,tzinfo=UTC))
    assert [d.status for d in build_day_doses([m], [l], D - timedelta(days=1), NOW, TZ, 60)] == ["taken"]
    assert build_day_doses([m], [], D + timedelta(days=1), NOW, TZ, 60) == []

def test_postponed_pending_log_keeps_pending_and_value():
    l = log(1, D, "14:00", "pending"); l.postponed_until = "14:10"
    d = build_day_doses([med(1, ["14:00"])], [l], D, datetime(2026,11,26,17,5,tzinfo=UTC), TZ, 60)[0]
    assert (d.status, d.postponed_until) == ("pending", "14:10")
```

(`NOW = datetime(2026,11,26,15,0,tzinfo=UTC)`, es decir 12:00 local.)

- [ ] **Step 2: Verificar que fallan**

Run: `cd backend && uv run pytest tests/test_schedule.py -v`
Expected: FAIL (ImportError)

- [ ] **Step 3: Implementar `schedule.py` y los modelos** con `zoneinfo.ZoneInfo`. Clave de día de la semana: `['lun','mar','mie','jue','vie','sab','dom'][day.weekday()]`.

- [ ] **Step 4: Verificar que pasan**

Run: `cd backend && uv run pytest tests/test_schedule.py -v`
Expected: 11 passed

- [ ] **Step 5: Commit**

```bash
git add backend/app/schedule.py backend/app/models.py backend/tests/test_schedule.py
git commit -m "feat(backend): cálculo de tomas del día a partir de horarios y registros"
```

---

### Task 3: Vínculo paciente-familiar

**Files:**
- Create: `backend/app/access.py`, `backend/app/routers/link.py`, `backend/tests/test_link.py`
- Modify: `backend/app/models.py` (agregar `CareLink`), `backend/app/main.py` (incluir router)

**Interfaces:**
- Consumes: `get_current_user`, `User.link_code` (Task 1).
- Produces:
  - `models.CareLink`: `id, patient_id, caregiver_id, status: Literal['pending','accepted','rejected'], created_at`. Hay como máximo un link `pending|accepted` por caregiver y uno por paciente.
  - `access.resolve_patient(user, session) -> User`: si es paciente, se devuelve a sí misma. Si es familiar, devuelve el paciente con link `accepted`. Si no tiene, lanza `HTTPException(404, "Sin persona vinculada")`.
  - `access.require_patient(user) -> User`: lanza 403 si `role != 'patient'`.
  - `schemas.LinkOut`: `{status: 'none'|'pending'|'accepted'|'rejected', otherDisplayName: str|None, otherUsername: str|None}`
  - Endpoints:
    - `GET /api/link` → `LinkOut` (el último link del usuario; `none` si no hay)
    - `POST /api/link/invite` `{code}` (solo familiar; acepta el código con o sin espacios) → `201 LinkOut` `pending`. Código inexistente → 404. Si el familiar ya tiene un link activo → 409.
    - `POST /api/link/accept` y `POST /api/link/reject` (solo paciente, sobre su link `pending`) → `LinkOut`. Sin pendiente → 404.
    - `DELETE /api/link` (cualquiera de los dos) → `204`. El link pasa a `rejected`.

- [ ] **Step 1: Tests que fallan**

```python
def test_invite_accept_flow(client):
    pt, p = register(client, "ana", "patient", display_name="Ana")
    ct, _ = register(client, "augusto", "caregiver", display_name="Augusto")
    code = p["linkCode"][:3] + " " + p["linkCode"][3:]
    assert client.post("/api/link/invite", json={"code": code}, headers=auth(ct)).json()["status"] == "pending"
    assert client.get("/api/link", headers=auth(pt)).json() == {"status": "pending", "otherDisplayName": "Augusto", "otherUsername": "augusto"}
    assert client.post("/api/link/accept", headers=auth(pt)).json()["status"] == "accepted"
    assert client.get("/api/link", headers=auth(ct)).json()["otherDisplayName"] == "Ana"

def test_reject(client): ...           # reject → status "rejected"; el familiar ve "rejected"
def test_wrong_code_404(client): ...   # invite {"code": "000000"} sin paciente con ese código → 404
def test_patient_cannot_invite_403(client): ...
def test_caregiver_cannot_accept_403(client): ...
def test_double_invite_409(client): ...
def test_unlink(client): ...           # después de accept, DELETE → 204, GET → status "rejected"
def test_get_link_none(client): ...    # usuario nuevo → {"status": "none", "otherDisplayName": None, "otherUsername": None}
```

- [ ] **Step 2: Run** `cd backend && uv run pytest tests/test_link.py -v`. Expected: FAIL.
- [ ] **Step 3: Implementar** `CareLink`, `access.py` y `routers/link.py`.
- [ ] **Step 4: Run** `cd backend && uv run pytest -v`. Expected: todos pasan (auth + schedule + link).
- [ ] **Step 5: Commit** `git commit -m "feat(backend): vínculo paciente-familiar por código de 6 dígitos"`

---

### Task 4: Medicinas, tomas e historial (API)

**Files:**
- Create: `backend/app/routers/medicines.py`, `backend/app/routers/doses.py`, `backend/tests/test_medicines.py`, `backend/tests/test_doses.py`
- Modify: `backend/app/schemas.py`, `backend/app/main.py`

**Interfaces:**
- Consumes: `resolve_patient`, `require_patient` (Task 3), `build_day_doses`, `local_today`, `dose_id`, `parse_dose_id` (Task 2), `get_now` (Task 1).
- Produces (todas autenticadas, y el paciente objetivo es siempre `resolve_patient(current_user)`):
  - `schemas.MedicineIn`: `name` (no vacío), `dose` (no vacío), `concentration=''`, `amount=''`, `times: list[str]` (1 o 2 valores "HH:MM" válidos, sin duplicados), `days: list[DayKey]` (al menos 1). `MedicineUpdate` = los mismos campos, todos opcionales.
  - `schemas.MedicineOut`: `id:str` (el id como string, porque el TS usa `string`), `name, dose, concentration, amount, times, days, frequency, addedBy, status`. `frequency` se calcula en el servidor con la misma lógica que `formatDaysFrequency` de `src/utils/scheduleUtils.ts` (portarla a `schedule.format_days_frequency(days) -> str`, con los mismos textos en español).
  - `schemas.DoseOut`: los campos de `DoseRecord` de `src/types.ts`: `id, medicineId, medicineName, time, doseDescription, status, takenAt?, omittedAt?, omissionReason?, isDelayed, postponedUntil?`, más `noticeAttended: bool`.
  - `schemas.DayOut`: `{date: "YYYY-MM-DD", isToday: bool, doses: DoseOut[]}`
  - Endpoints de medicinas:
    - `GET /api/medicines` → `MedicineOut[]` (sin las borradas)
    - `POST /api/medicines` → `201 MedicineOut` (`added_by` = display_name del usuario que la crea; pueden crearla tanto la paciente como el familiar)
    - `PATCH /api/medicines/{id}` → `MedicineOut`
    - `POST /api/medicines/{id}/toggle-pause` → `MedicineOut`
    - `DELETE /api/medicines/{id}` → `204` (soft delete). Una medicina de otro paciente o ya borrada → 404.
  - Endpoints de tomas:
    - `GET /api/doses/today` → `DayOut`
    - `GET /api/history?days=7` → `DayOut[]` desde hoy hacia atrás, `1 ≤ days ≤ 31`
    - `POST /api/doses/{doseId}/take` → `DoseOut` (solo paciente; `registered_at = now`)
    - `POST /api/doses/{doseId}/omit` `{reason}` → `DoseOut` (solo paciente)
    - `POST /api/doses/{doseId}/postpone` `{minutes: 10}` → `DoseOut` (solo paciente; `postponed_until = max(now_local, time) + minutes`, en "HH:MM")
    - `POST /api/doses/{doseId}/undo` → `DoseOut` (solo paciente; vuelve el log a `pending` y borra `registered_at`, `omission_reason` y `postponed_until`)
    - `POST /api/doses/{doseId}/attend` → `DoseOut` (solo familiar; setea `caregiver_attended_at`)
    - Una dosis válida es la que tiene un `doseId` parseable, cuya medicina pertenece al paciente y cuyo día es hoy o anterior. Si no, 404. Las acciones de la paciente solo valen para **hoy** (las de días pasados → 409, "Solo se pueden registrar tomas de hoy").
    - Los logs se hacen con upsert sobre `(medicine_id, day, scheduled_time)`.

- [ ] **Step 1: Tests que fallan en `test_medicines.py`**

```python
def test_create_and_list(client, patient):          # fixture: token de paciente "ana"
    r = client.post("/api/medicines", json=MET, headers=auth(patient))   # MET = Metformina 500 mg, ["14:00","20:00"], todos los días
    assert r.status_code == 201 and r.json()["frequency"] == "Todos los días" and r.json()["addedBy"] == "Ana"
    assert [m["name"] for m in client.get("/api/medicines", headers=auth(patient)).json()] == ["Metformina"]

def test_frequency_weekdays(client, patient): ...   # days lun..vie → "Lunes a Viernes"
def test_invalid_time_422(client, patient): ...     # times ["25:00"] → 422; times [] → 422; days [] → 422
def test_toggle_pause(client, patient): ...         # active → paused → active
def test_delete_medicine_keeps_history(client, patient, set_now):
    # crear con times ["08:00"], take hoy, DELETE → 204, GET /api/medicines == [], GET /api/doses/today sigue con ("08:00","taken")
def test_caregiver_linked_can_add_medicine(client, linked_pair): ...   # addedBy == "Augusto"
def test_unlinked_caregiver_gets_404(client):
    ct, _ = register(client, "solo", "caregiver")
    assert client.get("/api/medicines", headers=auth(ct)).status_code == 404
def test_other_patients_medicine_404(client): ...   # PATCH sobre la medicina de otra paciente → 404
```

Fixtures nuevas en `conftest.py`: `patient` (token de "ana", display "Ana"), `linked_pair` → `(patient_token, caregiver_token)` con un link aceptado.

- [ ] **Step 2: Tests que fallan en `test_doses.py`** (con `set_now` en el 2026-11-26 a las 14:02 local)

```python
def test_today_lists_scheduled_doses(...):          # med con ["08:00","14:00"] → 2 doses; 08:00 "unconfirmed", 14:00 "pending"
def test_take_dose(...):                            # take → status "taken", takenAt "14:02", isDelayed False
def test_omit_requires_valid_reason(...):           # {"reason": "Me sentí mal"} ok; {"reason": "x"} → 422
def test_postpone(...):                             # postpone 14:00 a las 14:02 → postponedUntil "14:12"
def test_undo(...):                                 # take y después undo → status "pending", takenAt None
def test_caregiver_cannot_take_dose(...):           # linked_pair: el familiar hace take → 403
def test_caregiver_attend(...):                     # el familiar hace attend → noticeAttended True; la paciente hace attend → 403
def test_bad_dose_id_404(...):                      # "nope" → 404; medicina de otro paciente → 404
def test_cannot_take_past_day_409(...):             # doseId de ayer → 409
def test_history_7_days(...):                       # med creada hace 10 días → 7 DayOut, el primero con isToday True; los días pasados sin log → "unconfirmed"
```

- [ ] **Step 3: Run** `cd backend && uv run pytest tests/test_medicines.py tests/test_doses.py -v`. Expected: FAIL.
- [ ] **Step 4: Implementar** los routers. La serialización de `DoseView` a `DoseOut` va en un único helper `to_dose_out`.
- [ ] **Step 5: Run** `cd backend && uv run pytest -v`. Expected: todo pasa.
- [ ] **Step 6: Commit** `git commit -m "feat(backend): API de medicinas, tomas del día e historial"`

---

### Task 5: Deploy del backend en Railway

**Files:**
- Create: `backend/README.md` (cómo correrlo y cómo deployarlo)

Este paso necesita la cuenta de Railway del usuario. El implementador prepara todo y le pasa los comandos.

- [ ] **Step 1:** En Railway: New Project → Deploy from GitHub repo → **Root Directory `backend`**. Agregar el plugin PostgreSQL. Variables del servicio: `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `JWT_SECRET=<python -c "import secrets;print(secrets.token_urlsafe(48))">`, `CORS_ORIGINS=https://<proyecto>.vercel.app,http://localhost:5173`.
- [ ] **Step 2: Verificar**. Run: `curl https://<backend>.up.railway.app/api/health`. Expected: `{"status":"ok"}`.
- [ ] **Step 3: Verificar contra Postgres real**. Run: `curl -X POST .../api/auth/register -H 'content-type: application/json' -d '{"username":"prueba","password":"secret123","displayName":"Prueba","role":"patient"}'`. Expected: 201 con token. Después borrar ese usuario desde la consola de datos de Railway.
- [ ] **Step 4: Commit** `git commit -m "docs(backend): guía de ejecución y deploy en Railway"`

---

### Task 6: Cliente API y pantalla de login/registro (frontend)

**Files:**
- Create: `src/api/client.ts`, `src/api/client.test.ts`, `src/components/common/AuthScreen.tsx`, `.env.example` (`VITE_API_URL=http://localhost:8000`)
- Modify: `package.json` (devDependency `vitest`, script `"test": "vitest run"`), `src/types.ts`

**Interfaces:**
- Produces:
  - `src/api/client.ts`:
    - `TOKEN_KEY = 'medirecord_token'`
    - `setOnUnauthorized(fn: () => void): void`
    - `api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T>`: antepone `import.meta.env.VITE_API_URL`, agrega el Bearer si hay token y serializa `body` como JSON. Con 204 devuelve `undefined`. Con 401 borra el token, llama a `onUnauthorized` y lanza `ApiError`. Con otros códigos ≥400 lanza `ApiError(status, detail)`, donde `detail` sale del JSON `detail` de FastAPI (si viene como array de 422, usar el `msg` del primer elemento).
    - `class ApiError extends Error { status: number }`
  - `src/types.ts`: agregar `ApiUser` (igual que `UserOut`), `LinkInfo` (igual que `LinkOut`), `DayDoses = { date: string; isToday: boolean; doses: DoseRecord[] }`. Agregar `noticeAttended?: boolean` a `DoseRecord`. Agregar `'unconfirmed'` ya existe en `DoseStatus`. Borrar `DayHistory`, `SpecialView` (excepto `'none' | 'onboarding-roberto' | 'onboarding-silvana'`) y de `MediRecordState` los campos `familyCode`, `pendingInvitation`, `invitationRejected`, `familyLinked`, `noticeAttendedBySilvana` y `history` (se reemplazan en Task 7).
  - `AuthScreen` props: `{ onLogin(username: string, password: string): Promise<void>; onRegister(data: { username: string; password: string; displayName: string; role: 'patient' | 'caregiver' }): Promise<void> }`. Tiene dos modos ("Entrar" / "Crear cuenta"). En registro, el selector de rol dice «Voy a tomar mis medicinas» / «Acompaño a alguien». Muestra `ApiError.message` debajo del formulario. Se reutilizan estilos y marca de `LoginInitialScreen.tsx` (logo, paleta, `btn-primary`), sin el botón de Google.

- [ ] **Step 1: Test que falla `src/api/client.test.ts`** (vitest, `globalThis.fetch` mockeado con `vi.fn`, `localStorage` de jsdom: agregar `environment: 'jsdom'` en `vite.config.ts` → `test`, y `jsdom` como devDependency)

```ts
it('sends bearer token and JSON body', async () => { /* token 'abc' → header Authorization 'Bearer abc', body JSON.stringify */ });
it('401 clears token and calls onUnauthorized', async () => {
  localStorage.setItem(TOKEN_KEY, 'abc'); const cb = vi.fn(); setOnUnauthorized(cb);
  fetchReturns(401, { detail: 'Token inválido' });
  await expect(api('/api/me')).rejects.toBeInstanceOf(ApiError);
  expect(localStorage.getItem(TOKEN_KEY)).toBeNull(); expect(cb).toHaveBeenCalledOnce();
});
it('422 array detail becomes first msg', async () => { /* detail [{msg:'Value error, x'}] → error.message 'Value error, x' */ });
it('204 resolves undefined', async () => { /* ... */ });
```

- [ ] **Step 2: Run** `npm test`. Expected: FAIL (módulo inexistente).
- [ ] **Step 3: Implementar** `client.ts`, `AuthScreen.tsx` y los cambios de tipos.
- [ ] **Step 4: Run** `npm test`. Expected: 4 passed. (`npm run build` todavía puede fallar por los tipos borrados. Se arregla en Task 7.)
- [ ] **Step 5: Commit** `git commit -m "feat(front): cliente API con token y pantalla de login/registro"`

---

### Task 7: `MediRecordContext` contra la API

**Files:**
- Modify: `src/context/MediRecordContext.tsx` (reescritura), `src/App.tsx`
- Delete: `src/data/initialData.ts`, `src/components/DemoControlBar.tsx`, `src/components/common/LoginGoogleConfirmScreen.tsx`, `src/components/common/LoginInitialScreen.tsx` (una vez portado su estilo a `AuthScreen`), `src/components/common/RoleSelectionView.tsx`

**Interfaces:**
- Consumes: `api`, `ApiError`, `setOnUnauthorized`, `TOKEN_KEY` (Task 6). Endpoints de Tasks 1, 3 y 4.
- Produces: `useMediRecord()` devuelve:
  - `state: MediRecordState` con `currentRole` (`'roberto'` si `user.role==='patient'`, si no `'silvana'`), `currentTab`, `specialView`, `fontSize`, `highContrast`, `soundEnabled`, `vibrationEnabled`, `voiceConfirmationEnabled`, `silvanaAlertWaitMinutes` (de `user.alertWaitMinutes`), `medicines`, `todayDoses`, `todayDate: string`, `history: DayDoses[]`, más los campos nuevos `user: ApiUser | null`, `link: LinkInfo`, `loading: boolean`.
  - Acciones con **los mismos nombres y parámetros que hoy**, ahora `async` (`Promise<void>`): `markDoseTaken(doseId)` (se elimina `customTime`), `markDoseOmitted(doseId, reason)`, `postponeDose(doseId, minutes=10)`, `undoDoseStatus(doseId)`, `attendNotice(doseId)` (reemplaza a `attendNoticeSilvana()`, que no recibía dosis), `addMedicine`, `updateMedicine`, `togglePauseMedicine`, `deleteMedicine`, `setFontSize`, `setHighContrast`, `setSoundEnabled`, `setVibrationEnabled`, `setVoiceConfirmationEnabled`, `setSilvanaAlertWait` (todas las de ajustes hacen PATCH a `/api/me/settings`), `inviteByCode(code)`, `acceptInvitation()`, `rejectInvitation()`, `unlink()`, `login(username, password)`, `register(data)`, `logout()`, `refresh()`.
  - Se mantienen `showToast`, `dismissToast`, `toasts`, `setTab` y `setSpecialView`.
  - Se eliminan `setRole`, `markDoseUnconfirmed`, `toggleFamilyLink`, `setPendingInvitation` y `resetDemo`.
- Comportamiento: `refresh()` pide en paralelo `/api/me`, `/api/link` y, si hay paciente accesible, `/api/medicines`, `/api/doses/today` y `/api/history?days=7`. Para un familiar sin link aceptado no se piden estos tres (dejarlos vacíos). Toda acción que modifica datos llama a `refresh()` al terminar y muestra los mismos toasts que hoy, con los nombres reales. Si la acción falla, muestra un toast `'alert'` con `error.message`. Se hace polling de `refresh()` cada 60 s y al volver la pestaña visible (`visibilitychange`), para que "unconfirmed" aparezca solo y el familiar vea cambios. Desde `localStorage` solo se persiste el token.
- `App.tsx`: si no hay token, muestra `AuthScreen`. Si `loading`, un spinner. Al registrarse, `specialView` pasa a `onboarding-roberto` o `onboarding-silvana` según el rol. Si no, `PhoneMockup`. Se quita `DemoControlBar`.

- [ ] **Step 1: Implementar** la reescritura. Esta tarea no lleva test automático propio: el contrato de cada endpoint ya está cubierto en backend y el cliente en Task 6.
- [ ] **Step 2: Verificar tipos**. Run: `npx tsc -b`. Expected: solo quedan errores en los componentes listados en Task 8 (esa lista es la entrada de Task 8). Ninguno en `context/` ni en `App.tsx`.
- [ ] **Step 3: Commit** `git commit -m "feat(front): MediRecordContext usa la API real; se quita modo demo"`

---

### Task 8: Componentes sin datos fijos

**Files:**
- Create: `src/utils/dateFormat.ts`, `src/utils/dateFormat.test.ts`, `src/utils/doseSelectors.ts`, `src/utils/doseSelectors.test.ts`
- Modify: `src/components/PhoneMockup.tsx`, `src/components/roberto/{RobertoHoyTab,RobertoHistorialTab,RobertoAjustesTab,InvitationReceivedScreen,OmissionModal}.tsx`, `src/components/silvana/{SilvanaResumenTab,SilvanaHistorialTab,SilvanaAjustesTab}.tsx`, `src/components/common/{MedicineManager,FamilyLinkWalkthroughModal,RobertoAccessFlow,SilvanaAccessFlow}.tsx`, `src/utils/scheduleUtils.ts`

**Interfaces:**
- Consumes: `useMediRecord()` de Task 7.
- Produces:
  - `formatLongDate(isoDate: string, todayIso: string): string` → `"Jueves 26 de noviembre"`. Si `isoDate` es ayer: `"Ayer · 25 de noviembre"`. Formato en español y con mayúscula inicial. Se arma con tablas propias de nombres de día y mes, no con `Intl`, para que el texto sea el mismo en todos los navegadores.
  - `nowHHMM(): string` → hora local "HH:MM" para la barra de estado.
  - `pickCurrentDose(doses: DoseRecord[]): DoseRecord | undefined` → la primera en orden de `time` con estado `unconfirmed`. Si no hay, la primera `pending`. Si tampoco hay, `undefined`.
  - `countTaken(doses: DoseRecord[]): { taken: number; total: number }`
  - Se borra `isScheduledForToday` de `scheduleUtils.ts` (ya lo resuelve el servidor).

Reemplazos obligatorios (en todos los archivos listados):
- "Roberto", "Roberto Gómez" y "tu hija Silvana" → `state.user.displayName` o `state.link.otherDisplayName` según quién mire. Si no hay vínculo, usar «tu persona de apoyo» o «la persona que acompañás».
- "Jueves 15 de octubre" y fechas `2026-10-*` → `formatLongDate(state.todayDate, state.todayDate)` o la fecha de cada `DayDoses`.
- `'482 716'` → `state.user.linkCode` formateado como `"XXX XXX"`.
- Horas literales (`'14:00'`, `'14:02'`, `'15:20'`, `'08:05'`, `'14:05'`) → los valores de la dosis (`time`, `takenAt`, `omittedAt`). La barra de estado de `PhoneMockup` usa `nowHHMM()` y se actualiza cada minuto.
- `"de 3 tomas"` y `takenCount === 3` → `countTaken(todayDoses)`.
- `RobertoHoyTab` y `SilvanaResumenTab`: la tarjeta grande con CTA trabaja sobre `pickCurrentDose(todayDoses)` (con el mismo markup por estado que hoy tiene `targetDose`). El resto de las dosis se renderiza con `.map` en la lista compacta que hoy usan `morningDose` y `eveningDose`. Si no hay dosis, estado vacío: «Hoy no tenés medicinas programadas» (paciente) / «Hoy no tiene medicinas programadas» (familiar). Sin `pickCurrentDose` y con todas tomadas, se muestra la tarjeta «Listo por hoy».
- Los historiales iteran `state.history` (`DayDoses[]`) con `formatLongDate`. La nota de cada registro se arma en el cliente: «Registrada a las {takenAt}» / «No tomada: lo indicó a las {omittedAt} ({omissionReason})» / «Sin confirmar».
- Ajustes de la paciente: vincular por código se cambia por "aceptar o rechazar invitación pendiente" (`state.link.status === 'pending'`) + mostrar su código + «Desvincular». Ajustes del familiar: ingresar el código de la paciente (`inviteByCode`) + estado del vínculo + «Desvincular». En los dos: botón «Cerrar sesión» → `logout()`. Se quita «Cambiar a modo Roberto/Silvana».
- «Llamar»: se quita el toast simulado. Fase 2 = `tel:` cuando exista el teléfono en el perfil. Por ahora, el botón se oculta.

- [ ] **Step 1: Tests que fallan**

```ts
// dateFormat.test.ts
expect(formatLongDate('2026-11-26', '2026-11-26')).toBe('Jueves 26 de noviembre');
expect(formatLongDate('2026-11-25', '2026-11-26')).toBe('Ayer · 25 de noviembre');
expect(formatLongDate('2026-12-31', '2026-11-26')).toBe('Jueves 31 de diciembre');
expect(formatLongDate('2026-03-01', '2026-03-02')).toBe('Ayer · 1 de marzo');   // cruce de mes
// doseSelectors.test.ts
expect(pickCurrentDose([d('08:00','taken'), d('14:00','pending'), d('20:00','pending')])?.time).toBe('14:00');
expect(pickCurrentDose([d('08:00','pending'), d('14:00','unconfirmed')])?.time).toBe('14:00');
expect(pickCurrentDose([d('08:00','taken')])).toBeUndefined();
expect(countTaken([d('08:00','taken'), d('14:00','omitted')])).toEqual({ taken: 1, total: 2 });
```

- [ ] **Step 2: Run** `npm test`. Expected: FAIL.
- [ ] **Step 3: Implementar** los utils y los reemplazos en los componentes.
- [ ] **Step 4: Verificar que no quede nada hardcodeado**. Run: `grep -rnE "Roberto Gómez|Silvana Gómez|15 de octubre|2026-10|482 716|'14:0[0-9]'|'15:20'|de 3 tomas" src/` Expected: sin resultados. (Los nombres de componentes como `RobertoHoyTab` se aceptan.)
- [ ] **Step 5: Run** `npm test && npm run build && npm run lint`. Expected: tests pasan, build sin errores de tipos, lint sin errores.
- [ ] **Step 6: Smoke test E2E local** con backend (`uv run uvicorn app.main:app`) + `npm run dev`. Registrar la paciente "ana" y cargar Metformina a una hora que ya pasó y a otra que todavía no llegó. Verificar: la que pasó hace más de 60 min aparece «Sin confirmar», la futura aparece pendiente, «Ya la tomé» la marca con la hora real. En otra ventana privada, registrar al familiar e invitar con el código. Como paciente, aceptar. El familiar ve el resumen con el nombre «Ana». Si el familiar intenta registrar una toma, no tiene botón para hacerlo. Al cerrar sesión, vuelve al login.
- [ ] **Step 7: Commit** `git commit -m "feat(front): pantallas con datos reales, fechas y nombres dinámicos"`

---

### Task 9: Deploy del frontend en Vercel y cierre

**Files:**
- Modify: `README.md` (sección "Ejecución local y despliegue": backend + frontend + variables)

- [ ] **Step 1:** En Vercel, el proyecto apunta al root del repo (el `vercel.json` actual sirve). Variable de entorno `VITE_API_URL=https://<backend>.up.railway.app`. Deploy.
- [ ] **Step 2:** En Railway, confirmar que `CORS_ORIGINS` incluye la URL final de Vercel. Si cambió, redeploy.
- [ ] **Step 3: Verificar en producción** desde el celular: repetir el smoke test de Task 8 Step 6 sobre las URLs reales. Expected: mismo resultado, sin errores de CORS en la consola.
- [ ] **Step 4: Commit** `git commit -m "docs: guía de deploy Railway + Vercel"`
