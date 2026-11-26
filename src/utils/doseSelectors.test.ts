import { describe, expect, it } from 'vitest';
import type { DoseRecord, DoseStatus } from '../types';
import { countTaken, pickCurrentDose } from './doseSelectors';

const d = (time: string, status: DoseStatus): DoseRecord => ({
  id: `1_2026-11-26_${time.replace(':', '')}`,
  medicineId: '1',
  medicineName: 'Metformina',
  time,
  doseDescription: '500 mg',
  status
});

describe('pickCurrentDose', () => {
  it('first pending when no unconfirmed', () => {
    expect(pickCurrentDose([d('08:00', 'taken'), d('14:00', 'pending'), d('20:00', 'pending')])?.time).toBe('14:00');
  });
  it('unconfirmed wins over pending', () => {
    expect(pickCurrentDose([d('08:00', 'pending'), d('14:00', 'unconfirmed')])?.time).toBe('14:00');
  });
  it('undefined when all resolved', () => {
    expect(pickCurrentDose([d('08:00', 'taken')])).toBeUndefined();
  });
});

describe('countTaken', () => {
  it('counts taken of total', () => {
    expect(countTaken([d('08:00', 'taken'), d('14:00', 'omitted')])).toEqual({ taken: 1, total: 2 });
  });
});
