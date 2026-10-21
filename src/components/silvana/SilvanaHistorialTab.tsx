import React from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { Calendar, BarChart2 } from 'lucide-react';

export const SilvanaHistorialTab: React.FC = () => {
  const { state } = useMediRecord();
  const { history, todayDoses } = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)', marginBottom: 2 }}>
          Historial de Roberto
        </h1>
        <div className="screen-subtitle">
          Seguimiento de adherencia y confirmaciones
        </div>
      </div>

      {/* Weekly adherence banner (K-04) */}
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
            Esta semana
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            12 de 14 tomas confirmadas
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
            Adherencia estimada: 86%
          </div>
        </div>
      </div>

      {/* Today's Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
          <Calendar size={15} color="var(--color-primary)" />
          <span>Jueves 15 de octubre (Hoy)</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todayDoses.map(dose => {
            let statusLabel = 'Aún no toca';
            let statusClass = 'var(--border-subtle)';
            let statusTextColor = 'var(--color-muted)';

            if (dose.status === 'taken') {
              statusLabel = `Tomada ${dose.takenAt || '14:02'}`;
              statusClass = 'var(--bg-mint)';
              statusTextColor = 'var(--color-primary)';
            } else if (dose.status === 'omitted') {
              statusLabel = 'No tomada';
              statusClass = 'var(--alert-red-bg)';
              statusTextColor = 'var(--alert-red-text)';
            } else if (dose.status === 'unconfirmed') {
              statusLabel = 'Sin confirmar';
              statusClass = 'var(--alert-amber-bg)';
              statusTextColor = 'var(--alert-amber-text)';
            }

            return (
              <div
                key={dose.id}
                className="card-white"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px'
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {dose.time} · {dose.medicineName}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>
                    {dose.doseDescription}
                  </div>
                  {dose.omissionReason && dose.status === 'omitted' && (
                    <div style={{ fontSize: 12, color: 'var(--alert-red-text)', marginTop: 2 }}>
                      Motivo: {dose.omissionReason} (14:05)
                    </div>
                  )}
                </div>

                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: statusClass,
                  color: statusTextColor,
                  padding: '4px 10px',
                  borderRadius: 999
                }}>
                  {statusLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past History */}
      {history.filter(h => !h.isToday).map(day => (
        <div key={day.dateString} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-muted)' }}>
            {day.displayDate}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {day.records.map(rec => (
              <div
                key={rec.id}
                className="card-white"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  opacity: 0.95
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                    {rec.time} · {rec.medicineName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
                    {rec.note}
                  </div>
                </div>

                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: rec.status === 'taken' ? 'var(--bg-mint)' : 'var(--alert-red-bg)',
                  color: rec.status === 'taken' ? 'var(--color-primary)' : 'var(--alert-red-text)',
                  padding: '3px 9px',
                  borderRadius: 999
                }}>
                  {rec.status === 'taken' ? 'Tomada' : 'No tomada'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Distinctions Footnote (K-04) */}
      <div className="card-white" style={{ borderLeft: '4px solid var(--color-primary)', fontSize: 13, lineHeight: 1.4, color: 'var(--color-muted)' }}>
        <strong>Distinción de estados:</strong>
        <div style={{ marginTop: 4 }}>
          • <strong>Sin confirmar:</strong> No sabemos si la tomó (aviso a los 60 min).
        </div>
        <div style={{ marginTop: 2 }}>
          • <strong>No tomada:</strong> Roberto lo indicó explícitamente.
        </div>
      </div>
    </div>
  );
};
