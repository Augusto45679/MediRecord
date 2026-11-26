import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { Check, Clock, AlertCircle, CheckCircle2, RotateCcw, MailCheck, XCircle } from 'lucide-react';
import { OmissionModal } from './OmissionModal';
import { InvitationReceivedScreen } from './InvitationReceivedScreen';
import { formatLongDate } from '../../utils/dateFormat';
import { countTaken, pickCurrentDose } from '../../utils/doseSelectors';
import type { DoseRecord } from '../../types';

const badgeStyle = (status: DoseRecord['status']): React.CSSProperties => {
  const base: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 999,
    flexShrink: 0,
    alignSelf: 'flex-start'
  };
  if (status === 'taken') return { ...base, color: 'var(--color-primary)', background: 'var(--bg-mint)' };
  if (status === 'omitted') return { ...base, color: 'var(--alert-red-text)', background: 'var(--alert-red-bg)' };
  if (status === 'unconfirmed') return { ...base, color: 'var(--alert-amber-text)', background: 'var(--alert-amber-bg)' };
  return { ...base, color: 'var(--pending-text)', background: 'var(--pending-bg)', border: '1px solid var(--pending-border)' };
};

const BADGE_TEXT: Record<DoseRecord['status'], string> = {
  taken: 'Tomada',
  omitted: 'No tomada',
  unconfirmed: 'Sin confirmar',
  pending: 'Pendiente'
};

function doseNote(dose: DoseRecord): string {
  if (dose.status === 'taken') return `Registrada a las ${dose.takenAt ?? '--:--'}${dose.isDelayed ? ' (con retraso)' : ''}`;
  if (dose.status === 'omitted') {
    return `No tomada. Lo indicaste a las ${dose.omittedAt ?? '--:--'}${dose.omissionReason ? ` · ${dose.omissionReason}` : ''}`;
  }
  if (dose.status === 'unconfirmed') return 'Sin confirmar';
  return dose.postponedUntil ? `Te recordamos a las ${dose.postponedUntil}` : 'Todavía no toca';
}

