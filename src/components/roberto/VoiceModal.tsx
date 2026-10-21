import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { Mic, CheckCircle, ArrowLeft } from 'lucide-react';

interface VoiceModalProps {
  doseId: string;
  medicineName: string;
  doseTime: string;
  doseDesc: string;
  onClose: () => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  doseId,
  medicineName,
  doseTime,
  doseDesc,
  onClose
}) => {
  const { markDoseTaken } = useMediRecord();
  const [isSimulatingSpeech, setIsSimulatingSpeech] = useState(false);

  const handleSimulateVoice = () => {
    setIsSimulatingSpeech(true);
    setTimeout(() => {
      markDoseTaken(doseId, '14:02');
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
        <div className="drag-handle" />

        <div style={{ textAlign: 'left', marginBottom: 4 }}>
          <button className="btn-back" onClick={onClose}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <h2 className="screen-title" style={{ fontSize: 24, color: 'var(--color-primary-dark)' }}>
          Te escucho
        </h2>

        <div style={{ fontSize: 16, color: 'var(--color-primary)', fontWeight: 700 }}>
          {medicineName} · {doseTime}
        </div>
        <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
          {doseDesc}
        </div>

        {/* Animated Microphone Area */}
        <div style={{ position: 'relative', width: 120, height: 120, margin: '24px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            className="mic-pulse-ring"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: 'rgba(7, 86, 79, 0.15)',
              zIndex: 1
            }}
          />
          <button
            onClick={handleSimulateVoice}
            disabled={isSimulatingSpeech}
            style={{
              position: 'relative',
              zIndex: 2,
              width: 84,
              height: 84,
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(7, 86, 79, 0.35)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Mic size={36} />
          </button>
        </div>

        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 6 }}>
          {isSimulatingSpeech ? 'Escuchando: "Ya la tomé"...' : 'Decí: "Ya la tomé"'}
        </div>

        <div style={{ fontSize: 14, color: 'var(--color-muted)', maxWidth: 280, margin: '0 auto 16px auto', lineHeight: 1.4 }}>
          {isSimulatingSpeech
            ? 'Confirmando toma con voz de Roberto Gómez...'
            : 'Toca el micrófono para simular que Roberto dice la frase en voz alta.'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn-soft"
            onClick={handleSimulateVoice}
            disabled={isSimulatingSpeech}
          >
            <CheckCircle size={18} /> Simular decir "Ya la tomé"
          </button>
          <button className="btn-outline" onClick={onClose}>
            Cancelar escucha
          </button>
        </div>
      </div>
    </div>
  );
};
