import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { InvitationReceivedScreen } from './InvitationReceivedScreen';
import { AccessibilitySettingsView } from '../common/AccessibilitySettingsView';
import { formatLinkCode } from '../../utils/dateFormat';
import { OFFLINE } from '../../api/client';
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
  const { state, setSoundEnabled, unlink, logout, showToast } = useMediRecord();
  const { link } = state;
  const supportName = link.otherDisplayName ?? '';

  const [activeSubscreen, setActiveSubscreen] = useState<'main' | 'apoyo' | 'manera' | 'avisos' | 'invitacion'>('main');

  const handleTestSound = () => {
    showToast(
      'Probando sonido de alarma',
      'sound',
      'Sonido claro y pausado que dice qué medicina te toca.'
    );
  };

  // ── Subscreen: Mi persona de apoyo ────────────────────────────────────────
  if (activeSubscreen === 'apoyo') {
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

        {link.status === 'accepted' ? (
          <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)' }}>{supportName}</div>
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
                if (window.confirm(`¿Seguro que querés desvincular a ${supportName}? Va a dejar de ver tus tomas.`)) unlink();
              }}
            >
              <ShieldAlert size={16} /> Desvincular a {supportName}
            </button>
          </div>
        ) : (
          <>
            {link.status === 'pending' && (
              <div className="card-amber" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={20} color="var(--alert-amber-text)" />
                  <div style={{ fontSize: 16, fontWeight: 700 }}>Invitación recibida de {link.otherDisplayName}</div>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                  {link.otherDisplayName} quiere ser tu persona de apoyo. Todavía no respondiste.
                </div>
                <button className="btn-primary" onClick={() => setActiveSubscreen('invitacion')} style={{ backgroundColor: '#76500E' }}>
                  <MailCheck size={16} /> Ver y responder invitación
                </button>
              </div>
            )}

            {link.status === 'rejected' && (
              <div className="card-white" style={{ border: '1.5px solid #F8B4B4', background: '#FDF2F2', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8A3930' }}>
                  <XCircle size={18} />
                  <span style={{ fontSize: 15, fontWeight: 700 }}>Sin vínculo activo</span>
                </div>
                <div style={{ fontSize: 13, color: '#8A3930', lineHeight: 1.4 }}>
                  No compartís datos con ninguna persona de apoyo. Si cambiás de opinión, compartí tu código otra vez.
                </div>
              </div>
            )}

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
                Si querés que un familiar te acompañe, pasale este código. Cuando lo cargue, vas a poder aceptar o rechazar.
              </div>
            </div>

            <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <KeyRound size={18} color="var(--color-primary)" />
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)' }}>Tu código</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 6, color: 'var(--color-primary-dark)' }}>
                {formatLinkCode(state.user?.linkCode)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-muted)' }}>
                <ShieldCheck size={14} color="var(--color-primary)" />
                <span>Nada cambia sin tu consentimiento explícito</span>
              </div>
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
            Si tocás «Posponer», la alarma volverá a sonar a los 10 minutos. Este plazo no reinicia el tiempo para avisar a tu persona de apoyo.
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
  const allOptions = [
    {
      key: 'apoyo' as const,
      icon: <Users size={20} />,
      title: 'Mi persona de apoyo',
      subtitle:
        link.status === 'accepted'
          ? `${supportName} (Vinculada)`
          : link.status === 'pending'
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
  // Sin conexión no hay persona de apoyo: necesita el servidor.
  const menuOptions = OFFLINE ? allOptions.filter(o => o.key !== 'apoyo') : allOptions;

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

      {OFFLINE ? (
        <div style={{ fontSize: 13, color: 'var(--color-muted)', textAlign: 'center', marginTop: 10 }}>
          Tus medicinas y ajustes se guardan solo en este teléfono.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', textAlign: 'center' }}>
            Entraste como <strong>@{state.user?.username}</strong>
          </div>
          <button className="btn-soft" onClick={logout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
