import React from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { CheckCircle2, XCircle, AlertCircle, Calendar, Clock } from 'lucide-react';

export const RobertoHistorialTab: React.FC = () => {
  const { state } = useMediRecord();
  const { history, todayDoses } = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)' }}>
          Tus registros
        </h1>
        <div className="screen-subtitle">
          Historial diario de tomas y confirmaciones
        </div>
      </div>

      {/* Today's section dynamically synced */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
          <Calendar size={16} color="var(--color-primary)" />
          <span>Hoy · Jueves 15 de octubre</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {todayDoses.map(dose => {
            let statusBadge = (
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--pending-text)', background: 'var(--pending-bg)', border: '1px solid var(--pending-border)', padding: '3px 10px', borderRadius: 999 }}>
                Pendiente
              </span>
            );
            let Icon = Clock;
            let iconColor = 'var(--color-muted)';

            if (dose.status === 'taken') {
              Icon = CheckCircle2;
              iconColor = 'var(--color-primary)';
              statusBadge = (
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', background: 'var(--bg-mint)', padding: '3px 10px', borderRadius: 999 }}>
                  Tomada {dose.takenAt || '14:02'}
                </span>
              );
            } else if (dose.status === 'omitted') {
              Icon = XCircle;
              iconColor = 'var(--alert-red-text)';
              statusBadge = (
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--alert-red-text)', background: 'var(--alert-red-bg)', padding: '3px 10px', borderRadius: 999 }}>
                  No tomada
                </span>
              );
            } else if (dose.status === 'unconfirmed') {
              Icon = AlertCircle;
              iconColor = 'var(--alert-amber-text)';
              statusBadge = (
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--alert-amber-text)', background: 'var(--alert-amber-bg)', padding: '3px 10px', borderRadius: 999 }}>
                  Sin confirmar
                </span>
              );
            }

            return (
              <div
                key={dose.id}
                className="card-white"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  gap: 12,
                  flexWrap: 'wrap',
                  borderLeft: dose.status === 'taken'
                    ? '4px solid var(--color-primary)'
                    : dose.status === 'omitted'
                    ? '4px solid #8A3930'
                    : dose.status === 'unconfirmed'
                    ? '4px solid #D97706'
                    : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 180px', minWidth: 0 }}>
                  <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      {dose.time} · {dose.medicineName}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.4 }}>
                      {dose.doseDescription}
                    </div>
                    {dose.omissionReason && dose.status === 'omitted' && (
                      <div style={{ fontSize: 12, color: 'var(--alert-red-text)', marginTop: 2, lineHeight: 1.4 }}>
                        Motivo: {dose.omissionReason}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ flexShrink: 0, alignSelf: 'flex-start' }}>{statusBadge}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Days */}
      {history.filter(h => !h.isToday).map(day => (
        <div key={day.dateString} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-muted)' }}>
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
                  padding: '14px 18px',
                  opacity: 0.95
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                    {rec.time} · {rec.medicineName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
                    {rec.note}
                  </div>
                </div>

                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: rec.status === 'taken' ? 'var(--color-primary)' : 'var(--alert-red-text)',
                  background: rec.status === 'taken' ? 'var(--bg-mint)' : 'var(--alert-red-bg)',
                  padding: '3px 10px',
                  borderRadius: 999
                }}>
                  {rec.status === 'taken' ? 'Tomada' : 'No tomada'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Explanatory footer note */}
      <div className="card-mint" style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--color-primary-dark)' }}>
        <strong>Nota importante:</strong> «Sin confirmar» significa que no hubo registro a tiempo, no afirma que no se tomó. Solo vos podés confirmar tus tomas.
      </div>
    </div>
  );
};
