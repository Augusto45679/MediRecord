import React, { useState } from 'react';
import { useMediRecord } from '../context/MediRecordContext';
import {
  RotateCcw,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { FamilyLinkWalkthroughModal } from './common/FamilyLinkWalkthroughModal';

export const DemoControlBar: React.FC = () => {
  const {
    state,
    setRole,
    markDoseTaken,
    markDoseOmitted,
    markDoseUnconfirmed,
    undoDoseStatus,
    setPendingInvitation,
    toggleFamilyLink,
    resetDemo
  } = useMediRecord();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  const targetDose = state.todayDoses.find(d => d.time === '14:00') || state.todayDoses[1];

  return (
    <>
      <div className="demo-control-bar" role="region" aria-label="Controles de la demostración">
        <div className="demo-bar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="#48BB78" />
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Controles de Demostración Universitaria</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#A3C5BA',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12
              }}
            >
              {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {isCollapsed ? 'Expandir' : 'Ocultar'}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Persona Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#A3C5BA', fontWeight: 600 }}>Usuario activo:</span>

              <button
                className={`demo-chip-btn ${state.currentRole === 'roberto' ? 'active' : ''}`}
                onClick={() => setRole('roberto')}
              >
                👴 Roberto (Paciente mayor)
              </button>

              <button
                className={`demo-chip-btn ${state.currentRole === 'silvana' ? 'active' : ''}`}
                onClick={() => setRole('silvana')}
              >
                👩 Silvana (Familiar cuidador)
              </button>
            </div>

            {/* Dose State Simulator for 14:00 Metformina */}
            {targetDose && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
                <span style={{ fontSize: 12, color: '#A3C5BA', fontWeight: 600 }}>Simular toma 14:00:</span>

                <button
                  className={`demo-chip-btn ${targetDose.status === 'pending' ? 'active' : ''}`}
                  onClick={() => undoDoseStatus(targetDose.id)}
                  title="Estado inicial de la dosis"
                >
                  <Clock size={13} /> ⏳ Pendiente
                </button>

                <button
                  className={`demo-chip-btn ${targetDose.status === 'taken' ? 'active' : ''}`}
                  onClick={() => markDoseTaken(targetDose.id, '14:02')}
                  title="Roberto confirma 'Ya la tomé'"
                >
                  <CheckCircle2 size={13} /> ✅ Ya la tomé
                </button>

                <button
                  className={`demo-chip-btn ${targetDose.status === 'omitted' ? 'active' : ''}`}
                  onClick={() => markDoseOmitted(targetDose.id, 'Me sentí mal')}
                  title="Roberto confirma 'No la tomé'"
                >
                  <XCircle size={13} /> ❌ No la tomé
                </button>

                <button
                  className={`demo-chip-btn ${targetDose.status === 'unconfirmed' ? 'active' : ''}`}
                  onClick={() => markDoseUnconfirmed(targetDose.id)}
                  title="Pasaron 60 min y Silvana recibe aviso"
                >
                  <AlertTriangle size={13} /> ⚠️ Sin confirmar (60 min)
                </button>
              </div>
            )}

            {/* Simular estados de vínculo e invitación (L-01, L-05, L-06, L-07) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
              <span style={{ fontSize: 12, color: '#A3C5BA', fontWeight: 600 }}>Simular vínculo:</span>

              <button
                className={`demo-chip-btn ${state.familyLinked ? 'active' : ''}`}
                onClick={() => toggleFamilyLink(true)}
                title="L-02: Roberto y Silvana vinculados"
              >
                🤝 Vinculados
              </button>

              <button
                className={`demo-chip-btn ${state.pendingInvitation ? 'active' : ''}`}
                onClick={() => setPendingInvitation(true)}
                title="L-06: Invitación recibida pendiente para Roberto"
              >
                📩 Invitación pendiente
              </button>

              <button
                className={`demo-chip-btn ${!state.familyLinked && !state.pendingInvitation ? 'active' : ''}`}
                onClick={() => toggleFamilyLink(false)}
                title="L-05: Sin persona de apoyo vinculada"
              >
                🚫 Sin vincular
              </button>
            </div>

            {/* Actions: Onboarding walk-through & Reset Demo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, flexWrap: 'wrap', gap: 8 }}>
              <button
                onClick={() => setShowWalkthrough(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid #486E64',
                  color: '#9FE5D3',
                  borderRadius: 999,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Users size={14} /> Ver recorrido de Invitación (482 716)
              </button>

              <button
                onClick={resetDemo}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#FCA5A5',
                  borderRadius: 999,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <RotateCcw size={14} /> Reiniciar demo
              </button>
            </div>
          </div>
        )}
      </div>

      {showWalkthrough && (
        <FamilyLinkWalkthroughModal onClose={() => setShowWalkthrough(false)} />
      )}
    </>
  );
};
