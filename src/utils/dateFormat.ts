const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** "Jueves 26 de noviembre", o "Ayer · 25 de noviembre" si es el día anterior a todayIso. */
export function formatLongDate(isoDate: string, todayIso: string): string {
  const date = parseIso(isoDate);
  const dayMonth = `${date.getUTCDate()} de ${MONTHS[date.getUTCMonth()]}`;
  const diffDays = Math.round((parseIso(todayIso).getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 1) return `Ayer · ${dayMonth}`;
  return `${WEEKDAYS[date.getUTCDay()]} ${dayMonth}`;
}

/** Hora local actual "HH:MM". */
export function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** "123456" → "123 456". */
export function formatLinkCode(code: string | null | undefined): string {
  if (!code) return '';
  return `${code.slice(0, 3)} ${code.slice(3)}`;
}
