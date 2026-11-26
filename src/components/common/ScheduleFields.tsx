import React from 'react';
import { Plus, X } from 'lucide-react';
import type { DayOfWeek, MedForm } from '../../types';
import { DaysOfWeekSelector } from './DaysOfWeekSelector';
import { MED_FORMS, MAX_TIMES } from '../../utils/scheduleUtils';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1.5px solid var(--border-mint)',
  fontSize: 16,
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-primary-dark)',
  marginBottom: 6,
};

const hintStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 4 };

function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
}) {
  const btn: React.CSSProperties = { width: 48, height: 48, padding: 0, fontSize: 22 };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button type="button" className="btn-outline" style={btn} aria-label={`Menos ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <span style={{ fontSize: 24, fontWeight: 700, minWidth: 36, textAlign: 'center' }} aria-live="polite">
        {value}
      </span>
      <button type="button" className="btn-outline" style={btn} aria-label={`Más ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
    </div>
  );
}

/** Días de la semana o "cada N días", más la fecha de fin opcional. */
export function FrequencyFields({
  days,
  onDaysChange,
  intervalDays,
  onIntervalChange,
  endDate,
  onEndDateChange,
}: {
  days: DayOfWeek[];
  onDaysChange: (d: DayOfWeek[]) => void;
  intervalDays: number;
  onIntervalChange: (n: number) => void;
  endDate: string;
  onEndDateChange: (d: string) => void;
}) {
  const options = [
    { label: 'Días de la semana', active: intervalDays === 1, value: 1 },
    { label: 'Cada tantos días', active: intervalDays > 1, value: intervalDays > 1 ? intervalDays : 2 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }} role="radiogroup" aria-label="Frecuencia">
        {options.map(opt => (
          <button
            key={opt.label}
            type="button"
            role="radio"
            aria-checked={opt.active}
            className={opt.active ? 'btn-primary' : 'btn-outline'}
            style={{ flex: 1, padding: '10px 8px', fontSize: 15 }}
            onClick={() => onIntervalChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {intervalDays === 1 ? (
        <DaysOfWeekSelector
          selectedDays={days}
          onChange={onDaysChange}
          label="¿Qué días toma esta medicina?"
          subtitle="Toca los días o usa un acceso rápido"
        />
      ) : (
        <div className="card-mint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <span style={{ fontSize: 18, fontWeight: 600 }}>Cada</span>
          <Stepper value={intervalDays} min={2} max={30} onChange={onIntervalChange} label="días" />
          <span style={{ fontSize: 18, fontWeight: 600 }}>días</span>
        </div>
      )}

      <div>
        <label style={hintStyle} htmlFor="med-end-date">
          ¿Hasta cuándo? (opcional, si es un tratamiento con fin)
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            id="med-end-date"
            type="date"
            value={endDate}
            min={new Date().toLocaleDateString('en-CA')}
            onChange={e => onEndDateChange(e.target.value)}
            style={inputStyle}
          />
          {endDate && (
            <button type="button" className="btn-outline" style={{ width: 'auto', padding: '0 14px' }} onClick={() => onEndDateChange('')}>
              Sin fin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Lista de horarios del día: de 1 a MAX_TIMES. */
export function TimesFields({ times, onChange }: { times: string[]; onChange: (t: string[]) => void }) {
  const ordinal = ['Primer', 'Segundo', 'Tercer', 'Cuarto'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)' }}>Horarios de las tomas</div>
      {times.map((t, i) => (
        <div key={i}>
          <label style={hintStyle} htmlFor={`med-time-${i}`}>
            {ordinal[i]} horario
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id={`med-time-${i}`}
              type="time"
              value={t}
              onChange={e => onChange(times.map((x, j) => (j === i ? e.target.value : x)))}
              style={inputStyle}
            />
            {i > 0 && (
              <button
                type="button"
                className="btn-outline"
                aria-label={`Quitar ${ordinal[i].toLowerCase()} horario`}
                style={{ width: 48, padding: 0 }}
                onClick={() => onChange(times.filter((_, j) => j !== i))}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      ))}
      {times.length < MAX_TIMES && (
        <button type="button" className="btn-outline" onClick={() => onChange([...times, ''])}>
          <Plus size={16} /> Agregar otro horario
        </button>
      )}
    </div>
  );
}

/** Presentación (comprimido, gotas...) y cuenta opcional de unidades. */
export function FormAndStockFields({
  form,
  onFormChange,
  stock,
  onStockChange,
  perDose,
  onPerDoseChange,
}: {
  form: MedForm;
  onFormChange: (f: MedForm) => void;
  stock: string;
  onStockChange: (s: string) => void;
  perDose: number;
  onPerDoseChange: (n: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={labelStyle} htmlFor="med-form">
          ¿Cómo viene?
        </label>
        <select id="med-form" value={form} onChange={e => onFormChange(e.target.value as MedForm)} style={inputStyle}>
          {MED_FORMS.map(f => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle} htmlFor="med-stock">
          ¿Cuántas unidades te quedan? (opcional)
        </label>
        <div style={hintStyle}>Te avisamos cuando estén por terminarse.</div>
        <input
          id="med-stock"
          type="number"
          inputMode="numeric"
          min={0}
          max={9999}
          value={stock}
          placeholder="Ej. 30"
          onChange={e => onStockChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
          style={inputStyle}
        />
      </div>

      {stock !== '' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Unidades por toma</span>
          <Stepper value={perDose} min={1} max={20} onChange={onPerDoseChange} label="unidades por toma" />
        </div>
      )}
    </div>
  );
}
