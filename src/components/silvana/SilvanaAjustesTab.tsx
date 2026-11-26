import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { AccessibilitySettingsView } from '../common/AccessibilitySettingsView';
import {
  Bell,
  Eye,
  UserCheck,
  ChevronRight,
  ArrowLeft,
  Check,
  Volume2,
  Vibrate,
  LogOut,
  ShieldCheck,
  KeyRound,
  Send,
  CheckCircle2,
  ShieldAlert,
  Clock
} from 'lucide-react';

export const SilvanaAjustesTab: React.FC = () => {
  const {
    state,
    setSilvanaAlertWait,
    setSoundEnabled,
    setVibrationEnabled,
    inviteByCode,
    unlink,
    logout
  } = useMediRecord();

  const [activeSubscreen, setActiveSubscreen] = useState<'main' | 'avisos' | 'vinculo' | 'accesibilidad'>('main');
  const [code, setCode] = useState('');
  const { link } = state;
  const patientName = link.otherDisplayName ?? '';

  const waitOptions = [
    { minutes: 30, label: '30 minutos', desc: 'Aviso rápido ante tomas críticas' },
    { minutes: 60, label: '60 minutos (Recomendado)', desc: 'Da margen sin generar falsas alarmas' },
    { minutes: 90, label: '90 minutos', desc: 'Mayor margen de autonomía' }
  ];

  // Subscreen: Avisos · Preferencias (H-11)
  if (activeSubscreen === 'avisos') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setActiveSubscreen('main')}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 24 }}>
            Avisos de omisión
          </h1>
          <div className="screen-subtitle">
            ¿Cuánto esperamos antes de avisarte?
          </div>
        </div>

        {/* Wait time selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {waitOptions.map(opt => {
            const isSelected = state.silvanaAlertWaitMinutes === opt.minutes;
            return (
              <button
                key={opt.minutes}
                onClick={() => setSilvanaAlertWait(opt.minutes)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--bg-mint)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>{opt.desc}</div>
                </div>
                {isSelected && <Check size={20} color="var(--color-primary)" />}
              </button>
            );
          })}
        </div>

        {/* Sound & vibration toggles */}
        <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Volume2 size={20} color="var(--color-primary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>
                  Sonido de aviso
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                  Alerta sonora ante una omisión
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={state.soundEnabled}
              onChange={e => setSoundEnabled(e.target.checked)}
              style={{ width: 22, height: 22, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Vibrate size={20} color="var(--color-primary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>
                  Vibración
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                  Patrón distintivo de aviso
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={state.vibrationEnabled}
              onChange={e => setVibrationEnabled(e.target.checked)}
              style={{ width: 22, height: 22, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Design rule note */}
        <div className="card-mint" style={{ fontSize: 13, color: 'var(--color-primary-dark)', lineHeight: 1.4 }}>
          <strong>Regla de MediRecord:</strong> Solo te avisamos ante una omisión. Si confirma tarde, se actualiza ese mismo aviso y queda resuelto automáticamente.
        </div>

        <button className="btn-primary" onClick={() => setActiveSubscreen('main')}>
          Guardar preferencias
        </button>
      </div>
    );
  }

  // Subscreen: Vínculo con la persona que acompañás
  if (activeSubscreen === 'vinculo') {
    const handleSubmitCode = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!code.trim()) return;
      if (await inviteByCode(code)) setCode('');
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setActiveSubscreen('main')}>
            <ArrowLeft size={16} /> Volver a Ajustes
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 24 }}>
            {link.status === 'accepted' ? 'Vínculo familiar' : 'Vincular a tu familiar'}
          </h1>
          <div className="screen-subtitle">
            {link.status === 'accepted'
              ? 'Consentimiento y acompañamiento activo'
              : 'Ingresá su código para pedirle permiso'}
          </div>
        </div>

        {link.status === 'accepted' ? (
          <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--color-primary-dark)' }}>{patientName}</div>
                <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={14} /> Consentimiento activo
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--color-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-mint)', paddingTop: 12 }}>
              {patientName} te dio permiso para ver y cargar sus medicinas y horarios. Solo recibís avisos ante omisiones.
            </div>
            <button
              className="btn-danger-outline"
              onClick={() => {
                if (window.confirm(`¿Seguro que querés dejar de acompañar a ${patientName}?`)) unlink();
              }}
            >
              <ShieldAlert size={16} /> Desvincular
            </button>
          </div>
        ) : link.status === 'pending' ? (
          <div className="card-amber" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Clock size={20} color="var(--alert-amber-text)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--alert-amber-text)' }}>
              <strong>Invitación enviada a {link.otherDisplayName}.</strong> Cuando la acepte desde su app, vas a ver sus tomas.
              <div style={{ marginTop: 10 }}>
                <button className="btn-soft" onClick={() => unlink()} style={{ minHeight: 40, fontSize: 13 }}>
                  Cancelar invitación
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitCode} className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {link.status === 'rejected' && (
              <div style={{ fontSize: 13, color: '#8A3930', lineHeight: 1.4 }}>
                La última invitación fue rechazada o el vínculo se quitó. Podés intentar de nuevo con un código.
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <KeyRound size={18} color="var(--color-primary)" />
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)' }}>Código de 6 dígitos</div>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--color-muted)', lineHeight: 1.45 }}>
              Lo encuentra en su app, en <strong>Ajustes › Mi persona de apoyo</strong>.
            </div>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000 000"
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '14px',
                border: '1.5px solid var(--border-mint)', fontSize: 24,
                fontFamily: 'inherit', textAlign: 'center', letterSpacing: 6,
                fontWeight: 700, outline: 'none', color: 'var(--color-primary-dark)', boxSizing: 'border-box'
              }}
            />
            <button type="submit" className="btn-primary" disabled={!code.trim()} style={{ opacity: code.trim() ? 1 : 0.5 }}>
              <Send size={16} /> Enviar invitación
            </button>
            <div style={{ fontSize: 12, color: 'var(--color-muted-light)', textAlign: 'center', lineHeight: 1.4 }}>
              La vinculación siempre requiere el consentimiento explícito de la persona que toma las medicinas.
            </div>
          </form>
        )}
      </div>
    );
  }

  // Subscreen: Accesibilidad
  if (activeSubscreen === 'accesibilidad') {
    return <AccessibilitySettingsView onBack={() => setActiveSubscreen('main')} />;
  }

  // Main Silvana Menu (H-10)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)', marginBottom: 2 }}>
          Ajustes
        </h1>
        <div className="screen-subtitle">
          Configuración de familiar cuidador
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Único botón de Vínculo e Invitación en Ajustes */}
        <div
          className="card-white"
          onClick={() => setActiveSubscreen('vinculo')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <UserCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Vínculo familiar
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                {link.status === 'accepted'
                  ? `Vinculado con ${patientName} (Consentimiento activo)`
                  : link.status === 'pending'
                    ? `Invitación enviada a ${link.otherDisplayName}`
                    : 'Sin vincular · Ingresá el código de tu familiar'}
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--color-muted-light)" />
        </div>

        {/* Option 2: Avisos · Preferencias */}
        <div
          className="card-white"
          onClick={() => setActiveSubscreen('avisos')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bell size={20} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Avisos · Preferencias
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                Avisar a los {state.silvanaAlertWaitMinutes} min
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--color-muted-light)" />
        </div>

        {/* Option 4: Accesibilidad */}
        <div
          className="card-white"
          onClick={() => setActiveSubscreen('accesibilidad')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Eye size={20} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Accesibilidad
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                {state.fontSize === 'normal' ? 'Letra normal' : state.fontSize === 'large' ? 'Letra grande' : 'Letra muy grande'}
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--color-muted-light)" />
        </div>
      </div>

      {/* Switch role */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--color-muted)', textAlign: 'center' }}>
          Entraste como <strong>@{state.user?.username}</strong>
        </div>
        <button className="btn-soft" onClick={logout}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
};
