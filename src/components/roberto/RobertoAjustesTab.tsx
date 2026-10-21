import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { InvitationReceivedScreen } from './InvitationReceivedScreen';
import { AccessibilitySettingsView } from '../common/AccessibilitySettingsView';
import {
  Users,
  Eye,
  Bell,
  Volume2,
  ChevronRight,
  ArrowLeft,
  UserCheck,
  ShieldAlert,
  LogOut,
  ShieldCheck,
  KeyRound,
  MailCheck,
  XCircle,
  AlertCircle
} from 'lucide-react';

// ─── Main Component ──────────────────────────────────────────────────────────

export const RobertoAjustesTab: React.FC = () => {
  const {
    state,
    setSoundEnabled,
    toggleFamilyLink,
    setRole,
    showToast
  } = useMediRecord();

  const [activeSubscreen, setActiveSubscreen] = useState<'main' | 'apoyo' | 'manera' | 'avisos' | 'invitacion'>('main');
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

  // ── Subscreen: Accesibilidad ──────────────────────────────────────────────
  if (activeSubscreen === 'manera') {
    return <AccessibilitySettingsView onBack={() => setActiveSubscreen('main')} />;
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
      title: 'Accesibilidad',
      subtitle: 'Tamaño de letra y alto contraste'
    },
    {
      key: 'avisos' as const,
      icon: <Bell size={20} />,
      title: 'Avisos y sonido',
      subtitle: state.soundEnabled ? 'Sonido claro activado' : 'Sonido desactivado'
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
