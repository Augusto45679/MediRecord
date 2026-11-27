/**
 * "Servidor" local para la app Android offline: responde las mismas rutas que la API
 * (backend/app/routers) pero guarda todo en el teléfono. Sin cuentas ni familiar.
 *
 * La lógica de horarios replica backend/app/schedule.py: si cambia una, cambiar la otra.
 */
import type { ApiUser, DayOfWeek, DoseRecord, DoseStatus, MedForm, Medicine, OmissionReason } from '../types';
import { formatFrequency } from '../utils/scheduleUtils';

const DB_KEY = 'medirecord_offline_db';
export const LOCAL_TOKEN = 'offline';

const DAY_KEYS: DayOfWeek[] = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
const TERMINAL: DoseStatus[] = ['taken', 'omitted'];
const PERSISTED: DoseStatus[] = ['taken', 'omitted', 'unconfirmed'];
const HISTORY_LIMIT_DAYS = 31;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

interface StoredMedicine {
  id: number;
  name: string;
  dose: string;
  concentration: string;
  amount: string;
  times: string[];
  days: DayOfWeek[];
  intervalDays: number;
  endDate: string | null;
  form: MedForm;
  stock: number | null;
  stockPerDose: number;
  status: 'active' | 'paused';
  addedBy: string;
  createdAt: string; // ISO
  scheduleFrom: string | null; // ISO
  deletedAt: string | null; // ISO
}

interface StoredLog {
  medicineId: number;
  day: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: DoseStatus | 'pending';
  registeredAt: string | null; // ISO
  omissionReason: OmissionReason | null;
  postponedUntil: string | null;
}

interface Db {
  user: ApiUser | null;
  medicines: StoredMedicine[];
  logs: StoredLog[];
  nextId: number;
}

export class LocalError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ---------- almacenamiento ----------

function load(): Db {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as Db;
  } catch {
    /* base corrupta: se empieza de cero */
  }
  return { user: null, medicines: [], logs: [], nextId: 1 };
}

function save(db: Db): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ---------- fechas (hora local del teléfono) ----------

const pad = (n: number) => String(n).padStart(2, '0');
export const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hhmm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const minutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
/** "YYYY-MM-DD" → Date a las 00:00 local */
const dayStart = (day: string) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (day: string, n: number) => {
  const d = dayStart(day);
  d.setDate(d.getDate() + n);
  return isoDay(d);
};
const daysBetween = (a: string, b: string) => Math.round((dayStart(b).getTime() - dayStart(a).getTime()) / 86_400_000);
const weekdayKey = (day: string) => DAY_KEYS[(dayStart(day).getDay() + 6) % 7];
const atTime = (day: string, time: string) => new Date(dayStart(day).getTime() + minutes(time) * 60_000);

// ---------- cálculo de tomas (espejo de schedule.py) ----------

const scheduleStart = (m: StoredMedicine) => new Date(m.scheduleFrom ?? m.createdAt);

function isScheduledOn(m: StoredMedicine, day: string): boolean {
  if (m.status !== 'active') return false;
  const start = isoDay(scheduleStart(m));
  if (start > day) return false;
  if (m.deletedAt && isoDay(new Date(m.deletedAt)) <= day) return false;
  if (m.endDate && day > m.endDate) return false;
  if (m.intervalDays > 1) return daysBetween(start, day) % m.intervalDays === 0;
  return m.days.length === 0 || m.days.includes(weekdayKey(day));
}

const doseId = (medId: number, day: string, time: string) => `${medId}_${day}_${time.replace(':', '')}`;

function parseDoseId(id: string): [number, string, string] {
  const [med, day, t] = id.split('_');
  if (!med || !day || !/^\d{4}$/.test(t ?? '')) throw new LocalError(404, 'Toma no encontrada');
  return [Number(med), day, `${t.slice(0, 2)}:${t.slice(2)}`];
}

