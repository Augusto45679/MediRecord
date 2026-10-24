import type { DayOfWeek } from '../types';

export interface DayOption {
  key: DayOfWeek;
  label: string;
  short: string;
  letter: string;
}

export const DAYS_OF_WEEK: DayOption[] = [
  { key: 'lun', label: 'Lunes', short: 'Lun', letter: 'L' },
  { key: 'mar', label: 'Martes', short: 'Mar', letter: 'M' },
  { key: 'mie', label: 'Miércoles', short: 'Mié', letter: 'M' },
  { key: 'jue', label: 'Jueves', short: 'Jue', letter: 'J' },
  { key: 'vie', label: 'Viernes', short: 'Vie', letter: 'V' },
  { key: 'sab', label: 'Sábado', short: 'Sáb', letter: 'S' },
  { key: 'dom', label: 'Domingo', short: 'Dom', letter: 'D' },
];

export const ALL_DAYS: DayOfWeek[] = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
export const WEEKDAYS: DayOfWeek[] = ['lun', 'mar', 'mie', 'jue', 'vie'];
export const WEEKEND_DAYS: DayOfWeek[] = ['sab', 'dom'];

/**
 * Returns a readable frequency string in Spanish (e.g. "Todos los días", "Lunes a Viernes", "Lun, Mié, Vie").
 */
export function formatDaysFrequency(days?: DayOfWeek[]): string {
  if (!days || days.length === 0) return 'Ningún día';
  if (days.length === 7) return 'Todos los días';

  const isWeekdays =
    days.length === 5 &&
    WEEKDAYS.every(d => days.includes(d));
  if (isWeekdays) return 'Lunes a Viernes';

  const isWeekend =
    days.length === 2 &&
    WEEKEND_DAYS.every(d => days.includes(d));
  if (isWeekend) return 'Fines de semana';

  const orderMap: Record<DayOfWeek, number> = {
    lun: 0,
    mar: 1,
    mie: 2,
    jue: 3,
    vie: 4,
    sab: 5,
    dom: 6
  };

  const sorted = [...days].sort((a, b) => orderMap[a] - orderMap[b]);

  const shortNames: Record<DayOfWeek, string> = {
    lun: 'Lun',
    mar: 'Mar',
    mie: 'Mié',
    jue: 'Jue',
    vie: 'Vie',
    sab: 'Sáb',
    dom: 'Dom'
  };

  if (sorted.length === 1) {
    const fullNames: Record<DayOfWeek, string> = {
      lun: 'Solo lunes',
      mar: 'Solo martes',
      mie: 'Solo miércoles',
      jue: 'Solo jueves',
      vie: 'Solo viernes',
      sab: 'Solo sábados',
      dom: 'Solo domingos'
    };
    return fullNames[sorted[0]];
  }

  return sorted.map(d => shortNames[d]).join(', ');
}

/**
 * Formats full summary string for Step 4 of the wizard (Resumen)
 */
export function formatScheduleSummary(days: DayOfWeek[] | undefined, times: string[]): string {
  const validTimes = times.filter(t => Boolean(t && t.trim()));
  const timesStr = validTimes.join(' y ') || '--:--';
  const freq = formatDaysFrequency(days);

  if (freq === 'Todos los días') {
    return `Todos los días a las ${timesStr}`;
  }
  if (freq === 'Lunes a Viernes') {
    return `De lunes a viernes a las ${timesStr}`;
  }
  if (freq === 'Fines de semana') {
    return `Sábados y domingos a las ${timesStr}`;
  }
  return `${freq} a las ${timesStr}`;
}

/**
 * Checks whether the schedule includes the prototype's active day:
 * In the MediRecord demo, today is "Jueves 15 de octubre", day key: 'jue'.
 */
export function isScheduledForToday(days?: DayOfWeek[]): boolean {
  if (!days || days.length === 0) return true;
  return days.includes('jue');
}
