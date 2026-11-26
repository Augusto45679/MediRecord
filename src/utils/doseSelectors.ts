import type { DoseRecord } from '../types';

const byTime = (a: DoseRecord, b: DoseRecord) => a.time.localeCompare(b.time);

/** La toma que hay que resolver ahora: la primera sin confirmar, si no la primera pendiente. */
export function pickCurrentDose(doses: DoseRecord[]): DoseRecord | undefined {
  const sorted = [...doses].sort(byTime);
  return sorted.find(d => d.status === 'unconfirmed') ?? sorted.find(d => d.status === 'pending');
}

export function countTaken(doses: DoseRecord[]): { taken: number; total: number } {
  return { taken: doses.filter(d => d.status === 'taken').length, total: doses.length };
}
