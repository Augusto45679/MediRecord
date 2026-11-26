import type { DayOfWeek, MedForm, Medicine } from '../types';

export const MAX_TIMES = 4;

export const MED_FORMS: { key: MedForm; label: string }[] = [
  { key: 'comprimido', label: 'Comprimido' },
  { key: 'capsula', label: 'Cápsula' },
  { key: 'gotas', label: 'Gotas' },
  { key: 'jarabe', label: 'Jarabe' },
  { key: 'inyeccion', label: 'Inyección' },
  { key: 'inhalador', label: 'Inhalador' },
  { key: 'crema', label: 'Crema o pomada' },
  { key: 'otro', label: 'Otro' },
];

export function formLabel(form?: MedForm): string {
  return MED_FORMS.find(f => f.key === form)?.label ?? 'Comprimido';
}

/** Días que alcanza el stock y si hay que avisar (7 días o menos). null si no se lleva la cuenta. */
export function stockStatus(med: Pick<Medicine, 'stock' | 'stockPerDose' | 'times' | 'intervalDays' | 'days'>): {
  units: number;
  daysLeft: number;
  low: boolean;
} | null {
  if (med.stock === null || med.stock === undefined) return null;
  const perDay =
    (med.times.length * (med.stockPerDose ?? 1) * (med.intervalDays && med.intervalDays > 1 ? 1 / med.intervalDays : (med.days?.length || 7) / 7));
  const daysLeft = perDay > 0 ? Math.floor(med.stock / perDay) : Infinity;
  return { units: med.stock, daysLeft, low: daysLeft <= 7 };
}

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

/** "2026-12-06" → "06/12" */
export function formatShortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

/** Mismo texto que format_frequency de backend/app/schedule.py. */
export function formatFrequency(days?: DayOfWeek[], intervalDays = 1, endDate?: string | null): string {
  const base = intervalDays > 1 ? `Cada ${intervalDays} días` : formatDaysFrequency(days);
  return endDate ? `${base} hasta el ${formatShortDate(endDate)}` : base;
}

/**
 * Formats full summary string for Step 4 of the wizard (Resumen)
 */
export function formatScheduleSummary(
  days: DayOfWeek[] | undefined,
  times: string[],
  intervalDays = 1,
  endDate?: string | null
): string {
  const validTimes = times.filter(t => Boolean(t && t.trim()));
  const timesStr = validTimes.join(' y ') || '--:--';
  const until = endDate ? `, hasta el ${formatShortDate(endDate)}` : '';
  return `${daysSummary(days, intervalDays)} a las ${timesStr}${until}`;
}

function daysSummary(days: DayOfWeek[] | undefined, intervalDays: number): string {
  if (intervalDays > 1) return `Cada ${intervalDays} días`;
  const freq = formatDaysFrequency(days);

  if (freq === 'Lunes a Viernes') return 'De lunes a viernes';
  if (freq === 'Fines de semana') return 'Sábados y domingos';
  return freq;
}

/** "1 comprimido de 500 mg" → { amount: "1 comprimido", concentration: "500 mg" }. Solo corta en un " de " suelto. */
export function splitDose(dose: string): { amount: string; concentration: string } {
  const match = dose.trim().match(/^(.*?)\s+de\s+(.*)$/i);
  if (!match) return { amount: dose.trim(), concentration: '' };
  return { amount: match[1].trim(), concentration: match[2].trim() };
}
