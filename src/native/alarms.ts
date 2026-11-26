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
const DAYS_AHEAD = 7;
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

export function syncAlarms(): Promise<void> {
  if (!isNativeApp()) return Promise.resolve();
  syncing ??= (async () => {
    try {
      if (!(await setup())) return;
      const upcoming = await api<Upcoming[]>(`/api/doses/upcoming?days=${DAYS_AHEAD}`);
      await clearAlarms();
      if (upcoming.length === 0) return;
      await LocalNotifications.schedule({
        notifications: upcoming.map(u => ({
          id: numericId(u.doseId),
          channelId: CHANNEL,
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
    }
  })();
  return syncing;
}
