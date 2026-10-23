import React, { useState } from 'react';
import { useMediRecord } from '../context/MediRecordContext';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Play,
  Layers,
  Sliders,
  Eye
} from 'lucide-react';
import { FamilyLinkWalkthroughModal } from './common/FamilyLinkWalkthroughModal';
import { OmissionModal } from './roberto/OmissionModal';
import { InvitationReceivedScreen } from './roberto/InvitationReceivedScreen';

export const DemoControlBar: React.FC = () => {
  const {
    state,
    setRole,
    setTab,
    setFontSize,
    setHighContrast,
    markDoseTaken,
    markDoseOmitted,
    markDoseUnconfirmed,
    undoDoseStatus,
    setPendingInvitation,
    toggleFamilyLink,
    setSpecialView,
    resetDemo,
    showToast
  } = useMediRecord();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState<'scenarios' | 'screens' | 'state'>('scenarios');
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showOmissionModal, setShowOmissionModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const targetDose = state.todayDoses.find(d => d.time === '14:00') || state.todayDoses[1];

  // Helper to run guided E2E scenarios
  const runScenario = (scenarioId: string) => {
    switch (scenarioId) {
      case 'normal-taken':
        setSpecialView('none');
        setRole('roberto');
        setTab('hoy');
        if (targetDose) markDoseTaken(targetDose.id, '14:02');
        showToast(
          'Escenario 1: Toma puntual confirmada',
          'success',
          'Roberto confirmó su toma a las 14:02. Silvana NO recibe avisos molestos (respeto a la autonomía).'
        );
        break;

      case 'omitted-reason':
        setSpecialView('none');
        setRole('roberto');
        setTab('hoy');
        if (targetDose) markDoseOmitted(targetDose.id, 'Me sentí mal');
        showToast(
          'Escenario 2: Omisión con motivo médico',
          'alert',
          'Roberto indicó que no tomó Metformina por "Me sentí mal". Silvana recibe aviso con este motivo.'
        );
        break;

      case 'unconfirmed-60m':
        setSpecialView('none');
        setRole('roberto');
        setTab('hoy');
        if (targetDose) markDoseUnconfirmed(targetDose.id);
        showToast(
          'Escenario 3: Olvido crítico tras 60 minutos',
          'alert',
          'Pasaron 60 min sin confirmación. Silvana recibe alerta para llamar o intervenir sin juzgar.'
        );
        break;

      case 'undo-flow':
        setSpecialView('none');
        setRole('roberto');
        setTab('hoy');
        if (targetDose) markDoseTaken(targetDose.id, '14:02');
        showToast(
          'Escenario 4: Capacidad de Deshacer (Undo)',
          'info',
          'Toma registrada. El botón prominente "¿Fue un error? Deshacer registro" permite rectificar al instante.'
        );
        break;

      case 'family-invite':
        setSpecialView('none');
        setRole('roberto');
        setTab('hoy');
        setPendingInvitation(true);
        showToast(
          'Escenario 5: Invitación familiar pendiente',
          'info',
          'Silvana envió invitación con código 482 716. Roberto ve el aviso para revisar y aceptar.'
        );
        break;

      case 'a11y-demo':
        setSpecialView('none');
        setRole('roberto');
        setTab('hoy');
        setFontSize('xlarge');
        setHighContrast(true);
        showToast(
          'Escenario 6: Accesibilidad visual para adulto mayor',
          'info',
          'Tipografía "Muy Grande" (21px) y Alto Contraste activos. El layout se adapta sin romperse.'
        );
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="demo-control-bar" role="region" aria-label="Centro de Control y Demostración E2E">
        {/* Header Bar */}
        <div className="demo-bar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#34D399" />
            <div>
              <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 14, letterSpacing: -0.2 }}>
                Centro de Demostración & Pruebas E2E
              </span>
              <div style={{ fontSize: 11, color: '#A7F3D0', fontWeight: 600, marginTop: 1 }}>
                MediRecord · Entorno de Exposición en Vivo
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={resetDemo}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                color: '#FECACA',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
              title="Restablece la app a los datos iniciales de presentación"
            >
              <RotateCcw size={13} /> Reiniciar Demo
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                borderRadius: 8,
                padding: '4px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 700
              }}
            >
              {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {isCollapsed ? 'Expandir' : 'Minimizar'}
            </button>
          </div>
        </div>

        {/* Live State Badge Banner */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '6px 10px',
          borderRadius: 10,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 6,
          fontSize: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Estado actual:</span>
            <span style={{
              background: state.currentRole === 'roberto' ? '#065F46' : '#1E40AF',
              color: '#FFFFFF',
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 11
            }}>
              {state.currentRole === 'roberto' ? '👴 Roberto (Paciente)' : '👩 Silvana (Familiar)'}
            </span>

            <span style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#F3F4F6',
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 11
            }}>
              Tab: {state.specialView !== 'none' ? `Vista especial (${state.specialView})` : state.currentTab.toUpperCase()}
            </span>

            {targetDose && (
              <span style={{
                background:
                  targetDose.status === 'taken' ? '#065F46' :
                  targetDose.status === 'omitted' ? '#991B1B' :
                  targetDose.status === 'unconfirmed' ? '#92400E' : '#374151',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 11
              }}>
                14:00 {
                  targetDose.status === 'taken' ? '✅ Tomada' :
                  targetDose.status === 'omitted' ? '❌ Omitida' :
                  targetDose.status === 'unconfirmed' ? '⚠️ Sin confirmar (60m)' : '⏳ Pendiente'
                }
              </span>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Navigation Tabs of the Panel */}
            <div style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: 3,
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              gap: 4
            }}>
              <button
                onClick={() => setActivePanelTab('scenarios')}
                style={{
                  flex: 1,
                  background: activePanelTab === 'scenarios' ? '#07564F' : 'transparent',
                  color: activePanelTab === 'scenarios' ? '#FFFFFF' : '#D1D5DB',
                  border: activePanelTab === 'scenarios' ? '1px solid #34D399' : '1px solid transparent',
                  borderRadius: 9,
                  padding: '7px 8px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease'
                }}
              >
                <Play size={13} color={activePanelTab === 'scenarios' ? '#34D399' : '#9CA3AF'} />
                <span>Tests E2E Guiados</span>
              </button>

              <button
                onClick={() => setActivePanelTab('screens')}
                style={{
                  flex: 1,
                  background: activePanelTab === 'screens' ? '#07564F' : 'transparent',
                  color: activePanelTab === 'screens' ? '#FFFFFF' : '#D1D5DB',
                  border: activePanelTab === 'screens' ? '1px solid #34D399' : '1px solid transparent',
                  borderRadius: 9,
                  padding: '7px 8px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease'
                }}
              >
                <Layers size={13} color={activePanelTab === 'screens' ? '#34D399' : '#9CA3AF'} />
                <span>Explorador de Pantallas</span>
              </button>

              <button
                onClick={() => setActivePanelTab('state')}
                style={{
                  flex: 1,
                  background: activePanelTab === 'state' ? '#07564F' : 'transparent',
                  color: activePanelTab === 'state' ? '#FFFFFF' : '#D1D5DB',
                  border: activePanelTab === 'state' ? '1px solid #34D399' : '1px solid transparent',
                  borderRadius: 9,
                  padding: '7px 8px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease'
                }}
              >
                <Sliders size={13} color={activePanelTab === 'state' ? '#34D399' : '#9CA3AF'} />
                <span>Simulador Rápido</span>
              </button>
            </div>

            {/* TAB 1: ESCENARIOS E2E GUIADOS */}
            {activePanelTab === 'scenarios' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 12, color: '#A7F3D0', fontWeight: 600 }}>
                  Escenarios integrados de extremo a extremo (1-Click E2E Test Runners):
                </div>

                {/* Scenario 1 */}
                <div style={{
                  background: '#1F2E29',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ background: '#065F46', color: '#A7F3D0', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                        E2E TEST 1
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                        Toma Puntual a Tiempo
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: '#D1FAE5', lineHeight: 1.35 }}>
                    Roberto confirma <strong>«Ya la tomé»</strong> a las 14:02. El estado se vuelve verde y <strong>Silvana NO recibe alertas</strong>, garantizando autonomía.
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => runScenario('normal-taken')}
                      style={{
                        background: '#07564F',
                        border: '1px solid #34D399',
                        color: '#FFFFFF',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Play size={12} /> Ejecutar como Roberto
                    </button>

                    <button
                      onClick={() => {
                        setSpecialView('none');
                        setRole('silvana');
                        setTab('hoy');
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#E2ECE7',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Eye size={13} /> Ver panel de Silvana
                    </button>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div style={{
                  background: '#1F2E29',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ background: '#991B1B', color: '#FECACA', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                        E2E TEST 2
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                        Omisión con Motivo Reportado
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: '#D1FAE5', lineHeight: 1.35 }}>
                    Roberto pulsa <strong>«No la tomé»</strong> e indica <em>«Me sentí mal»</em>. Silvana recibe de inmediato una <strong>alerta roja crítica</strong> con el motivo exacto.
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => runScenario('omitted-reason')}
                      style={{
                        background: '#991B1B',
                        border: '1px solid #F87171',
                        color: '#FFFFFF',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Play size={12} /> Ejecutar Omisión
                    </button>

                    <button
                      onClick={() => {
                        setSpecialView('none');
                        setRole('silvana');
                        setTab('hoy');
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#E2ECE7',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Eye size={13} /> Ver Alerta en Silvana
                    </button>
                  </div>
                </div>

                {/* Scenario 3 */}
                <div style={{
                  background: '#1F2E29',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ background: '#92400E', color: '#FDE68A', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                        E2E TEST 3
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                        Olvido Crítico tras 60 Minutos
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: '#D1FAE5', lineHeight: 1.35 }}>
                    Pasa 1 hora sin respuesta. Roberto recibe aviso naranja con botón directo para <strong>llamar a Silvana</strong> o registrar con retraso. Silvana recibe alerta prioritaria.
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => runScenario('unconfirmed-60m')}
                      style={{
                        background: '#92400E',
                        border: '1px solid #FBBF24',
                        color: '#FFFFFF',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Play size={12} /> Simular 60 min tarde
                    </button>

                    <button
                      onClick={() => {
                        setSpecialView('none');
                        setRole('silvana');
                        setTab('hoy');
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#E2ECE7',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Eye size={13} /> Ver Alerta en Silvana
                    </button>
                  </div>
                </div>

                {/* Scenario 4 */}
                <div style={{
                  background: '#1F2E29',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ background: '#1E3A8A', color: '#BFDBFE', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                        E2E TEST 4
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                        Vinculación Familiar por Código (482 716)
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: '#D1FAE5', lineHeight: 1.35 }}>
                    Silvana genera código de 6 dígitos. Roberto recibe invitación y la acepta. Ambos quedan vinculados respetando el consentimiento del paciente.
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setShowWalkthrough(true)}
                      style={{
                        background: '#1E3A8A',
                        border: '1px solid #60A5FA',
                        color: '#FFFFFF',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Play size={12} /> Abrir Recorrido Guiado (4 pasos)
                    </button>

                    <button
                      onClick={() => runScenario('family-invite')}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#E2ECE7',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      Simular Invitación Roberto
                    </button>
                  </div>
                </div>

                {/* Scenario 5 */}
                <div style={{
                  background: '#1F2E29',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ background: '#4C1D95', color: '#DDD6FE', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                        E2E TEST 5
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                        Capacidad de Deshacer (Undo ante error)
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: '#D1FAE5', lineHeight: 1.35 }}>
                    Si Roberto marcó una toma por error, tiene un botón accesible de <strong>«¿Fue un error? Deshacer registro»</strong> que revierte el estado a pendiente de inmediato.
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => runScenario('undo-flow')}
                      style={{
                        background: '#4C1D95',
                        border: '1px solid #A78BFA',
                        color: '#FFFFFF',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Play size={12} /> Probar Deshacer
                    </button>
                  </div>
                </div>

                {/* Scenario 6 & 7 Quick Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 8
                }}>
                  {/* A11y card */}
                  <div style={{
                    background: '#1F2E29',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>
                      ♿ Test de Accesibilidad (a11y)
                    </div>
                    <div style={{ fontSize: 11, color: '#D1FAE5' }}>
                      Prueba cómo escala dinámicamente la UI a 21px y alto contraste.
                    </div>
                    <button
                      onClick={() => runScenario('a11y-demo')}
                      style={{
                        background: '#07564F',
                        border: '1px solid #34D399',
                        color: '#FFFFFF',
                        borderRadius: 8,
                        padding: '5px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: 2
                      }}
                    >
                      Activar XL + Alto Contraste
                    </button>
                  </div>

                  {/* Onboarding card */}
                  <div style={{
                    background: '#1F2E29',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>
                      🚪 Flujo de Bienvenida & Acceso
                    </div>
                    <div style={{ fontSize: 11, color: '#D1FAE5' }}>
                      Pantalla inicial y onboarding guiado sin tecnicismos.
                    </div>
                    <button
                      onClick={() => setSpecialView('welcome')}
                      style={{
                        background: '#07564F',
                        border: '1px solid #34D399',
                        color: '#FFFFFF',
                        borderRadius: 8,
                        padding: '5px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: 2
                      }}
                    >
                      Ver Pantalla de Bienvenida
                    </button>
                  </div>

                  {/* Login Flow Card */}
                  <div style={{
                    background: '#1F2E29',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>🔑 Log In & Validación Google</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#D1FAE5' }}>
                      Pantalla Log In 1 (correo/Google) y Log In 2 para Roberto y Silvana.
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                      <button
                        onClick={() => setSpecialView('login-1')}
                        style={{
                          background: '#07564F',
                          border: '1px solid #34D399',
                          color: '#FFFFFF',
                          borderRadius: 8,
                          padding: '5px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Ver Log In 1
                      </button>
                      <button
                        onClick={() => setSpecialView('login-2-roberto')}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          color: '#6EE7B7',
                          borderRadius: 8,
                          padding: '5px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Log In 2 Roberto
                      </button>
                      <button
                        onClick={() => setSpecialView('login-2-silvana')}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          color: '#93C5FD',
                          borderRadius: 8,
                          padding: '5px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Log In 2 Silvana
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EXPLORADOR DE TODAS LAS PANTALLAS */}
            {activePanelTab === 'screens' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 12, color: '#A7F3D0', fontWeight: 600 }}>
                  Navegación directa a todas las pantallas y estados del sistema:
                </div>

                {/* Roberto screens */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6EE7B7', display: 'flex', alignItems: 'center', gap: 6 }}>
                    👴 Pantallas de Roberto (Paciente)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 6 }}>
                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('roberto');
                        setTab('hoy');
                        if (targetDose) undoDoseStatus(targetDose.id);
                      }}
                    >
                      Hoy (Pendiente)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('roberto');
                        setTab('hoy');
                        if (targetDose) markDoseTaken(targetDose.id, '14:02');
                      }}
                    >
                      Hoy (Tomada)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('roberto');
                        setTab('hoy');
                        if (targetDose) markDoseOmitted(targetDose.id, 'Me sentí mal');
                      }}
                    >
                      Hoy (Omitida)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('roberto');
                        setTab('hoy');
                        if (targetDose) markDoseUnconfirmed(targetDose.id);
                      }}
                    >
                      Hoy (60m tarde)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('roberto');
                        setTab('medicinas');
                      }}
                    >
                      Medicinas
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('roberto');
                        setTab('historial');
                      }}
                    >
                      Historial
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('roberto');
                        setTab('ajustes');
                      }}
                    >
                      Ajustes
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => setSpecialView('onboarding-roberto')}
                    >
                      Onboarding Roberto
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => setSpecialView('login-2-roberto')}
                      style={{ border: '1px solid #34D399', color: '#6EE7B7' }}
                    >
                      Log In 2 Roberto (Google)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => setShowInviteModal(true)}
                    >
                      Invitación recibida
                    </button>
                  </div>
                </div>

                {/* Silvana screens */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#93C5FD', display: 'flex', alignItems: 'center', gap: 6 }}>
                    👩 Pantallas de Silvana (Familiar cuidadora)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 6 }}>
                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('silvana');
                        setTab('hoy');
                      }}
                    >
                      Resumen (Monitoreo)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('silvana');
                        setTab('medicinas');
                      }}
                    >
                      Medicinas (Gestión)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('silvana');
                        setTab('historial');
                      }}
                    >
                      Historial (Auditoría)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => {
                        setSpecialView('none');
                        setRole('silvana');
                        setTab('ajustes');
                      }}
                    >
                      Ajustes Silvana
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => setSpecialView('onboarding-silvana')}
                    >
                      Onboarding Silvana
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => setSpecialView('login-2-silvana')}
                      style={{ border: '1px solid #60A5FA', color: '#93C5FD' }}
                    >
                      Log In 2 Silvana (Google)
                    </button>
                  </div>
                </div>

                {/* Special Modals & Walkthroughs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#FCD34D', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🌐 Pantallas Generales & Flujos Especiales
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6 }}>
                    <button
                      className="demo-chip-btn"
                      onClick={() => setSpecialView('login-1')}
                      style={{ border: '1px solid #FCD34D', color: '#FDE68A', fontWeight: 700 }}
                    >
                      Log In 1 (Inicio / Correo)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => setSpecialView('login-2-roberto')}
                    >
                      Log In 2 (Roberto)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => setSpecialView('login-2-silvana')}
                    >
                      Log In 2 (Silvana)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => setSpecialView('welcome')}
                    >
                      Bienvenida & Roles
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => setShowWalkthrough(true)}
                    >
                      Walkthrough Vínculo (4p)
                    </button>

                    <button
                      className="demo-chip-btn"
                      onClick={() => setShowOmissionModal(true)}
                    >
                      Modal Motivos Omisión
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SIMULADOR RÁPIDO */}
            {activePanelTab === 'state' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Persona Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 700 }}>Rol activo:</span>

                  <button
                    className={`demo-chip-btn ${state.currentRole === 'roberto' && state.specialView === 'none' ? 'active' : ''}`}
                    onClick={() => {
                      setRole('roberto');
                      setSpecialView('none');
                    }}
                  >
                    👴 Roberto (Paciente mayor)
                  </button>

                  <button
                    className={`demo-chip-btn ${state.currentRole === 'silvana' && state.specialView === 'none' ? 'active' : ''}`}
                    onClick={() => {
                      setRole('silvana');
                      setSpecialView('none');
                    }}
                  >
                    👩 Silvana (Familiar cuidador)
                  </button>
                </div>

                {/* Dose State Simulator for 14:00 Metformina */}
                {targetDose && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
                    <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 700 }}>Toma 14:00:</span>

                    <button
                      className={`demo-chip-btn ${targetDose.status === 'pending' ? 'active' : ''}`}
                      onClick={() => undoDoseStatus(targetDose.id)}
                    >
                      <Clock size={13} /> ⏳ Pendiente
                    </button>

                    <button
                      className={`demo-chip-btn ${targetDose.status === 'taken' ? 'active' : ''}`}
                      onClick={() => markDoseTaken(targetDose.id, '14:02')}
                    >
                      <CheckCircle2 size={13} /> ✅ Ya la tomé
                    </button>

                    <button
                      className={`demo-chip-btn ${targetDose.status === 'omitted' ? 'active' : ''}`}
                      onClick={() => markDoseOmitted(targetDose.id, 'Me sentí mal')}
                    >
                      <XCircle size={13} /> ❌ No la tomé
                    </button>

                    <button
                      className={`demo-chip-btn ${targetDose.status === 'unconfirmed' ? 'active' : ''}`}
                      onClick={() => markDoseUnconfirmed(targetDose.id)}
                    >
                      <AlertTriangle size={13} /> ⚠️ Demorada 60m
                    </button>
                  </div>
                )}

                {/* Simular estados de vínculo e invitación */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
                  <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 700 }}>Vínculo familiar:</span>

                  <button
                    className={`demo-chip-btn ${state.familyLinked ? 'active' : ''}`}
                    onClick={() => toggleFamilyLink(true)}
                  >
                    🤝 Vinculados
                  </button>

                  <button
                    className={`demo-chip-btn ${state.pendingInvitation ? 'active' : ''}`}
                    onClick={() => setPendingInvitation(true)}
                  >
                    📩 Invitación pendiente
                  </button>

                  <button
                    className={`demo-chip-btn ${!state.familyLinked && !state.pendingInvitation ? 'active' : ''}`}
                    onClick={() => toggleFamilyLink(false)}
                  >
                    🚫 Sin vincular
                  </button>
                </div>

                {/* Tipografía y accesibilidad */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
                  <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 700 }}>Tamaño letra:</span>

                  <button
                    className={`demo-chip-btn ${state.fontSize === 'normal' ? 'active' : ''}`}
                    onClick={() => setFontSize('normal')}
                  >
                    Normal (15px)
                  </button>

                  <button
                    className={`demo-chip-btn ${state.fontSize === 'large' ? 'active' : ''}`}
                    onClick={() => setFontSize('large')}
                  >
                    Grande (18px)
                  </button>

                  <button
                    className={`demo-chip-btn ${state.fontSize === 'xlarge' ? 'active' : ''}`}
                    onClick={() => setFontSize('xlarge')}
                  >
                    Muy grande (21px)
                  </button>

                  <button
                    className={`demo-chip-btn ${state.highContrast ? 'active' : ''}`}
                    onClick={() => setHighContrast(!state.highContrast)}
                  >
                    🔲 Alto contraste: {state.highContrast ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {showWalkthrough && (
        <FamilyLinkWalkthroughModal onClose={() => setShowWalkthrough(false)} />
      )}

      {showOmissionModal && (
        <OmissionModal
          doseId={targetDose?.id || 'dose-2'}
          medicineName="Metformina"
          doseTime="14:00"
          onClose={() => setShowOmissionModal(false)}
        />
      )}

      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <InvitationReceivedScreen onClose={() => setShowInviteModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};
