# MediRecord

Recordatorios de medicación pensados para personas mayores, con la opción de que un familiar
acompañe sin vigilar.

La idea central: **no confirmar no significa no tomar**. Si la persona no marca una toma a
horario, la app no asume que se la salteó ni dispara alarmas al familiar en el acto. Espera un
margen configurable (60 minutos por defecto) y recién ahí la toma queda como «sin confirmar» y
el familiar ve un aviso.

Hay dos formas de usarla:

| | App Android | Web |
|---|---|---|
| Cuenta | No hace falta | Usuario y contraseña |
| Internet | No hace falta | Sí |
| Dónde se guardan los datos | En el teléfono | En el servidor (Postgres) |
| Notificaciones | Alarmas del sistema, aun con la app cerrada | No |
| Familiar acompañante | No | Sí, con un código de 6 dígitos |

## Qué hace

- **Medicinas**: nombre, dosis, presentación (comprimido, gotas, jarabe…), de 1 a 4 horarios por día.
- **Frecuencia**: días de la semana elegidos, o cada N días (2 a 30). Fecha de fin opcional para tratamientos cortos.
- **Hoy**: las tomas del día con su estado. Se marcan como tomadas, se posponen 10 minutos o se omiten con un motivo.
- **Historial**: últimos 7 días.
- **Stock** (opcional): descuenta unidades con cada toma y avisa cuando alcanza para 7 días o menos.
- **Accesibilidad**: tres tamaños de letra, alto contraste, áreas táctiles de 48 px o más, acciones destructivas siempre detrás de una confirmación.
- **Familiar** (solo web): ve las tomas y recibe el aviso cuando una queda sin confirmar. Puede marcar «ya hablé con ella» para no repetir el aviso.

### Notificaciones en Android

La app programa las tomas pendientes de los próximos 30 días como alarmas del sistema
(`@capacitor/local-notifications`). Suenan con la app cerrada y sin conexión. Cada notificación
trae los botones **Ya la tomé** y **Posponer 10 min**. Al abrir la app o cambiar algo se
reprograman.

Algunos fabricantes (Xiaomi, Samsung, Huawei) frenan las alarmas de apps instaladas fuera de
la tienda. Si llegan tarde: *Ajustes → Apps → MediRecord*, activar **Alarmas y recordatorios** y
poner **Batería → Sin restricciones**.

## Instalar la app Android

Bajar `MediRecord.apk` de la [última release](https://github.com/Augusto45679/MediRecord/releases/latest),
abrirlo en el teléfono y permitir la instalación desde orígenes desconocidos. Aceptar el
permiso de notificaciones al primer inicio.

Los datos viven solo en el teléfono: desinstalar la app o borrar sus datos los elimina.

## Estructura

```
src/
  api/client.ts           cliente HTTP; en Android redirige a la API local
  local/localApi.ts       "servidor" local de la app offline (mismas rutas que la API)
  native/alarms.ts        alarmas y botones de las notificaciones
  context/                estado global (MediRecordContext)
  components/
    roberto/              pantallas de la persona que toma la medicación
    silvana/              pantallas del familiar
    common/               formularios, alta/edición de medicinas, login
  utils/                  horarios, fechas, textos de frecuencia
backend/
  app/schedule.py         cálculo de tomas del día (lógica pura, con tests)
  app/routers/            auth, medicinas, tomas, vínculo con el familiar
android/                  proyecto Capacitor
```

El cálculo de tomas está duplicado a propósito: `backend/app/schedule.py` para la web y
`src/local/localApi.ts` para la app offline. Si se cambia uno hay que cambiar el otro; los tests
de ambos cubren los mismos casos.

## Desarrollo

Requisitos: Node 20+, Python 3.12+ con [uv](https://docs.astral.sh/uv/). Para compilar el APK:
JDK 21 y el Android SDK (alcanza con las command-line tools).

```bash
# API — SQLite local en backend/medirecord.db
cd backend && uv sync
uv run uvicorn app.main:app --reload --port 8000

# Web
cp .env.example .env      # VITE_API_URL=http://localhost:8000
npm install
npm run dev               # http://localhost:5173

# Probar el modo offline en el navegador, sin API
VITE_OFFLINE=1 npm run dev
```

Tests:

```bash
npm test                        # frontend (vitest), incluye la API local
cd backend && uv run pytest     # API
```

APK de prueba:

```bash
npm run build && npx cap sync android
cd android && JAVA_HOME=/usr/lib/jvm/java-21-openjdk ./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

`android/local.properties` tiene que apuntar al SDK (`sdk.dir=/home/<usuario>/Android/Sdk`).

## Despliegue de la web

- **Base de datos**: Postgres en [Neon](https://neon.tech) (plan gratuito).
- **API**: [Render](https://render.com), plan gratuito, con `render.yaml`. Variables:
  `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS` (orígenes separados por coma). El plan gratuito
  se duerme tras 15 minutos sin uso; el primer pedido tarda cerca de un minuto.
- **Frontend**: [Vercel](https://vercel.com), con `VITE_API_URL` apuntando a la API. Es una
  variable de compilación: después de cambiarla hay que redeployar.

Las tablas se crean solas al arrancar la API, y las columnas nuevas se agregan en
`backend/app/main.py` (`_NEW_COLUMNS`). Más detalle en [`backend/README.md`](backend/README.md).

## Stack

React 19, TypeScript, Vite, Capacitor 8 · FastAPI, SQLModel, Postgres · Vitest, pytest.

## Origen

Empezó como prototipo para una materia de Interacción Humano-Computadora, a partir de dos
proto-personas: Roberto (72, toma varias medicinas) y Silvana (44, su hija). Los nombres de las
carpetas `roberto/` y `silvana/` vienen de ahí. Los entregables de diseño (wireflow, mapa del
sitio, métricas de usabilidad) están en `png medirecord/`.

## Licencia

[MIT](LICENSE).
