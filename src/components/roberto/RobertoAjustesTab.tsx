import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import type { FontSizePreference, Medicine } from '../../types';
import { InvitationReceivedScreen } from './InvitationReceivedScreen';
import {
  Users,
  Eye,
  Bell,
  Volume2,
  ChevronRight,
  ArrowLeft,
  Check,
  UserCheck,
  ShieldAlert,
  LogOut,
  Pill,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  MailCheck,
  XCircle,
  AlertCircle
} from 'lucide-react';

// ─── Inline Add-Medicine Wizard (mismo flujo que SilvanaMedicinasTab I-02→I-09) ──
interface AddMedWizardProps {
  onClose: () => void;
  onSave: (med: Omit<Medicine, 'id'>) => void;
}

const AddMedWizard: React.FC<AddMedWizardProps> = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [dose, setDose] = useState('1 comprimido de 10 mg');
  const [time1, setTime1] = useState('09:00');
  const [time2, setTime2] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    const times = [time1];
    if (time2.trim()) times.push(time2);
    onSave({
      name: name.trim(),
      dose,
      concentration: dose.split('de ')[1] || '10 mg',
      amount: dose.split(' de')[0] || '1 comprimido',
      times,
      frequency: 'Todos los días',
      addedBy: 'Roberto',
      status: 'active'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="drag-handle" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Paso {step} de 4
          </span>
          <button
            className="btn-back"
            onClick={() => { if (step > 1) setStep(step - 1); else onClose(); }}
          >
            <ArrowLeft size={14} /> {step > 1 ? 'Atrás' : 'Cancelar'}
          </button>
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="screen-title" style={{ fontSize: 22 }}>¿Cómo se llama la medicina?</h2>
            <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
              Copiá el nombre tal como aparece en las indicaciones médicas.
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 6 }}>
                Nombre de la medicina
              </label>
              <input
                type="text"
                placeholder="Ej. Enalapril, Atorvastatina, Omeprazol"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1.5px solid var(--border-mint)', fontSize: 16, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <button className="btn-primary" disabled={!name.trim()} onClick={() => setStep(2)} style={{ opacity: name.trim() ? 1 : 0.5 }}>
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="screen-title" style={{ fontSize: 22 }}>¿Qué cantidad tomás?</h2>
            <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>Por cada toma, según las indicaciones. Incluí cantidad y concentración.</div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 6 }}>Cantidad por toma</label>
              <input
                type="text"
                value={dose}
                onChange={e => setDose(e.target.value)}
                placeholder="Ej. 1 comprimido de 10 mg"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1.5px solid var(--border-mint)', fontSize: 16, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <button className="btn-primary" onClick={() => setStep(3)}>Continuar</button>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="screen-title" style={{ fontSize: 22 }}>¿A qué hora te toca?</h2>
            <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>Elegí los horarios de todos los días. Formato de 24 horas.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 4 }}>Primer horario</label>
                <input type="time" value={time1} onChange={e => setTime1(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid var(--border-mint)', fontSize: 16, fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 4 }}>Segundo horario (opcional)</label>
                <input type="time" value={time2} onChange={e => setTime2(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid var(--border-mint)', fontSize: 16, fontFamily: 'inherit' }} />
              </div>
            </div>
            <button className="btn-primary" onClick={() => setStep(4)}>Continuar</button>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="screen-title" style={{ fontSize: 22 }}>Así quedará el recordatorio</h2>
            <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>Revisá que coincida con las indicaciones antes de guardar.</div>
            <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary-dark)' }}>{name}</div>
              <div style={{ fontSize: 15, color: 'var(--color-muted)' }}>{dose}</div>
              <div style={{ fontSize: 14, color: 'var(--color-primary)', fontWeight: 700 }}>
                Todos los días a las {time1} {time2 ? `y ${time2}` : ''}
              </div>
            </div>
            <button className="btn-primary" onClick={handleSave}><CheckCircle2 size={18} /> Guardar medicina</button>
            <button className="btn-outline" onClick={() => setStep(1)}>Corregir datos</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const RobertoAjustesTab: React.FC = () => {
  const {
    state,
    setFontSize,
    setHighContrast,
    setSoundEnabled,
    setVoiceConfirmationEnabled,
    toggleFamilyLink,
    addMedicine,
    setRole,
    showToast
  } = useMediRecord();

  const [activeSubscreen, setActiveSubscreen] = useState<'main' | 'apoyo' | 'manera' | 'avisos' | 'cargar' | 'invitacion'>('main');
  const [inviteCode, setInviteCode] = useState('');

  const handleTestSound = () => {
    showToast(
      'Probando sonido de alarma',
      'sound',
      'Sonido claro y pausado con locución: "Roberto, te toca Metformina".'
    );
  };

  // ── Subscreen: Mi persona de apoyo (E-09 / Journey E) ─────────────────────
  if (activeSubscreen === 'apoyo') {
    const handleLinkByCode = () => {
      if (inviteCode.replace(/\s/g, '') === state.familyCode.replace(/\s/g, '')) {
        toggleFamilyLink(true);
        showToast('¡Vinculación exitosa!', 'success', 'Silvana Gómez ahora es tu persona de apoyo.');
        setInviteCode('');
      } else {
        showToast('Código incorrecto', 'alert', 'Verificá el código con Silvana e intentá nuevamente.');
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setActiveSubscreen('main')}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 24 }}>Mi persona de apoyo</h1>
          <div className="screen-subtitle">Gestión del vínculo familiar y permisos</div>
        </div>

        {state.familyLinked ? (
          /* Estado L-02: Vinculado */
          <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)' }}>Silvana Gómez</div>
                <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>Vinculada con tu permiso</div>
              </div>
            </div>

            <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-mint)', paddingTop: 10 }}>
              Puede ver tus medicinas, horarios y registros, y ayudarte a configurarlos.
              <br /><br />
              <strong>Solo recibe avisos</strong> si no confirmás una toma o si indicás que no la tomaste. Nunca por cada toma normal.
            </div>

            <button
              className="btn-danger-outline"
              onClick={() => {
                toggleFamilyLink(false);
                showToast('Permiso retirado', 'info', 'Silvana ya no tiene acceso a tus registros ni medicinas.');
              }}
            >
              <ShieldAlert size={16} /> Desvincular a Silvana
            </button>
          </div>
        ) : (
          /* Estados no vinculados: L-06 (pendiente), L-07 (rechazado) o L-05 (sin vincular) */
          <>
            {/* L-06: Invitación pendiente recibida */}
            {state.pendingInvitation && (
              <div className="card-amber" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={20} color="var(--alert-amber-text)" />
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    Invitación recibida de Silvana
                  </div>
                </div>

                <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                  Silvana Gómez te envió una invitación para ser tu persona de apoyo (Código: <strong>{state.familyCode}</strong>). Aún no diste tu respuesta.
                </div>

                <button
                  className="btn-primary"
                  onClick={() => setActiveSubscreen('invitacion')}
                  style={{ backgroundColor: '#76500E' }}
                >
                  <MailCheck size={16} /> Ver y responder invitación
                </button>
              </div>
            )}

            {/* L-07: Invitación rechazada recientemente */}
            {state.invitationRejected && (
              <div className="card-white" style={{ border: '1.5px solid #F8B4B4', background: '#FDF2F2', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8A3930' }}>
                  <XCircle size={18} />
                  <span style={{ fontSize: 15, fontWeight: 700 }}>Invitación rechazada</span>
                </div>
                <div style={{ fontSize: 13, color: '#8A3930', lineHeight: 1.4 }}>
                  Rechazaste la última invitación. No compartís datos con ninguna persona de apoyo. Si cambiás de opinión, podés ingresar un nuevo código.
                </div>
              </div>
            )}

            {/* L-05: Estado base sin vincular */}
            <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--border-subtle)', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>Sin persona de apoyo</div>
                  <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Usás MediRecord de forma independiente</div>
                </div>
              </div>
              <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.4 }}>
                Si un familiar o cuidador te envió un código de invitación, ingresalo acá para vincularte con su permiso.
              </div>
            </div>

            <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <KeyRound size={18} color="var(--color-primary)" />
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  Ingresar código de invitación
                </div>
              </div>
              <input
                type="text"
                placeholder="Ej. 482 716"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '14px',
                  border: '1.5px solid var(--border-mint)', fontSize: 24,
                  fontFamily: 'inherit', textAlign: 'center', letterSpacing: 6,
                  fontWeight: 700, outline: 'none', color: 'var(--color-primary-dark)'
                }}
              />
              <button
                className="btn-primary"
                disabled={!inviteCode.trim()}
                onClick={handleLinkByCode}
                style={{ opacity: inviteCode.trim() ? 1 : 0.5 }}
              >
                <ShieldCheck size={18} /> Vincular con este código
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Subscreen: A tu manera (E-10, accesibilidad) ──────────────────────────
  if (activeSubscreen === 'manera') {
    const fontSizes: { id: FontSizePreference; label: string; desc: string }[] = [
      { id: 'normal', label: 'Normal', desc: 'Tamaño estándar para textos' },
      { id: 'large', label: 'Grande (Recomendado)', desc: 'Letra más clara y cómoda para leer' },
      { id: 'xlarge', label: 'Muy grande', desc: 'Máxima legibilidad y contraste alto' }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setActiveSubscreen('main')}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 24 }}>A tu manera</h1>
          <div className="screen-subtitle">Elegí cómo querés ver y escuchar tus recordatorios.</div>
        </div>

        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 8 }}>
            Tamaño de letra
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fontSizes.map(f => {
              const isSelected = state.fontSize === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFontSize(f.id)}
                  style={{
                    padding: '14px 16px', borderRadius: '16px',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--bg-mint)' : 'var(--bg-card)',
                    color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-text)',
                    cursor: 'pointer', textAlign: 'left', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>{f.desc}</div>
                  </div>
                  {isSelected && <Check size={20} color="var(--color-primary)" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>Alto contraste</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Texto más oscuro con bordes reforzados</div>
            </div>
            <input
              type="checkbox"
              checked={state.highContrast}
              onChange={e => setHighContrast(e.target.checked)}
              style={{ width: 22, height: 22, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>Confirmar con mi voz</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Habilitar micrófono para decir "Ya la tomé"</div>
            </div>
            <input
              type="checkbox"
              checked={state.voiceConfirmationEnabled}
              onChange={e => setVoiceConfirmationEnabled(e.target.checked)}
              style={{ width: 22, height: 22, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            showToast('Preferencias guardadas', 'success', 'Tu configuración de accesibilidad fue actualizada.');
            setActiveSubscreen('main');
          }}
        >
          Guardar preferencias
        </button>
      </div>
    );
  }

  // ── Subscreen: Avisos y sonido (H-07) ─────────────────────────────────────
  if (activeSubscreen === 'avisos') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setActiveSubscreen('main')}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 24 }}>Avisos y sonido</h1>
          <div className="screen-subtitle">Alarmas sonoras y plazos de recordatorio</div>
        </div>

        <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-primary-dark)' }}>Sonido claro</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>La alarma dice qué medicina te toca.</div>
            </div>
            <input
              type="checkbox"
              checked={state.soundEnabled}
              onChange={e => setSoundEnabled(e.target.checked)}
              style={{ width: 22, height: 22, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          </div>
          <button className="btn-soft" onClick={handleTestSound}>
            <Volume2 size={18} /> Probar sonido de ejemplo
          </button>
        </div>

        <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>Recordar otra vez</div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4 }}>
            Si tocás «Posponer», la alarma volverá a sonar a los 10 minutos. Este plazo no reinicia el tiempo para avisar a Silvana.
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            showToast('Preferencias guardadas', 'success', 'Configuración de sonido actualizada.');
            setActiveSubscreen('main');
          }}
        >
          Guardar preferencias
        </button>
      </div>
    );
  }

  // ── Subscreen: Cargar medicamentos (Task 1.2) ──────────────────────────────
  if (activeSubscreen === 'cargar') {
    return (
      <AddMedWizard
        onClose={() => setActiveSubscreen('main')}
        onSave={(med) => addMedicine(med)}
      />
    );
  }

  // ── Subscreen: Ver Invitación Recibida (Task 3.1 / L-06) ───────────────────
  if (activeSubscreen === 'invitacion') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <button className="btn-back" onClick={() => setActiveSubscreen('main')}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>
        <InvitationReceivedScreen onClose={() => setActiveSubscreen('main')} />
      </div>
    );
  }

  // ── Main Menu (H-03) — igualado a H-11 estilo SilvanaAjustesTab ───────────
  const menuOptions = [
    {
      key: 'apoyo' as const,
      icon: <Users size={20} />,
      title: 'Mi persona de apoyo',
      subtitle: state.familyLinked
        ? 'Silvana Gómez (Vinculada)'
        : state.pendingInvitation
        ? '¡Invitación recibida pendiente!'
        : 'Sin vincular'
    },
    {
      key: 'manera' as const,
      icon: <Eye size={20} />,
      title: 'A tu manera',
      subtitle: 'Tamaño de letra, contraste y voz'
    },
    {
      key: 'avisos' as const,
      icon: <Bell size={20} />,
      title: 'Avisos y sonido',
      subtitle: state.soundEnabled ? 'Sonido claro activado' : 'Sonido desactivado'
    },
    {
      key: 'cargar' as const,
      icon: <Pill size={20} />,
      title: 'Cargar medicamentos',
      subtitle: `${state.medicines.length} medicina${state.medicines.length !== 1 ? 's' : ''} registrada${state.medicines.length !== 1 ? 's' : ''}`
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)' }}>Ajustes</h1>
        <div className="screen-subtitle">Preferencias de tu cuenta y accesibilidad</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {menuOptions.map(opt => (
          <div
            key={opt.key}
            className="card-white"
            onClick={() => setActiveSubscreen(opt.key)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                backgroundColor: 'var(--bg-mint)', color: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {opt.icon}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>{opt.title}</div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{opt.subtitle}</div>
              </div>
            </div>
            <ChevronRight size={20} color="var(--color-muted-light)" />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
        <button className="btn-soft" onClick={() => setRole('silvana')}>
          <LogOut size={16} /> Cambiar al modo de Silvana (Familiar)
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-muted-light)', marginTop: 8 }}>
          MediRecord v1.0 · Universidad Demo
        </div>
      </div>
    </div>
  );
};
