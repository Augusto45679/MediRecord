# MediRecord API

FastAPI + SQLModel + Postgres. Las tomas del día se calculan a partir del horario
de cada medicina y de los registros (`DoseLog`), en la zona horaria de la paciente
(`America/Argentina/Buenos_Aires` por defecto).

## Correr local

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000   # SQLite en ./medirecord.db
uv run pytest                                       # tests (SQLite en memoria)
TEST_DATABASE_URL=postgres://user:pw@localhost:5432/db uv run pytest   # contra Postgres
```

## Variables de entorno

| Variable | Ejemplo | Notas |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | `postgres://` se convierte a `postgresql+psycopg://` |
| `JWT_SECRET` | `python -c "import secrets;print(secrets.token_urlsafe(48))"` | **Obligatoria en producción** |
| `CORS_ORIGINS` | `https://medirecord.vercel.app,http://localhost:5173` | Separadas por coma, sin `/` final |

## Deploy en Render

1. Crear la base en [Neon](https://neon.tech) y copiar la connection string.
2. En Render: *New → Blueprint* con este repo (lee `render.yaml`), o *New → Web Service* con
   Root Directory `backend`, build `pip install uv && uv sync --frozen --no-dev` y start
   `uv run --no-dev uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. Variables: `DATABASE_URL` (la de Neon), `JWT_SECRET`, `CORS_ORIGINS`.
4. Verificar: `curl https://<dominio>/api/health` → `{"status":"ok"}`.

`railway.json` sigue en el repo por si se prefiere Railway (Root Directory `backend`).

Las tablas se crean solas al arrancar (`create_all`). Para columnas nuevas en tablas que ya
existen, agregarlas a `_NEW_COLUMNS` en `app/main.py`: se crean al arrancar si faltan.

## Endpoints

- `POST /api/auth/register` `{username, password, displayName, role: patient|caregiver}`
- `POST /api/auth/login` `{username, password}`
- `GET /api/me`, `PATCH /api/me/settings`
- `GET /api/link`, `POST /api/link/invite {code}`, `POST /api/link/accept|reject`, `DELETE /api/link`
- `GET|POST /api/medicines`, `PATCH|DELETE /api/medicines/{id}`, `POST /api/medicines/{id}/toggle-pause`
- `GET /api/doses/today`, `GET /api/history?days=7`
- `POST /api/doses/{doseId}/take|omit|postpone|undo|attend`

Docs interactivas: `/docs`.