function buildDayDoses(medicines: StoredMedicine[], logs: StoredLog[], day: string, now: Date, wait: number): DoseRecord[] {
  const today = isoDay(now);
  const byId = new Map(medicines.map(m => [m.id, m]));
  const dayLogs = new Map(logs.filter(l => l.day === day).map(l => [`${l.medicineId}|${l.time}`, l]));
  const slots = new Map<string, StoredMedicine>();

  for (const m of medicines) {
    if (!isScheduledOn(m, day)) continue;
    const created = scheduleStart(m);
    const createdMin = isoDay(created) === day ? created.getHours() * 60 + created.getMinutes() : -1;
    for (const t of m.times) {
      // Una medicina cargada a mitad del día no genera avisos por horarios que ya vencieron.
      if (minutes(t) + wait < createdMin) continue;
      slots.set(`${m.id}|${t}`, m);
    }
  }
  for (const [key, l] of dayLogs) {
    const m = byId.get(l.medicineId);
    if (m && PERSISTED.includes(l.status as DoseStatus)) slots.set(key, m);
  }

  const out: DoseRecord[] = [];
  for (const [key, m] of slots) {
    const t = key.split('|')[1];
    const view: DoseRecord = {
      id: doseId(m.id, day, t),
      medicineId: String(m.id),
      medicineName: m.name,
      time: t,
      doseDescription: m.dose,
      status: 'pending',
      takenAt: null,
      omittedAt: null,
      omissionReason: null,
      isDelayed: false,
      postponedUntil: null,
      noticeAttended: false,
    };
    const l = dayLogs.get(key);
    if (l) view.postponedUntil = l.postponedUntil;
    if (l && TERMINAL.includes(l.status as DoseStatus)) {
      view.status = l.status as DoseStatus;
      const registered = l.registeredAt ? hhmm(new Date(l.registeredAt)) : null;
      if (l.status === 'taken') {
        view.takenAt = registered;
        view.isDelayed = registered !== null && minutes(registered) > minutes(t) + wait;
      } else {
        view.omittedAt = registered;
        view.omissionReason = l.omissionReason;
      }
      view.postponedUntil = null;
    } else {
      const deadline = new Date(atTime(day, t).getTime() + wait * 60_000);
      if (l?.status === 'unconfirmed' || day < today || now > deadline) view.status = 'unconfirmed';
    }
    out.push(view);
  }
  return out.sort((a, b) => a.time.localeCompare(b.time) || a.medicineName.localeCompare(b.medicineName));
}

/** Antes de pausar, editar horarios o borrar, guarda las tomas vencidas sin registro. */
function persistUnconfirmed(db: Db, m: StoredMedicine, now: Date, wait: number): void {
  const today = isoDay(now);
  const logs = db.logs.filter(l => l.medicineId === m.id);
  let day = isoDay(scheduleStart(m));
  const limit = addDays(today, -HISTORY_LIMIT_DAYS);
  if (day < limit) day = limit;
  for (; day <= today; day = addDays(day, 1)) {
    for (const v of buildDayDoses([m], logs, day, now, wait)) {
      if (v.status !== 'unconfirmed') continue;
      const existing = logs.find(l => l.day === day && l.time === v.time);
      if (existing && existing.status !== 'pending') continue;
      if (existing) existing.status = 'unconfirmed';
      else db.logs.push(newLog(m.id, day, v.time, 'unconfirmed'));
    }
  }
}

const newLog = (medicineId: number, day: string, time: string, status: StoredLog['status']): StoredLog => ({
  medicineId,
  day,
  time,
  status,
  registeredAt: null,
  omissionReason: null,
  postponedUntil: null,
});

// ---------- validación ----------

function checkTimes(v: unknown): string[] {
  if (!Array.isArray(v) || v.length < 1 || v.length > 4) throw new LocalError(422, 'Elegí entre uno y cuatro horarios');
  for (const t of v) if (typeof t !== 'string' || !TIME_RE.test(t)) throw new LocalError(422, `Horario inválido: ${t}`);
  if (new Set(v).size !== v.length) throw new LocalError(422, 'Los horarios no pueden repetirse');
  return [...v].sort();
}

function checkText(v: unknown): string {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!s) throw new LocalError(422, 'No puede estar vacío');
  return s;
}

const orderDays = (v: DayOfWeek[]) => DAY_KEYS.filter(d => v.includes(d));

// ---------- salida ----------

function toMedicine(m: StoredMedicine): Medicine {
  return {
    id: String(m.id),
    name: m.name,
    dose: m.dose,
    concentration: m.concentration,
    amount: m.amount,
    times: [...m.times],
    days: [...m.days],
    intervalDays: m.intervalDays,
    endDate: m.endDate,
    form: m.form,
    stock: m.stock,
    stockPerDose: m.stockPerDose,
    frequency: formatFrequency(m.days, m.intervalDays, m.endDate),
    addedBy: m.addedBy,
    status: m.status,
  };
}

function requireUser(db: Db): ApiUser {
  if (!db.user) throw new LocalError(401, 'Configurá la app para empezar.');
  return db.user;
}

const alive = (db: Db) => db.medicines.filter(m => !m.deletedAt);

function getMedicine(db: Db, id: number): StoredMedicine {
  const m = db.medicines.find(x => x.id === id && !x.deletedAt);
  if (!m) throw new LocalError(404, 'Medicina no encontrada');
  return m;
}

