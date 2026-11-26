/**
 * Alarmas locales en la app de Android (Capacitor). En el navegador no hace nada.
 *
 * Cada sincronización borra las alarmas programadas y vuelve a programar las tomas
 * pendientes de los próximos días. Así suenan aunque la app esté cerrada, sin internet
 * y aunque el servidor esté dormido.
 */
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { api } from '../api/client';

interface Upcoming {
  doseId: string;
  medicineName: string;
  doseDescription: string;
  at: string;
}

const CHANNEL = 'tomas';
const ACTIONS = 'toma';
// Android limita las alarmas pendientes (~500): 30 días alcanzan aunque no se abra la app en semanas.
const DAYS_AHEAD = 30;
const MAX_ALARMS = 400;
let ready: Promise<boolean> | null = null;

export const isNativeApp = () => Capacitor.isNativePlatform();

/** Id numérico estable (Android pide int32) a partir del id de la toma. */
function numericId(doseId: string): number {
  let h = 0;
  for (let i = 0; i < doseId.length; i++) h = (Math.imul(31, h) + doseId.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

function setup(): Promise<boolean> {
  ready ??= (async () => {
    let perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return false;
    await LocalNotifications.createChannel({
      id: CHANNEL,
      name: 'Recordatorios de tomas',
      description: 'Avisos a la hora de cada medicina',
      importance: 5,
      visibility: 1,
      vibration: true,
    });
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: ACTIONS,
          actions: [
            { id: 'take', title: 'Ya la tomé' },
            { id: 'postpone', title: 'Posponer 10 min' },
          ],
        },
      ],
    });
    return true;
  })().catch(() => {
    ready = null;
    return false;
  });
  return ready;
}

export async function clearAlarms(): Promise<void> {
  if (!isNativeApp()) return;
  const { notifications } = await LocalNotifications.getPending();
  if (notifications.length) await LocalNotifications.cancel({ notifications: notifications.map(n => ({ id: n.id })) });
}

let syncing: Promise<void> | null = null;
let rerun = false;

export function syncAlarms(): Promise<void> {
  if (!isNativeApp()) return Promise.resolve();
  if (syncing) {
    // Hay una sincronización en curso con datos quizá viejos (p. ej. antes de marcar una toma).
    rerun = true;
    return syncing;
  }
  syncing = (async () => {
    try {
      if (!(await setup())) return;
      const upcoming = await api<Upcoming[]>(`/api/doses/upcoming?days=${DAYS_AHEAD}`);
      await clearAlarms();
      if (upcoming.length === 0) return;
      await LocalNotifications.schedule({
        notifications: upcoming.slice(0, MAX_ALARMS).map(u => ({
          id: numericId(u.doseId),
          channelId: CHANNEL,
          actionTypeId: ACTIONS,
          title: `Hora de tu ${u.medicineName}`,
          body: u.doseDescription,
          schedule: { at: new Date(u.at), allowWhileIdle: true },
          extra: { doseId: u.doseId },
        })),
      });
    } catch {
      // Sin conexión: quedan las alarmas que ya estaban programadas.
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

/**
 * Botones de la notificación. Llama a `onChange` después de registrar la toma
 * para que la pantalla se actualice; las alarmas se reprograman en ese refresh.
 */
export function listenAlarmActions(onChange: () => void): () => void {
  if (!isNativeApp()) return () => {};
  const handle = LocalNotifications.addListener('localNotificationActionPerformed', async ({ actionId, notification }) => {
    const doseId = notification.extra?.doseId as string | undefined;
    if (!doseId) return;
    try {
      if (actionId === 'take') await api(`/api/doses/${doseId}/take`, { method: 'POST' });
      else if (actionId === 'postpone') await api(`/api/doses/${doseId}/postpone`, { method: 'POST', body: { minutes: 10 } });
    } catch {
      // Toma de otro día o ya registrada: se ignora, la app muestra el estado real.
    }
    onChange();
  });
  return () => {
    void handle.then(h => h.remove());
  };
}
