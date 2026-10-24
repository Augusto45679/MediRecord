import React from 'react';
import type { DayOfWeek } from '../../types';
import {
  DAYS_OF_WEEK,
  ALL_DAYS,
  WEEKDAYS,
  WEEKEND_DAYS,
  formatDaysFrequency
} from '../../utils/scheduleUtils';
import { Calendar, Check } from 'lucide-react';

interface DaysOfWeekSelectorProps {
  selectedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
  label?: string;
  subtitle?: string;
}

export const DaysOfWeekSelector: React.FC<DaysOfWeekSelectorProps> = ({
  selectedDays,
  onChange,
  label = 'Días en que se toma',
  subtitle
}) => {
  const isAll = selectedDays.length === 7;
  const isWeekdaysOnly =
    selectedDays.length === 5 &&
    WEEKDAYS.every(d => selectedDays.includes(d));
  const isWeekendOnly =
    selectedDays.length === 2 &&
    WEEKEND_DAYS.every(d => selectedDays.includes(d));

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  const handleSelectAll = () => {
    onChange([...ALL_DAYS]);
  };

  const handleSelectWeekdays = () => {
    onChange([...WEEKDAYS]);
  };

  const handleSelectWeekend = () => {
    onChange([...WEEKEND_DAYS]);
  };

  const frequencyLabel = formatDaysFrequency(selectedDays);
  const hasSelection = selectedDays.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-primary-dark)',
            marginBottom: subtitle ? 2 : 6
          }}
        >
          {label}
        </label>
        {subtitle && (
          <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 6 }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Accesos rápidos de frecuencia */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          type="button"
          data-testid="preset-all"
          onClick={handleSelectAll}
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            border: isAll ? '1.5px solid var(--color-primary)' : '1px solid var(--border-mint)',
            backgroundColor: isAll ? 'var(--color-primary)' : 'var(--bg-card)',
            color: isAll ? '#FFFFFF' : 'var(--color-primary)',
            transition: 'all 0.15s ease'
          }}
        >
          {isAll && <Check size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />}
          Todos los días
        </button>

        <button
          type="button"
          data-testid="preset-weekdays"
          onClick={handleSelectWeekdays}
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            border: isWeekdaysOnly ? '1.5px solid var(--color-primary)' : '1px solid var(--border-mint)',
            backgroundColor: isWeekdaysOnly ? 'var(--color-primary)' : 'var(--bg-card)',
            color: isWeekdaysOnly ? '#FFFFFF' : 'var(--color-primary)',
            transition: 'all 0.15s ease'
          }}
        >
          {isWeekdaysOnly && <Check size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />}
          Lunes a Viernes
        </button>

        <button
          type="button"
          data-testid="preset-weekend"
          onClick={handleSelectWeekend}
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            border: isWeekendOnly ? '1.5px solid var(--color-primary)' : '1px solid var(--border-mint)',
            backgroundColor: isWeekendOnly ? 'var(--color-primary)' : 'var(--bg-card)',
            color: isWeekendOnly ? '#FFFFFF' : 'var(--color-primary)',
            transition: 'all 0.15s ease'
          }}
        >
          {isWeekendOnly && <Check size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />}
          Fines de semana
        </button>
      </div>

      {/* Grilla interactiva de los 7 días de la semana */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 6,
          marginTop: 4
        }}
        role="group"
        aria-label="Selección de días de la semana"
      >
        {DAYS_OF_WEEK.map(day => {
          const isSelected = selectedDays.includes(day.key);
          return (
            <button
              key={day.key}
              type="button"
              data-testid={`day-chip-${day.key}`}
              onClick={() => toggleDay(day.key)}
              aria-label={day.label}
              aria-pressed={isSelected}
              title={day.label}
              style={{
                minHeight: 46,
                padding: '8px 2px',
                borderRadius: '12px',
                border: isSelected
                  ? '2px solid var(--color-primary)'
                  : '1.5px solid var(--border-mint)',
                backgroundColor: isSelected ? 'var(--color-primary)' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : 'var(--color-primary-dark)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>
                {day.short}
              </span>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                  display: 'block'
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Resumen del selector o alerta si no hay selección */}
      {hasSelection ? (
        <div
          data-testid="selected-frequency-summary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-mint)',
            color: 'var(--color-primary-dark)',
            fontSize: 13,
            fontWeight: 600,
            marginTop: 2
          }}
        >
          <Calendar size={14} color="var(--color-primary)" />
          <span>Frecuencia elegida: <strong>{frequencyLabel}</strong></span>
        </div>
      ) : (
        <div
          data-testid="empty-frequency-warning"
          style={{
            padding: '8px 12px',
            borderRadius: '10px',
            backgroundColor: 'var(--alert-amber-bg)',
            color: 'var(--alert-amber-text)',
            fontSize: 13,
            fontWeight: 600,
            border: '1px solid var(--alert-amber-border)',
            marginTop: 2
          }}
        >
          Elegí al menos un día para programar los recordatorios.
        </div>
      )}
    </div>
  );
};

interface DaysBadgeRowProps {
  days?: DayOfWeek[];
}

/**
 * Visual presentation row displaying the 7 days with active days highlighted
 */
export const DaysBadgeRow: React.FC<DaysBadgeRowProps> = ({ days }) => {
  const activeDays = days && days.length > 0 ? days : ALL_DAYS;

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
      {DAYS_OF_WEEK.map(day => {
        const isActive = activeDays.includes(day.key);
        return (
          <span
            key={day.key}
            data-testid={`badge-day-${day.key}-${isActive ? 'active' : 'inactive'}`}
            style={{
              padding: '3px 8px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: isActive ? 700 : 500,
              backgroundColor: isActive ? 'var(--color-primary)' : 'rgba(0,0,0,0.04)',
              color: isActive ? '#FFFFFF' : 'var(--color-muted)',
              border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              opacity: isActive ? 1 : 0.55
            }}
          >
            {day.short}
          </span>
        );
      })}
    </div>
  );
};
