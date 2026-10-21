import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { Check, Clock, AlertCircle, CheckCircle2, RotateCcw, PhoneCall, Volume2, MailCheck } from 'lucide-react';
import { OmissionModal } from './OmissionModal';
import { InvitationReceivedScreen } from './InvitationReceivedScreen';

export const RobertoHoyTab: React.FC = () => {
  const {
    state,
    markDoseTaken,
    postponeDose,
    undoDoseStatus,
    showToast
  } = useMediRecord();

  const [omissionModalDose, setOmissionModalDose] = useState<{ id: string; name: string; time: string } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { todayDoses } = state;
  const targetDose = todayDoses.find(d => d.time === '14:00') || todayDoses[1];
  const morningDose = todayDoses.find(d => d.time === '08:00');
  const eveningDose = todayDoses.find(d => d.time === '20:00');

  const takenCount = todayDoses.filter(d => d.status === 'taken').length;
  const isAllConfirmed = takenCount === 3;

  const handleSimulateCall = () => {
    showToast('Llamando a Silvana Gómez...', 'info', 'Conectando llamada de voz con tu hija Silvana.');
  };

  const handleSimulateAlarmSound = () => {
    showToast(
      'Alarma sonora reproducida',
      'sound',
      'Voz clara: "Roberto, te toca Metformina, 1 comprimido de 500 miligramos".'
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Greeting and Date Header */}
      <div>
        <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)' }}>
          Hola, Roberto
        </h1>
        <div className="screen-subtitle" style={{ fontSize: 16, fontWeight: 500 }}>
          Jueves 15 de octubre
        </div>
      </div>

      {/* L-06: Banner de invitación pendiente de Silvana */}
      {state.pendingInvitation && (
        <div className="card-amber" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
            <AlertCircle size={20} color="var(--alert-amber-text)" />
            <span>Invitación de Silvana Gómez</span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.4 }}>
            Tu hija Silvana quiere acompañarte como persona de apoyo. Podés revisar los permisos y decidir si aceptás.
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowInviteModal(true)}
            style={{ backgroundColor: '#76500E' }}
          >
            <MailCheck size={16} /> Ver invitación
          </button>
        </div>
      )}

      {/* Progress / Status banner */}
      {isAllConfirmed ? (
        <div className="card-mint" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
            <Check size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--color-primary-dark)' }}>
              Listo por hoy
            </div>
            <div style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 2 }}>
              3 de 3 tomas confirmadas
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderRadius: '16px',
          background: 'var(--bg-mint)',
          color: 'var(--color-primary-dark)',
          fontSize: 14,
          fontWeight: 600,
          gap: 8,
          flexWrap: 'wrap'
        }}>
          <span>{takenCount} de 3 tomas registradas</span>
          <button
            onClick={handleSimulateAlarmSound}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 700
            }}
          >
            <Volume2 size={15} /> Probar alarma
          </button>
        </div>
      )}

      {/* Postponed indicator if active */}
      {targetDose?.postponedUntil && targetDose.status === 'pending' && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '12px',
          backgroundColor: '#EBF4F1',
          border: '1px solid #C4D9D1',
          color: 'var(--color-primary-dark)',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <Clock size={16} />
          <span>Postergado. Te recordaremos nuevamente a las {targetDose.postponedUntil}.</span>
        </div>
      )}

      {/* TARGET DOSE: 14:00 Metformina */}
      {targetDose && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* STATE: PENDING */}
          {targetDose.status === 'pending' && (
            <div className="card-white" style={{ border: '2px solid var(--color-primary)' }}>
              <div style={{
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: 'var(--color-primary)',
                marginBottom: 6
              }}>
                Ahora te toca
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {targetDose.medicineName}
                  </h2>
                  <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 2 }}>
                    {targetDose.doseDescription}
                  </div>
                </div>
                <div style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  background: 'var(--bg-mint)',
                  padding: '4px 10px',
                  borderRadius: 999,
                  flexShrink: 0
                }}>
                  {targetDose.time}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                <button
                  className="btn-primary"
                  onClick={() => markDoseTaken(targetDose.id, '14:02')}
                >
                  <Check size={20} strokeWidth={3} /> Ya la tomé
                </button>

                <button
                  className="btn-soft"
                  onClick={() => postponeDose(targetDose.id, 10)}
                  style={{ fontSize: 14, padding: '14px 16px' }}
                >
                  <Clock size={18} /> Posponer 10 min
                </button>

                <button
                  onClick={() => setOmissionModalDose({
                    id: targetDose.id,
                    name: targetDose.medicineName,
                    time: targetDose.time
                  })}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-muted)',
                    fontSize: 14,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: '8px 0',
                    textAlign: 'center',
                    fontWeight: 500
                  }}
                >
                  No la tomé
                </button>
              </div>
            </div>
          )}

          {/* STATE: TAKEN */}
          {targetDose.status === 'taken' && (
            <div className="card-mint" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-primary)', fontWeight: 700, fontSize: 17 }}>
                <CheckCircle2 size={22} />
                <span>Toma registrada</span>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  {targetDose.medicineName}
                </div>
                <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 2 }}>
                  {targetDose.doseDescription}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)', marginTop: 6 }}>
                  Registrada a las {targetDose.takenAt || '14:02'}
                  {targetDose.isDelayed && ' (con retraso)'}
                </div>
              </div>

              <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 12, lineHeight: 1.4, borderTop: '1px solid var(--border-mint)', paddingTop: 10 }}>
                Silvana recibe la actualización: el aviso queda resuelto. No hace falta que la llames para confirmar.
              </div>

              <button
                onClick={() => undoDoseStatus(targetDose.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-muted)',
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 12,
                  textDecoration: 'underline'
                }}
              >
                <RotateCcw size={14} /> Deshacer registro si fue un error
              </button>
            </div>
          )}

          {/* STATE: OMITTED */}
          {targetDose.status === 'omitted' && (
            <div className="card-coral">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 17 }}>
                <AlertCircle size={22} />
                <span>Quedó como no tomada</span>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {targetDose.medicineName} · {targetDose.time}
                </div>
                <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>
                  No tomada. Lo indicaste a las {targetDose.omittedAt || '14:05'}.
                </div>
                {targetDose.omissionReason && (
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                    Motivo indicado: {targetDose.omissionReason}
                  </div>
                )}
              </div>

              <div style={{ fontSize: 13, marginTop: 12, lineHeight: 1.4, borderTop: '1px solid var(--alert-red-border)', paddingTop: 10 }}>
                Silvana recibe un aviso explícito ahora con lo que nos contaste.
              </div>

              <button
                onClick={() => undoDoseStatus(targetDose.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--alert-red-text)',
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 12,
                  textDecoration: 'underline',
                  fontWeight: 600
                }}
              >
                <RotateCcw size={14} /> Corregir si fue un error
              </button>
            </div>
          )}

          {/* STATE: UNCONFIRMED (60m late) */}
          {targetDose.status === 'unconfirmed' && (
            <div className="card-amber">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 17 }}>
                <AlertCircle size={22} />
                <span>Esta toma sigue sin confirmar</span>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {targetDose.medicineName} · {targetDose.time}
                </div>
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  {targetDose.doseDescription}
                </div>
                <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>
                  Aviso enviado a Silvana a las 15:00 porque faltó tu confirmación de las 14:00.
                </div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                  «Sin confirmar» no significa que no la tomaste.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                <button
                  className="btn-primary"
                  onClick={() => markDoseTaken(targetDose.id, '15:20')}
                >
                  <Check size={18} strokeWidth={3} /> Ya la tomé (registrar con retraso)
                </button>
                <button
                  className="btn-soft"
                  onClick={handleSimulateCall}
                  style={{ background: '#FFF7E6', borderColor: '#F5DCB0', color: '#76500E' }}
                >
                  <PhoneCall size={16} /> Llamar a Silvana
                </button>
                <button
                  onClick={() => setOmissionModalDose({
                    id: targetDose.id,
                    name: targetDose.medicineName,
                    time: targetDose.time
                  })}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#76500E',
                    fontSize: 14,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: 600
                  }}
                >
                  No la tomé
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* OTHER DOSES OF THE DAY */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 10 }}>
          Las otras tomas de hoy
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Morning Dose: Losartan 08:00 */}
          {morningDose && (
            <div className="card-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {morningDose.time} · {morningDose.medicineName}
                  </span>
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>
                  {morningDose.doseDescription}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, marginTop: 4 }}>
                  Registrada a las {morningDose.takenAt || '08:05'}
                </div>
              </div>
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-primary)',
                background: 'var(--bg-mint)',
                padding: '3px 10px',
                borderRadius: 999
              }}>
                Tomada
              </span>
            </div>
          )}

          {/* Evening Dose: Metformina 20:00 */}
          {eveningDose && (
            <div className="card-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', opacity: isAllConfirmed ? 1 : 0.85 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  {eveningDose.time} · {eveningDose.medicineName}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>
                  {eveningDose.doseDescription}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>
                  {eveningDose.status === 'taken' ? 'Registrada a las 20:05' : 'Próxima toma · aún no toca'}
                </div>
              </div>
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                color: eveningDose.status === 'taken' ? 'var(--color-primary)' : 'var(--pending-text)',
                background: eveningDose.status === 'taken' ? 'var(--bg-mint)' : 'var(--pending-bg)',
                border: eveningDose.status === 'taken' ? '1px solid transparent' : '1px solid var(--pending-border)',
                padding: '3px 10px',
                borderRadius: 999
              }}>
                {eveningDose.status === 'taken' ? 'Tomada' : 'Pendiente'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {omissionModalDose && (
        <OmissionModal
          doseId={omissionModalDose.id}
          medicineName={omissionModalDose.name}
          doseTime={omissionModalDose.time}
          onClose={() => setOmissionModalDose(null)}
        />
      )}

      {/* Modal de Invitación recibida */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="drag-handle" />
            <InvitationReceivedScreen onClose={() => setShowInviteModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
