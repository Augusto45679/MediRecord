import React from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  KeyRound,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface InvitationReceivedScreenProps {
  onClose?: () => void;
}

export const InvitationReceivedScreen: React.FC<InvitationReceivedScreenProps> = ({ onClose }) => {
  const { state, acceptInvitation, rejectInvitation } = useMediRecord();

  const handleAccept = () => {
    acceptInvitation();
    if (onClose) onClose();
  };

  const handleReject = () => {
    rejectInvitation();
    if (onClose) onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#FFF0D4',
          color: '#76500E',
          padding: '4px 10px',
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 10
        }}>
          <AlertCircle size={14} />
          <span>Invitación recibida</span>
        </div>
        <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)' }}>
          Elegí tu apoyo
        </h1>
        <div className="screen-subtitle">
          Silvana Gómez quiere acompañarte en MediRecord
        </div>
      </div>

      {/* Main card with invitation details */}
      <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <UserCheck size={26} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Silvana Gómez
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
              Familiar cuidador · silvana.gomez@gmail.com
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderRadius: '12px',
          background: 'white',
          border: '1px solid var(--border-mint)'
        }}>
          <KeyRound size={18} color="var(--color-primary)" />
          <div style={{ fontSize: 14 }}>
            Código de invitación: <strong>{state.familyCode}</strong>
          </div>
        </div>

        <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-mint)', paddingTop: 10 }}>
          Si aceptás, Silvana podrá ver tus medicinas, horarios y registros, y ayudarte a configurarlos.
          <br /><br />
          <strong>Privacidad y autonomía:</strong> Silvana <em>solo</em> recibe avisos si no confirmás una toma en {state.silvanaAlertWaitMinutes} minutos o si indicás que no la tomaste. Podés retirar este permiso en cualquier momento desde Ajustes.
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" onClick={handleAccept}>
          <CheckCircle2 size={18} /> Sí, vincular a Silvana
        </button>

        <button className="btn-danger-outline" onClick={handleReject}>
          <XCircle size={18} /> Rechazar invitación
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        justifyContent: 'center',
        fontSize: 12,
        color: 'var(--color-muted-light)',
        marginTop: 4
      }}>
        <ShieldCheck size={14} color="var(--color-primary)" />
        <span>Nada cambia sin tu consentimiento explícito</span>
      </div>
    </div>
  );
};
