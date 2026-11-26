import React from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { AlertTriangle, CheckCircle2, Clock, ShieldCheck, Check, Link2 } from 'lucide-react';
import { formatLongDate } from '../../utils/dateFormat';
import { countTaken } from '../../utils/doseSelectors';
import type { DoseRecord } from '../../types';

const BADGE: Record<DoseRecord['status'], { text: string; style: React.CSSProperties }> = {
  taken: { text: 'Confirmada', style: { color: 'var(--color-primary)', background: 'var(--bg-mint)' } },
  omitted: { text: 'No tomada', style: { color: 'var(--alert-red-text)', background: 'var(--alert-red-bg)' } },
  unconfirmed: { text: 'Sin confirmar', style: { color: 'var(--alert-amber-text)', background: 'var(--alert-amber-bg)' } },
  pending: {
    text: 'Aún no toca',
    style: { color: 'var(--pending-text)', background: 'var(--pending-bg)', border: '1px solid var(--pending-border)' }
  }
};

function doseNote(dose: DoseRecord): string {
  if (dose.status === 'taken') return `Registrada ${dose.takenAt ?? ''}${dose.isDelayed ? ' (con retraso)' : ''}`;
  if (dose.status === 'omitted') return `No tomada${dose.omissionReason ? ` · ${dose.omissionReason}` : ''}`;
  if (dose.status === 'unconfirmed') return dose.noticeAttended ? 'Sin confirmar · aviso atendido' : 'Sin confirmar';
  return 'Próxima toma';
}

export const SilvanaResumenTab: React.FC = () => {
  const { state, attendNotice, setTab } = useMediRecord();
  const { todayDoses, silvanaAlertWaitMinutes, link } = state;
  const today = formatLongDate(state.todayDate, state.todayDate);

  if (link.status !== 'accepted') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)' }}>
            Hola{state.user ? `, ${state.user.displayName}` : ''}
          </h1>
          <div className="screen-subtitle">{today}</div>
        </div>
        <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 17, color: 'var(--color-primary-dark)' }}>
            <Link2 size={20} color="var(--color-primary)" />
            <span>
              {link.status === 'pending' ? `Esperando que ${link.otherDisplayName} acepte` : 'Todavía no acompañás a nadie'}
            </span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.45 }}>
            {link.status === 'pending'
              ? 'Cuando acepte tu invitación vas a ver acá sus tomas del día.'
              : link.status === 'rejected'
                ? 'La invitación fue rechazada o el vínculo se quitó. Podés volver a pedir el código de 6 dígitos.'
                : 'Pedile su código de 6 dígitos (lo ve en Ajustes › Mi persona de apoyo) y cargalo en Ajustes.'}
          </div>
          {link.status !== 'pending' && (
            <button className="btn-primary" onClick={() => setTab('ajustes')}>
              Vincular con un código
            </button>
          )}
        </div>
      </div>
    );
  }

  const patientName = link.otherDisplayName ?? '';
  const { taken, total } = countTaken(todayDoses);
  const needsCall = todayDoses.filter(d => d.status === 'unconfirmed' && !d.noticeAttended);
  const attended = todayDoses.filter(d => d.status === 'unconfirmed' && d.noticeAttended);
  const omitted = todayDoses.filter(d => d.status === 'omitted');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)', marginBottom: 0 }}>
            {patientName}
          </h1>
          <ShieldCheck size={18} color="var(--color-primary)" />
        </div>
        <div className="screen-subtitle">{today} · Vinculado con su permiso</div>
      </div>

      <div className="card-mint">
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-primary)', fontWeight: 700 }}>
          Resumen de hoy
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary-dark)', marginTop: 2 }}>
          {total === 0 ? 'Hoy no tiene medicinas programadas' : `${taken} de ${total} tomas confirmadas`}
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>
          Avisos de demora a los {silvanaAlertWaitMinutes} min
        </div>
      </div>

      {needsCall.map(dose => (
        <div key={dose.id} className="card-amber" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 17 }}>
            <AlertTriangle size={22} color="var(--alert-amber-text)" />
            <span>{patientName} no confirmó</span>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {dose.medicineName} · {dose.doseDescription}
            </div>
            <div style={{ fontSize: 13, marginTop: 4, fontWeight: 600 }}>Programada a las {dose.time} · Sin confirmar</div>
            <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.4 }}>
              Puede que la haya tomado. <strong>No confirmar no significa no tomar.</strong>
            </div>
          </div>
          <button
            className="btn-soft"
            onClick={() => attendNotice(dose.id)}
            style={{ background: '#FFF9EE', borderColor: '#E2C288', color: '#76500E' }}
          >
            <Check size={18} /> Ya hablé con {patientName}
          </button>
          <div style={{ fontSize: 12, opacity: 0.85, borderTop: '1px solid var(--alert-amber-border)', paddingTop: 8 }}>
            El aviso queda atendido, pero la toma sigue sin confirmar: solo {patientName} puede registrarla.
          </div>
        </div>
      ))}

      {attended.map(dose => (
        <div key={dose.id} className="card-white" style={{ border: '2px solid var(--border-mint)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', fontWeight: 700, fontSize: 16 }}>
            <CheckCircle2 size={20} />
            <span>Aviso atendido · {dose.medicineName} {dose.time}</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4 }}>
            Ya hablaste con {patientName}. La toma sigue sin confirmar: solo {patientName} puede registrar si la tomó.
          </div>
        </div>
      ))}

      {omitted.map(dose => (
        <div key={dose.id} className="card-coral" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 17 }}>
            <AlertTriangle size={22} color="var(--alert-red-text)" />
            <span>{patientName} indicó que no la tomó</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {dose.medicineName} · {dose.time} · No tomada
          </div>
          <div style={{ fontSize: 13 }}>Lo indicó a las {dose.omittedAt ?? '--:--'}.</div>
          {dose.omissionReason && (
            <div style={{ fontSize: 14, fontWeight: 700 }}>Motivo informado: «{dose.omissionReason}»</div>
          )}
        </div>
      ))}

      {total > 0 && needsCall.length === 0 && omitted.length === 0 && (
        <div className="card-white" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-muted)', fontSize: 14 }}>
          <Clock size={16} />
          <span>
            Todo en orden. Solo te avisamos si pasan {silvanaAlertWaitMinutes} min sin confirmación o si indica que no la tomó.
          </span>
        </div>
      )}

      {total > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 10 }}>
            Todas las tomas de {patientName} hoy
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayDoses.map(dose => (
              <div key={dose.id} className="card-white" style={{ padding: '16px 20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      {dose.time} · {dose.medicineName}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.4 }}>
                      {dose.doseDescription} · {doseNote(dose)}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                    ...BADGE[dose.status].style
                  }}>
                    {BADGE[dose.status].text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
