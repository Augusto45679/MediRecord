import React from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import {
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Clock,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';

export const SilvanaResumenTab: React.FC = () => {
  const {
    state,
    attendNoticeSilvana,
    showToast
  } = useMediRecord();

  const { todayDoses, noticeAttendedBySilvana, silvanaAlertWaitMinutes } = state;
  const targetDose = todayDoses.find(d => d.time === '14:00') || todayDoses[1];
  const morningDose = todayDoses.find(d => d.time === '08:00');
  const eveningDose = todayDoses.find(d => d.time === '20:00');

  const takenCount = todayDoses.filter(d => d.status === 'taken').length;

  const handleSimulateCall = () => {
    showToast('Llamando a Roberto Gómez...', 'info', 'Iniciando llamada telefónica de Silvana a Roberto...');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)', marginBottom: 0 }}>
            Roberto Gómez
          </h1>
          <ShieldCheck size={18} color="var(--color-primary)" />
        </div>
        <div className="screen-subtitle">
          Jueves 15 de octubre · Vinculado con su permiso
        </div>
      </div>

      {/* Daily adherence overview card */}
      <div className="card-mint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-primary)', fontWeight: 700 }}>
            Resumen de hoy
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary-dark)', marginTop: 2 }}>
            {takenCount} de 3 tomas confirmadas
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>
            Avisos de demora a los {silvanaAlertWaitMinutes} min
          </div>
        </div>

        <button
          className="btn-soft"
          onClick={handleSimulateCall}
          style={{ width: 'auto', padding: '10px 14px', fontSize: 13 }}
        >
          <PhoneCall size={15} /> Llamar
        </button>
      </div>

      {/* ALERT & NOTICE SECTION */}

      {/* CASE 1: UNCONFIRMED (60m late) - G-13 / K-01 */}
      {targetDose?.status === 'unconfirmed' && !noticeAttendedBySilvana && (
        <div className="card-amber" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 17 }}>
            <AlertTriangle size={22} color="var(--alert-amber-text)" />
            <span>Roberto no confirmó</span>
          </div>

          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Metformina · 500 mg · 1 comprimido
            </div>
            <div style={{ fontSize: 13, marginTop: 4, fontWeight: 600 }}>
              Programada a las 14:00 · Sin confirmar (Hace 1 hora)
            </div>
            <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.4 }}>
              Aviso enviado a las 15:00. Puede que la haya tomado. <strong>No confirmar no significa no tomar.</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            <button
              className="btn-primary"
              onClick={handleSimulateCall}
              style={{ backgroundColor: '#76500E' }}
            >
              <PhoneCall size={18} /> Llamar a Roberto
            </button>

            <button
              className="btn-soft"
              onClick={attendNoticeSilvana}
              style={{ background: '#FFF9EE', borderColor: '#E2C288', color: '#76500E' }}
            >
              <Check size={18} /> Ya hablé con Roberto
            </button>
          </div>

          <div style={{ fontSize: 12, opacity: 0.85, borderTop: '1px solid var(--alert-amber-border)', paddingTop: 8 }}>
            Al tocar «Ya hablé con Roberto», el aviso queda atendido. La toma sigue sin confirmar: solo Roberto puede registrarla.
          </div>
        </div>
      )}

      {/* CASE 2: NOTICE ATTENDED BY SILVANA - K-02 */}
      {targetDose?.status === 'unconfirmed' && noticeAttendedBySilvana && (
        <div className="card-white" style={{ border: '2px solid var(--border-mint)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', fontWeight: 700, fontSize: 16 }}>
            <CheckCircle2 size={20} />
            <span>Aviso atendido · Metformina 14:00</span>
          </div>

          <div style={{ fontSize: 14, color: 'var(--color-primary-dark)', fontWeight: 600 }}>
            Ya hablaste con Roberto
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4 }}>
            Marcado como atendido a las 15:10. La toma sigue sin confirmar: solo Roberto puede registrar si la tomó.
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              className="btn-soft"
              onClick={handleSimulateCall}
              style={{ padding: '10px 14px', fontSize: 13 }}
            >
              <PhoneCall size={15} /> Volver a llamar
            </button>
          </div>
        </div>
      )}

      {/* CASE 3: EXPLICIT OMISSION - K-05 */}
      {targetDose?.status === 'omitted' && (
        <div className="card-coral" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 17 }}>
            <AlertTriangle size={22} color="var(--alert-red-text)" />
            <span>Roberto indicó que no la tomó</span>
          </div>

          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Metformina · 14:00 · No tomada
            </div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Roberto lo indicó a las {targetDose.omittedAt || '14:05'}.
            </div>
            {targetDose.omissionReason && (
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
                Motivo informado: «{targetDose.omissionReason}»
              </div>
            )}
            <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.4 }}>
              Este aviso no es por falta de confirmación. Roberto confirmó que no tomó esta dosis.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              className="btn-primary"
              onClick={handleSimulateCall}
              style={{ backgroundColor: '#8A3930' }}
            >
              <PhoneCall size={18} /> Llamar a Roberto
            </button>
          </div>
        </div>
      )}

      {/* CASE 4: CONFIRMED - H-12 / K-03 */}
      {targetDose?.status === 'taken' && (
        <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', fontWeight: 700, fontSize: 16 }}>
            <CheckCircle2 size={20} />
            <span>
              {targetDose.isDelayed ? 'Aviso resuelto · Toma registrada' : 'Toma confirmada por Roberto'}
            </span>
          </div>

          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Metformina 14:00 · 500 mg
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>
              Roberto confirmó a las {targetDose.takenAt || '14:02'}.
              {targetDose.isDelayed && ' Registrada con retraso. El aviso enviado ya no queda pendiente.'}
            </div>
          </div>
        </div>
      )}

      {/* CASE 5: PENDING (Still within normal window) */}
      {targetDose?.status === 'pending' && (
        <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-muted)', fontWeight: 600, fontSize: 14 }}>
            <Clock size={16} />
            <span>Toma de las 14:00 · En horario</span>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Metformina · 500 mg
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>
              Esperando confirmación de Roberto. Solo te avisaremos si pasan {silvanaAlertWaitMinutes} min sin confirmación o si indica que no la tomó.
            </div>
          </div>
        </div>
      )}

      {/* OTHER DOSES */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 10 }}>
          Todas las tomas de Roberto hoy
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {morningDose && (
            <div className="card-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)', flexWrap: 'wrap' }}>
                  <span>{morningDose.time} · {morningDose.medicineName}</span>
                  <CheckCircle2 size={15} color="var(--color-primary)" />
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.4 }}>
                  {morningDose.doseDescription} · Registrada {morningDose.takenAt || '08:05'}
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', background: 'var(--bg-mint)', padding: '4px 10px', borderRadius: 999, flexShrink: 0, alignSelf: 'flex-start' }}>
                Confirmada
              </span>
            </div>
          )}

          {eveningDose && (
            <div className="card-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', gap: 12, flexWrap: 'wrap', opacity: 0.9 }}>
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  {eveningDose.time} · {eveningDose.medicineName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.4 }}>
                  {eveningDose.doseDescription} · Próxima toma
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--pending-text)', background: 'var(--pending-bg)', border: '1px solid var(--pending-border)', padding: '4px 10px', borderRadius: 999, flexShrink: 0, alignSelf: 'flex-start' }}>
                Aún no toca
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Educational notice */}
      <div className="card-mint" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14 }}>
        <Info size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--color-primary-dark)' }}>
          <strong>Acompañamiento respetuoso:</strong> La aplicación no sustituye las indicaciones médicas. Silvana solo recibe alertas por omisión o retraso de confirmación.
        </div>
      </div>
    </div>
  );
};
