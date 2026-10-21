import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';

interface OmissionModalProps {
  doseId: string;
  medicineName: string;
  doseTime: string;
  onClose: () => void;
}

export const OmissionModal: React.FC<OmissionModalProps> = ({
  doseId,
  medicineName,
  doseTime,
  onClose
}) => {
  const { markDoseOmitted } = useMediRecord();
  const [selectedReason, setSelectedReason] = useState<'Me olvidé' | 'Me sentí mal' | 'Otro motivo'>('Me sentí mal');

  const reasons: ('Me olvidé' | 'Me sentí mal' | 'Otro motivo')[] = [
    'Me olvidé',
    'Me sentí mal',
    'Otro motivo'
  ];

  const handleConfirm = () => {
    markDoseOmitted(doseId, selectedReason);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="drag-handle" />

        <button
          className="btn-back"
          onClick={onClose}
          style={{ marginBottom: 4 }}
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div>
          <h2 className="screen-title" style={{ fontSize: 22, color: 'var(--color-primary-dark)' }}>
            ¿Seguro que no la tomaste?
          </h2>
          <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4, fontWeight: 600 }}>
            {medicineName} · {doseTime}
          </div>
        </div>

        <div className="card-coral" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            <AlertCircle size={20} />
            Silvana va a saber que hoy no la tomaste
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.4, opacity: 0.9 }}>
            Se enviará un aviso inmediato y explícito para que no se preocupe por falta de respuesta.
          </div>
        </div>

        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: 8 }}>
            Si querés, elegí un motivo. Es opcional:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reasons.map(reason => {
              const isSelected = selectedReason === reason;
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--bg-mint)' : 'var(--bg-card)',
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{reason}</span>
                  {isSelected && <Check size={18} color="var(--color-primary)" />}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <button
            className="btn-primary"
            onClick={handleConfirm}
            style={{ backgroundColor: '#8A3930' }}
          >
            Confirmar: no la tomé
          </button>
          <button className="btn-outline" onClick={onClose}>
            Volver sin cambiar
          </button>
        </div>
      </div>
    </div>
  );
};