function days(db: Db, now: Date, first: string, last: string) {
  const wait = requireUser(db).alertWaitMinutes;
  const today = isoDay(now);
  const out = [];
  for (let day = last; day >= first; day = addDays(day, -1)) {
    out.push({ date: day, isToday: day === today, doses: buildDayDoses(db.medicines, db.logs, day, now, wait) });
  }
  return out;
}

// ---------- rutas ----------

type Body = Record<string, unknown>;

function doseAction(db: Db, id: string, now: Date, change: (log: StoredLog, m: StoredMedicine) => void): DoseRecord {
  const user = requireUser(db);
  const [medId, day, time] = parseDoseId(id);
  const m = db.medicines.find(x => x.id === medId);
  if (!m) throw new LocalError(404, 'Toma no encontrada');
  if (day !== isoDay(now)) throw new LocalError(409, 'Solo se pueden registrar tomas de hoy');
  let log = db.logs.find(l => l.medicineId === medId && l.day === day && l.time === time);
  const exists = buildDayDoses([m], log ? [log] : [], day, now, user.alertWaitMinutes).some(v => v.time === time);
  if (!exists) throw new LocalError(404, 'Toma no encontrada');
  if (!log) {
    log = newLog(medId, day, time, 'pending');
    db.logs.push(log);
  }
  change(log, m);
  save(db);
  const view = buildDayDoses([m], [log], day, now, user.alertWaitMinutes).find(v => v.time === time);
  return view ?? { id, medicineId: String(medId), medicineName: m.name, time, doseDescription: m.dose, status: 'pending' };
}

const adjustStock = (m: StoredMedicine, sign: number) => {
  if (m.stock !== null) m.stock = Math.max(0, m.stock + sign * m.stockPerDose);
};

