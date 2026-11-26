import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { localApi } from './localApi';
import type { DayDoses, Medicine } from '../types';

const MET = { name: 'Metformina', dose: '1 comprimido', times: ['08:00', '20:00'], days: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'] };
const post = <T,>(path: string, body?: unknown) => localApi<T>(path, { method: 'POST', body });

describe('localApi (app sin conexión)', () => {
  beforeEach(async () => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 7, 0)); // jueves 07:00 local
    await post('/api/auth/register', { displayName: 'Ana' });
  });
  afterEach(() => vi.useRealTimers());

  it('pide configurar antes de registrarse', async () => {
    localStorage.clear();
    await expect(localApi('/api/me')).rejects.toMatchObject({ status: 401 });
  });

  it('guarda medicinas y arma las tomas del día', async () => {
    await post('/api/medicines', MET);
    const today = await localApi<DayDoses>('/api/doses/today');
    expect(today.doses.map(d => [d.time, d.status])).toEqual([
      ['08:00', 'pending'],
      ['20:00', 'pending'],
    ]);
  });

  it('persiste entre lecturas (localStorage)', async () => {
    await post('/api/medicines', MET);
    const meds = await localApi<Medicine[]>('/api/medicines');
    expect(meds).toHaveLength(1);
    expect(meds[0].frequency).toBe('Todos los días');
  });

  it('tomar descuenta stock y deshacer lo devuelve', async () => {
    const m = await post<Medicine>('/api/medicines', { ...MET, stock: 10, stockPerDose: 2 });
    vi.setSystemTime(new Date(2026, 10, 26, 8, 5));
    const id = (await localApi<DayDoses>('/api/doses/today')).doses[0].id;
    const d = await post<{ status: string; takenAt: string }>(`/api/doses/${id}/take`);
    expect([d.status, d.takenAt]).toEqual(['taken', '08:05']);
    await post(`/api/doses/${id}/take`); // doble toque
    expect((await localApi<Medicine[]>('/api/medicines'))[0].stock).toBe(8);
    await post(`/api/doses/${id}/undo`);
    expect((await localApi<Medicine[]>('/api/medicines')).find(x => x.id === m.id)?.stock).toBe(10);
  });

  it('cada 3 días y fecha de fin', async () => {
    await post('/api/medicines', { ...MET, times: ['09:00'], intervalDays: 3, endDate: '2026-12-02' });
    const up = await localApi<{ at: string }[]>('/api/doses/upcoming?days=10');
    const days = up.map(u => new Date(u.at).getDate());
    expect(days).toEqual([26, 29, 2]); // 26/11, 29/11, 02/12 y después termina
  });

  it('pasado el plazo queda sin confirmar y no entra en próximas alarmas', async () => {
    await post('/api/medicines', MET);
    vi.setSystemTime(new Date(2026, 10, 26, 9, 30)); // 08:00 + 60 min ya pasó
    const today = await localApi<DayDoses>('/api/doses/today');
    expect(today.doses[0].status).toBe('unconfirmed');
    const up = await localApi<{ at: string }[]>('/api/doses/upcoming?days=1');
    expect(up.map(u => new Date(u.at).getHours())).toEqual([20]);
  });

  it('posponer mueve la alarma', async () => {
    await post('/api/medicines', { ...MET, times: ['08:00'] });
    vi.setSystemTime(new Date(2026, 10, 26, 8, 2));
    const id = (await localApi<DayDoses>('/api/doses/today')).doses[0].id;
    await post(`/api/doses/${id}/postpone`, { minutes: 10 });
    const up = await localApi<{ at: string }[]>('/api/doses/upcoming?days=1');
    expect(new Date(up[0].at).toTimeString().slice(0, 5)).toBe('08:12');
  });

  it('vincular un familiar no está disponible', async () => {
    await expect(post('/api/link/invite', { code: '123456' })).rejects.toMatchObject({ status: 400 });
  });
});
