/**
 * Alarmas tipo despertador en la app Android. En el navegador no hace nada.
 *
 * La parte nativa (android/.../alarm/) programa cada toma con AlarmManager.setAlarmClock y, a la
 * hora, suena en loop por el canal de alarma con una pantalla completa sobre el bloqueo y los
 * botones "Ya la tomé" / "Posponer 10 minutos". Esas respuestas se guardan aunque la app esté
 * cerrada y se registran acá la próxima vez que la app corre (consumeAlarmActions).
 */
import { Capacitor, registerPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { api, ApiError } from '../api/client';

interface Upcoming {
  doseId: string;
  medicineName: string;
  doseDescription: string;
  at: string;
}

export interface AlarmPrefs {
  sound: boolean;
  vibration: boolean;
}

export interface AlarmStatus {
  notifications: boolean;
  exactAlarms: boolean;
  fullScreen: boolean;
  batteryUnrestricted: boolean;
}

export type AlarmSetting = 'notifications' | 'exactAlarms' | 'fullScreen' | 'battery' | 'app';

interface MedAlarmPlugin {
  schedule(opts: {
    alarms: { id: number; at: number; doseId: string; title: string; body: string }[];
    sound: boolean;
    vibration: boolean;
  }): Promise<void>;
  cancelAll(): Promise<void>;
  consumeActions(): Promise<{ actions: { action: 'take' | 'postpone'; doseId: string; at: number }[] }>;
  requeueActions(opts: { actions: { action: 'take' | 'postpone'; doseId: string; at: number }[] }): Promise<void>;
  status(): Promise<AlarmStatus>;
  requestNotifications(): Promise<{ granted: boolean }>;
  openSettings(opts: { which: AlarmSetting }): Promise<void>;
  test(opts: { seconds: number }): Promise<void>;
  addListener(event: 'alarmAction', fn: () => void): Promise<PluginListenerHandle>;
}

const MedAlarm = registerPlugin<MedAlarmPlugin>('MedAlarm');

// 30 días alcanzan aunque no se abra la app en semanas; Android limita las alarmas pendientes (~500).
const DAYS_AHEAD = 30;
const MAX_ALARMS = 400;
const TEST_ALARM_ID = 999_999; // reservado en MedAlarmPlugin.test

export const isNativeApp = () => Capacitor.isNativePlatform();

/** Id numérico estable (Android pide int32 > 0) a partir del id de la toma. */
export function numericId(doseId: string): number {
  let h = 0;
  for (let i = 0; i < doseId.length; i++) h = (Math.imul(31, h) + doseId.charCodeAt(i)) | 0;
  const id = (Math.abs(h) % 2_000_000_000) + 1;
  return id === TEST_ALARM_ID ? id + 1 : id;
}

let asked = false;
let prefs: AlarmPrefs = { sound: true, vibration: true };

export async function clearAlarms(): Promise<void> {
  if (isNativeApp()) await MedAlarm.cancelAll();
}

/**
 * Registra en la base local las respuestas dadas desde la alarma con la app cerrada.
 * Devuelve true si había alguna (para refrescar la pantalla).
 */
export async function consumeAlarmActions(): Promise<boolean> {
  if (!isNativeApp()) return false;
  const { actions } = await MedAlarm.consumeActions();
  const failed: typeof actions = [];
  for (const a of actions) {
    try {
      if (a.action === 'take') {
        await api(`/api/doses/${a.doseId}/take`, { method: 'POST' });
      } else {
        // `pressedAt`: posponer cuenta desde que se apretó el botón, no desde que se abrió la app.
        const pressedAt = new Date(a.at).toISOString();
        await api(`/api/doses/${a.doseId}/postpone`, { method: 'POST', body: { minutes: 10, pressedAt } });
      }
    } catch (err) {
      // 404 (toma de otro día) y 409 (ya registrada) no tienen arreglo: se descartan.
      // Cualquier otro error se reintenta después, para no perder lo que apretó la persona.
      if (!(err instanceof ApiError && (err.status === 404 || err.status === 409))) failed.push(a);
    }
  }
  if (failed.length) await MedAlarm.requeueActions({ actions: failed });
  return actions.length > failed.length;
}

let syncing: Promise<void> | null = null;
let rerun = false;

export function syncAlarms(next?: AlarmPrefs): Promise<void> {
  if (next) prefs = next;
  if (!isNativeApp()) return Promise.resolve();
  if (syncing) {
    // Hay una sincronización en curso con datos quizá viejos (p. ej. antes de marcar una toma).
    rerun = true;
    return syncing;
  }
  syncing = (async () => {
    try {
      if (!asked) {
        asked = true;
        await MedAlarm.requestNotifications();
      }
      // Primero las respuestas pendientes: si se pospuso desde la alarma, el nuevo horario sale de acá.
      await consumeAlarmActions();
      const upcoming = await api<Upcoming[]>(`/api/doses/upcoming?days=${DAYS_AHEAD}`);
      await MedAlarm.schedule({
        sound: prefs.sound,
        vibration: prefs.vibration,
        alarms: upcoming.slice(0, MAX_ALARMS).map(u => ({
          id: numericId(u.doseId),
          at: new Date(u.at).getTime(),
          doseId: u.doseId,
          title: `Hora de tu ${u.medicineName}`,
          body: u.doseDescription,
        })),
      });
    } catch {
      // Si algo falla quedan programadas las alarmas anteriores.
    } finally {
      syncing = null;
      if (rerun) {
        rerun = false;
        void syncAlarms();
      }
    }
  })();
  return syncing;
}

/** Respuestas dadas desde la alarma mientras la app está abierta. */
export function listenAlarmActions(onChange: () => void): () => void {
  if (!isNativeApp()) return () => {};
  const handle = MedAlarm.addListener('alarmAction', async () => {
    if (await consumeAlarmActions()) onChange();
  });
  return () => {
    void handle.then(h => h.remove());
  };
}

export const alarmStatus = (): Promise<AlarmStatus | null> => (isNativeApp() ? MedAlarm.status() : Promise.resolve(null));
export const openAlarmSettings = (which: AlarmSetting) => MedAlarm.openSettings({ which });
export const testAlarm = (seconds = 5) => MedAlarm.test({ seconds });