export async function localApi<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const method = init.method ?? 'GET';
  const body = (init.body ?? {}) as Body;
  const [route, query = ''] = path.split('?');
  const params = new URLSearchParams(query);
  const now = new Date();
  const db = load();
  const r = (v: unknown) => v as T;
  let match: RegExpMatchArray | null;

  // --- usuario ---
  if (route === '/api/auth/register' && method === 'POST') {
    const name = checkText(body.displayName);
    db.user = {
      ...(db.user ?? {
        id: 1,
        username: 'yo',
        role: 'patient',
        linkCode: null,
        fontSize: 'large',
        highContrast: false,
        soundEnabled: true,
        vibrationEnabled: true,
        voiceConfirmationEnabled: false,
        alertWaitMinutes: 60,
      }),
      displayName: name,
    };
    save(db);
    return r({ token: LOCAL_TOKEN, user: db.user });
  }
  if (route === '/api/me' && method === 'GET') return r(requireUser(db));
  if (route === '/api/me/settings' && method === 'PATCH') {
    db.user = { ...requireUser(db), ...body } as ApiUser;
    save(db);
    return r(db.user);
  }
  if (route === '/api/link' && method === 'GET') return r({ status: 'none', otherDisplayName: null, otherUsername: null });
  if (route.startsWith('/api/link') || route === '/api/auth/login') {
    throw new LocalError(400, 'Esta función necesita internet y no está en la versión sin conexión.');
  }

  // --- medicinas ---
  if (route === '/api/medicines' && method === 'GET') {
    requireUser(db);
    return r(alive(db).sort((a, b) => a.id - b.id).map(toMedicine));
  }
  if (route === '/api/medicines' && method === 'POST') {
    const user = requireUser(db);
    const interval = Number(body.intervalDays ?? 1);
    const m: StoredMedicine = {
      id: db.nextId++,
      name: checkText(body.name),
      dose: checkText(body.dose),
      concentration: String(body.concentration ?? ''),
      amount: String(body.amount ?? ''),
      times: checkTimes(body.times),
      days: orderDays((body.days as DayOfWeek[]) ?? []),
      intervalDays: Math.min(30, Math.max(1, interval)),
      endDate: (body.endDate as string | null) ?? null,
      form: (body.form as MedForm) ?? 'comprimido',
      stock: body.stock === null || body.stock === undefined ? null : Number(body.stock),
      stockPerDose: Number(body.stockPerDose ?? 1),
      status: 'active',
      addedBy: user.displayName,
      createdAt: now.toISOString(),
      scheduleFrom: null,
      deletedAt: null,
    };
    if (m.intervalDays === 1 && m.days.length === 0) throw new LocalError(422, 'Elegí al menos un día');
    db.medicines.push(m);
    save(db);
    return r(toMedicine(m));
  }
  if ((match = route.match(/^\/api\/medicines\/(\d+)$/))) {
    const user = requireUser(db);
    const m = getMedicine(db, Number(match[1]));
    if (method === 'DELETE') {
      persistUnconfirmed(db, m, now, user.alertWaitMinutes);
      m.deletedAt = now.toISOString();
      save(db);
      return r(undefined);
    }
    if (method === 'PATCH') {
      const scheduleKeys = ['times', 'days', 'intervalDays', 'endDate'];
      if (scheduleKeys.some(k => k in body)) {
        persistUnconfirmed(db, m, now, user.alertWaitMinutes);
        m.scheduleFrom = now.toISOString();
      }
      if ('name' in body) m.name = checkText(body.name);
      if ('dose' in body) m.dose = checkText(body.dose);
      if ('concentration' in body) m.concentration = String(body.concentration ?? '');
      if ('amount' in body) m.amount = String(body.amount ?? '');
      if ('times' in body) m.times = checkTimes(body.times);
      if ('days' in body) m.days = orderDays(body.days as DayOfWeek[]);
      if ('intervalDays' in body) m.intervalDays = Math.min(30, Math.max(1, Number(body.intervalDays)));
      if ('endDate' in body) m.endDate = (body.endDate as string | null) ?? null;
      if ('form' in body) m.form = body.form as MedForm;
      if ('stock' in body) m.stock = body.stock === null ? null : Number(body.stock);
      if ('stockPerDose' in body) m.stockPerDose = Number(body.stockPerDose);
      save(db);
      return r(toMedicine(m));
    }
  }
  if ((match = route.match(/^\/api\/medicines\/(\d+)\/toggle-pause$/)) && method === 'POST') {
    const user = requireUser(db);
    const m = getMedicine(db, Number(match[1]));
    if (m.status === 'active') persistUnconfirmed(db, m, now, user.alertWaitMinutes);
    else m.scheduleFrom = now.toISOString();
    m.status = m.status === 'active' ? 'paused' : 'active';
    save(db);
    return r(toMedicine(m));
  }

  // --- tomas ---
  if (route === '/api/doses/today') {
    const t = isoDay(now);
    return r(days(db, now, t, t)[0]);
  }
  if (route === '/api/history') {
    const n = Math.min(31, Math.max(1, Number(params.get('days') ?? 7)));
    const t = isoDay(now);
    return r(days(db, now, addDays(t, -(n - 1)), t));
  }
  if (route === '/api/doses/upcoming') {
    const n = Math.min(60, Math.max(1, Number(params.get('days') ?? 7)));
    const t = isoDay(now);
    const out = [];
    for (const day of days(db, now, t, addDays(t, n - 1)).reverse()) {
      for (const d of day.doses) {
        if (d.status !== 'pending') continue;
        const at = atTime(day.date, d.postponedUntil || d.time);
        if (at > now) out.push({ doseId: d.id, medicineName: d.medicineName, doseDescription: d.doseDescription, at: at.toISOString() });
      }
    }
    return r(out);
  }
  if ((match = route.match(/^\/api\/doses\/([^/]+)\/(take|omit|postpone|undo)$/)) && method === 'POST') {
    const [, id, action] = match;
    return r(
      doseAction(db, id, now, (log, m) => {
        if (action === 'take') {
          if (log.status !== 'taken') adjustStock(m, -1);
          Object.assign(log, { status: 'taken', registeredAt: now.toISOString(), omissionReason: null, postponedUntil: null });
        } else if (action === 'omit') {
          if (log.status === 'taken') adjustStock(m, +1);
          Object.assign(log, { status: 'omitted', registeredAt: now.toISOString(), omissionReason: body.reason ?? 'Otro motivo', postponedUntil: null });
        } else if (action === 'undo') {
          if (log.status === 'taken') adjustStock(m, +1);
          Object.assign(log, { status: 'pending', registeredAt: null, omissionReason: null, postponedUntil: null });
        } else {
          if (log.status !== 'pending') throw new LocalError(409, 'Esa toma ya está registrada');
          // Desde la alarma con la app cerrada llega `pressedAt`: se pospone desde ese momento.
          const pressed = typeof body.pressedAt === 'string' ? new Date(body.pressedAt) : now;
          const from = isNaN(pressed.getTime()) || pressed > now ? now : pressed;
          const base = Math.min(Math.max(minutes(hhmm(from)), minutes(log.time)) + Number(body.minutes ?? 10), 23 * 60 + 59);
          log.postponedUntil = `${pad(Math.floor(base / 60))}:${pad(base % 60)}`;
        }
      })
    );
  }

  throw new LocalError(404, 'Ruta no disponible sin conexión');
}
