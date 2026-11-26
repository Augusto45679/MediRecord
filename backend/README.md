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
| `DATABASE_URL` | `postgresql://...` | Railway la inyecta; `postgres://` se convierte a `postgresql+psycopg://` |
| `JWT_SECRET` | `python -c "import secrets;print(secrets.token_urlsafe(48))"` | **Obligatoria en producción** |
| `CORS_ORIGINS` | `https://medirecord.vercel.app,http://localhost:5173` | Separadas por coma, sin `/` final |

## Deploy en Railway

1. New Project → Deploy from GitHub repo → elegir este repo.
2. En el servicio: Settings → **Root Directory = `backend`** (usa `railway.json`).
3. Agregar un servicio **PostgreSQL** al proyecto.
4. Variables del servicio API:
   - `DATABASE_URL = ${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET = <secreto generado>`
   - `CORS_ORIGINS = https://<tu-proyecto>.vercel.app,http://localhost:5173`
5. Settings → Networking → Generate Domain.
6. Verificar: `curl https://<dominio>/api/health` → `{"status":"ok"}`.

Las tablas se crean solas al arrancar (`create_all`). No hay migraciones: si se cambia
un modelo después de tener datos reales, hay que agregar Alembic o migrar a mano.

## Endpoints

- `POST /api/auth/register` `{username, password, displayName, role: patient|caregiver}`
- `POST /api/auth/login` `{username, password}`
- `GET /api/me`, `PATCH /api/me/settings`
- `GET /api/link`, `POST /api/link/invite {code}`, `POST /api/link/accept|reject`, `DELETE /api/link`
- `GET|POST /api/medicines`, `PATCH|DELETE /api/medicines/{id}`, `POST /api/medicines/{id}/toggle-pause`
- `GET /api/doses/today`, `GET /api/history?days=7`
- `POST /api/doses/{doseId}/take|omit|postpone|undo|attend`

Docs interactivas: `/docs`.
