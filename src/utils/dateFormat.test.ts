import { describe, expect, it } from 'vitest';
import { formatLinkCode, formatLongDate } from './dateFormat';

describe('formatLongDate', () => {
  it('formats today with weekday', () => {
    expect(formatLongDate('2026-11-26', '2026-11-26')).toBe('Jueves 26 de noviembre');
  });
  it('formats yesterday', () => {
    expect(formatLongDate('2026-11-25', '2026-11-26')).toBe('Ayer · 25 de noviembre');
  });
  it('formats other days', () => {
    expect(formatLongDate('2026-12-31', '2026-11-26')).toBe('Jueves 31 de diciembre');
  });
  it('handles month boundary for yesterday', () => {
    expect(formatLongDate('2026-03-01', '2026-03-02')).toBe('Ayer · 1 de marzo');
  });
});

describe('formatLinkCode', () => {
  it('groups six digits', () => {
    expect(formatLinkCode('482716')).toBe('482 716');
    expect(formatLinkCode(null)).toBe('');
  });
});