export const RobertoHoyTab: React.FC = () => {
  const { state, markDoseTaken, postponeDose, undoDoseStatus } = useMediRecord();

  const [omissionModalDose, setOmissionModalDose] = useState<{ id: string; name: string; time: string } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { todayDoses, user, link } = state;
  const firstName = user?.displayName ?? '';
  const supportName = link.status === 'accepted' ? link.otherDisplayName : null;
  const currentDose = pickCurrentDose(todayDoses);
  const otherDoses = todayDoses.filter(d => d.id !== currentDose?.id);
  const { taken, total } = countTaken(todayDoses);
  const allResolved = total > 0 && !currentDose;

  const openOmission = (dose: DoseRecord) =>
    setOmissionModalDose({ id: dose.id, name: dose.medicineName, time: dose.time });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)' }}>
          Hola{firstName ? `, ${firstName}` : ''}
        </h1>
        <div className="screen-subtitle" style={{ fontSize: 16, fontWeight: 500 }}>
          {formatLongDate(state.todayDate, state.todayDate)}
        </div>
      </div>

      {link.status === 'pending' && (
        <div className="card-amber" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
            <AlertCircle size={20} color="var(--alert-amber-text)" />
            <span>Invitación de {link.otherDisplayName}</span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.4 }}>
            {link.otherDisplayName} quiere acompañarte como persona de apoyo. Podés revisar los permisos y decidir si aceptás.
          </div>
          <button className="btn-primary" onClick={() => setShowInviteModal(true)} style={{ backgroundColor: '#76500E' }}>
            <MailCheck size={16} /> Ver invitación
          </button>
        </div>
      )}

      {total === 0 ? (
        <div className="card-white" style={{ textAlign: 'center', padding: '24px 20px' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            Hoy no tenés medicinas programadas
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 6 }}>
            Podés agregarlas desde la pestaña Medicinas.
          </div>
        </div>
      ) : allResolved ? (
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
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--color-primary-dark)' }}>Listo por hoy</div>
            <div style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 2 }}>
              {taken} de {total} tomas confirmadas
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          borderRadius: '16px',
          background: 'var(--bg-mint)',
          color: 'var(--color-primary-dark)',
          fontSize: 14,
          fontWeight: 600,
          minHeight: 44
        }}>
          <CheckCircle2 size={18} color="var(--color-primary)" />
          <span>{taken} de {total} tomas registradas hoy</span>
        </div>
      )}

      {currentDose?.postponedUntil && currentDose.status === 'pending' && (
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
          <span>Postergado. Te recordaremos nuevamente a las {currentDose.postponedUntil}.</span>
        </div>
      )}

      {currentDose?.status === 'pending' && (
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
            Próxima toma
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary-dark)' }}>{currentDose.medicineName}</h2>
              <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 2 }}>{currentDose.doseDescription}</div>
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
              {currentDose.time}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <button className="btn-primary" onClick={() => markDoseTaken(currentDose.id)}>
              <Check size={20} strokeWidth={3} /> Ya la tomé
            </button>
            <button className="btn-soft" onClick={() => postponeDose(currentDose.id, 10)} style={{ fontSize: 14, padding: '14px 16px' }}>
              <Clock size={18} /> Posponer 10 min
            </button>
            <button
              className="btn-outline"
              onClick={() => openOmission(currentDose)}
              style={{
                minHeight: 48,
                fontSize: 15,
                fontWeight: 600,
                borderColor: '#C4D9D1',
                color: 'var(--color-primary-dark)',
                justifyContent: 'center'
              }}
            >
              <AlertCircle size={18} color="var(--color-muted)" /> No la tomé
            </button>
          </div>
        </div>
      )}

      {currentDose?.status === 'unconfirmed' && (
        <div className="card-amber">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 17 }}>
            <AlertCircle size={22} />
            <span>Esta toma sigue sin confirmar</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{currentDose.medicineName} · {currentDose.time}</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{currentDose.doseDescription}</div>
            {supportName && (
              <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>
                Le avisamos a {supportName} porque faltó tu confirmación de las {currentDose.time}.
              </div>
            )}
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>«Sin confirmar» no significa que no la tomaste.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={() => markDoseTaken(currentDose.id)}>
              <Check size={18} strokeWidth={3} /> Ya la tomé (registrar con retraso)
            </button>
            <button
              className="btn-outline"
              onClick={() => openOmission(currentDose)}
              style={{
                minHeight: 48,
                fontSize: 15,
                fontWeight: 600,
                borderColor: '#F5DCB0',
                background: '#FFFFFF',
                color: '#76500E',
                justifyContent: 'center'
              }}
            >
              <AlertCircle size={18} /> No la tomé
            </button>
          </div>
        </div>
      )}

      {otherDoses.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 10 }}>
            {currentDose ? 'Las otras tomas de hoy' : 'Tus tomas de hoy'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {otherDoses.map(dose => {
              const canUndo = dose.status === 'taken' || dose.status === 'omitted';
              const canResolve = dose.status === 'unconfirmed';
              return (
                <div key={dose.id} className="card-white" style={{ padding: '16px 20px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                          {dose.time} · {dose.medicineName}
                        </span>
                        {dose.status === 'taken' && <CheckCircle2 size={16} color="var(--color-primary)" />}
                        {dose.status === 'omitted' && <XCircle size={16} color="var(--alert-red-text)" />}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.4 }}>
                        {dose.doseDescription}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 600, marginTop: 4, lineHeight: 1.4 }}>
                        {doseNote(dose)}
                      </div>
                    </div>
                    <span style={badgeStyle(dose.status)}>{BADGE_TEXT[dose.status]}</span>
                  </div>
                  {canUndo && (
                    <button
                      className="btn-outline"
                      onClick={() => undoDoseStatus(dose.id)}
                      style={{
                        minHeight: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        marginTop: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        width: '100%',
                        borderColor: 'var(--border-mint)',
                        background: '#FFFFFF',
                        color: 'var(--color-primary-dark)'
                      }}
                    >
                      <RotateCcw size={16} /> ¿Fue un error? Deshacer
                    </button>
                  )}
                  {canResolve && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button className="btn-primary" style={{ minHeight: 44, fontSize: 14 }} onClick={() => markDoseTaken(dose.id)}>
                        <Check size={16} /> Ya la tomé
                      </button>
                      <button className="btn-outline" style={{ minHeight: 44, fontSize: 14 }} onClick={() => openOmission(dose)}>
                        No la tomé
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {omissionModalDose && (
        <OmissionModal
          doseId={omissionModalDose.id}
          medicineName={omissionModalDose.name}
          doseTime={omissionModalDose.time}
          onClose={() => setOmissionModalDose(null)}
        />
      )}

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
