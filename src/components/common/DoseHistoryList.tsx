import React from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { AlertCircle, BarChart2, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatLongDate } from '../../utils/dateFormat';
import { countTaken } from '../../utils/doseSelectors';
import type { DoseRecord } from '../../types';

const STATUS_UI: Record<DoseRecord['status'], { label: string; Icon: typeof Clock; color: string; bg: string; border: string }> = {
  taken: { label: 'Tomada', Icon: CheckCircle2, color: 'var(--color-primary)', bg: 'var(--bg-mint)', border: '4px solid var(--color-primary)' },
  omitted: { label: 'No tomada', Icon: XCircle, color: 'var(--alert-red-text)', bg: 'var(--alert-red-bg)', border: '4px solid #8A3930' },
  unconfirmed: { label: 'Sin confirmar', Icon: AlertCircle, color: 'var(--alert-amber-text)', bg: 'var(--alert-amber-bg)', border: '4px solid #D97706' },
  pending: { label: 'Pendiente', Icon: Clock, color: 'var(--pending-text)', bg: 'var(--pending-bg)', border: '1px solid var(--border-subtle)' }
};

function note(dose: DoseRecord, whoTookIt: string): string {
  if (dose.status === 'taken') return `Registrada a las ${dose.takenAt ?? '--:--'}${dose.isDelayed ? ' (con retraso)' : ''}`;
  if (dose.status === 'omitted') {
    return `No tomada: lo indicó ${whoTookIt} a las ${dose.omittedAt ?? '--:--'}${dose.omissionReason ? ` (${dose.omissionReason})` : ''}`;
  }
  if (dose.status === 'unconfirmed') return 'Sin confirmar';
  return 'Todavía no toca';
}

interface Props {
  title: string;
  subtitle: string;
  /** Nombre de la persona que toma la medicina, para las notas. */
  whoTookIt: string;
  showWeekSummary?: boolean;
}

export const DoseHistoryList: React.FC<Props> = ({ title, subtitle, whoTookIt, showWeekSummary }) => {
  const { state } = useMediRecord();
  const { history, todayDate } = state;
  const week = countTaken(history.flatMap(d => d.doses.filter(x => x.status !== 'pending')));
  const adherence = week.total > 0 ? Math.round((week.taken / week.total) * 100) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)' }}>{title}</h1>
        <div className="screen-subtitle">{subtitle}</div>
      </div>

      {showWeekSummary && adherence !== null && (
        <div className="card-mint" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <BarChart2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-primary)', fontWeight: 700 }}>
              Últimos 7 días
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              {week.taken} de {week.total} tomas confirmadas
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Adherencia: {adherence}%</div>
          </div>
        </div>
      )}

      {history.every(d => d.doses.length === 0) && (
        <div className="card-white" style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: 15 }}>
          Todavía no hay tomas para mostrar.
        </div>
      )}

      {history.filter(day => day.doses.length > 0).map(day => (
        <div key={day.date} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 15,
            fontWeight: 700,
            color: day.isToday ? 'var(--color-primary-dark)' : 'var(--color-muted)'
          }}>
            {day.isToday && <Calendar size={16} color="var(--color-primary)" />}
            <span>{day.isToday ? 'Hoy · ' : ''}{formatLongDate(day.date, todayDate)}</span>
          </div>

          {day.doses.map(dose => {
            const ui = STATUS_UI[dose.status];
            return (
              <div key={dose.id} className="card-white" style={{ padding: '14px 18px', textAlign: 'left', borderLeft: ui.border }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 180px', minWidth: 0 }}>
                    <ui.Icon size={20} color={ui.color} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                        {dose.time} · {dose.medicineName}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.4 }}>
                        {dose.doseDescription}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.4 }}>
                        {note(dose, whoTookIt)}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: ui.color,
                    background: ui.bg,
                    padding: '3px 10px',
                    borderRadius: 999,
                    flexShrink: 0,
                    alignSelf: 'flex-start'
                  }}>
                    {ui.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div className="card-mint" style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--color-primary-dark)' }}>
        «Sin confirmar» significa que no hubo registro a tiempo, no que no se tomó.
      </div>
    </div>
  );
};
