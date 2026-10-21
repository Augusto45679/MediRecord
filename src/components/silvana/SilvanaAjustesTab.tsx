import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import {
  Bell,
  UserCheck,
  ChevronRight,
  ArrowLeft,
  Check,
  Volume2,
  Vibrate,
  LogOut,
  ShieldCheck,
  KeyRound,
  Copy,
  Share2
} from 'lucide-react';

export const SilvanaAjustesTab: React.FC = () => {
  const {
    state,
    setSilvanaAlertWait,
    setSoundEnabled,
    setVibrationEnabled,
    setRole,
    showToast
  } = useMediRecord();

  const [activeSubscreen, setActiveSubscreen] = useState<'main' | 'avisos' | 'vinculo' | 'codigo'>('main');

  const waitOptions = [
    { minutes: 30, label: '30 minutos', desc: 'Aviso rápido ante tomas críticas' },
    { minutes: 60, label: '60 minutos (Recomendado)', desc: 'Tiempo óptimo para dar margen a Roberto sin generar falsas alarmas' },
    { minutes: 90, label: '90 minutos', desc: 'Mayor margen de autonomía para Roberto' }
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
          <strong>Regla de MediRecord:</strong> Solo te avisamos ante una omisión. Si Roberto confirma tarde, se actualiza ese mismo aviso y queda resuelto automáticamente.
        </div>

        <button className="btn-primary" onClick={() => setActiveSubscreen('main')}>
          Guardar preferencias
        </button>
      </div>
    );
  }

  // Subscreen: Roberto · Vínculo
  if (activeSubscreen === 'vinculo') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setActiveSubscreen('main')}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 24 }}>
            Vínculo con Roberto
          </h1>
          <div className="screen-subtitle">
            Permiso y consentimiento activo
          </div>
        </div>

        <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={28} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Roberto Gómez
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
                Consentimiento otorgado
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4, borderTop: '1px solid var(--border-mint)', paddingTop: 10 }}>
            Código de invitación utilizado: <strong>{state.familyCode}</strong>
            <br /><br />
            Roberto te otorgó permiso para cargar sus medicinas y horarios. Podés consultar sus registros, pero el acceso depende de que él mantenga su consentimiento.
          </div>

          <button
            className="btn-soft"
            onClick={() => setActiveSubscreen('codigo')}
            style={{ marginTop: 6 }}
          >
            <KeyRound size={16} /> Ver pantalla de código para compartir
          </button>
        </div>
      </div>
    );
  }

  // Subscreen: Código de invitación (L-01)
  if (activeSubscreen === 'codigo') {
    const handleCopy = () => {
      showToast('Código copiado', 'success', `El código ${state.familyCode} fue copiado al portapapeles.`);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setActiveSubscreen('main')}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 24 }}>
            Invitar a tu familiar
          </h1>
          <div className="screen-subtitle">
            Compartí este código para vincular a Roberto
          </div>
        </div>

        <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, padding: 24 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <KeyRound size={28} />
          </div>

          <div>
            <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-primary)', fontWeight: 700 }}>
              Código de invitación
            </div>
            <div style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: 6,
              color: 'var(--color-primary-dark)',
              marginTop: 6,
              fontFamily: 'monospace'
            }}>
              {state.familyCode}
            </div>
          </div>

          <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.45 }}>
            Roberto debe ingresar este código en la sección <strong>«Mi persona de apoyo»</strong> dentro de sus Ajustes para autorizar tu acompañamiento.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-primary" onClick={handleCopy}>
            <Copy size={18} /> Copiar código de invitación
          </button>

          <button
            className="btn-soft"
            onClick={() => {
              showToast('Enlace enviado', 'info', `Se compartió la invitación con el código ${state.familyCode}.`);
            }}
          >
            <Share2 size={18} /> Compartir por WhatsApp o Mensaje
          </button>
        </div>

        <div style={{
          fontSize: 12,
          color: 'var(--color-muted-light)',
          textAlign: 'center',
          lineHeight: 1.4
        }}>
          La vinculación requiere que Roberto dé su consentimiento explícito en su teléfono.
        </div>
      </div>
    );
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
        {/* Option 1: Vínculo con Roberto */}
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
                Roberto · Vínculo
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                {state.familyLinked ? 'Permiso otorgado por Roberto' : 'Vínculo desvinculado / pendiente'}
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--color-muted-light)" />
        </div>

        {/* Option 2: Compartir código (L-01) */}
        <div
          className="card-white"
          onClick={() => setActiveSubscreen('codigo')}
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
              <KeyRound size={20} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Código de invitación (L-01)
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                Código: {state.familyCode}
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--color-muted-light)" />
        </div>

        {/* Option 3: Avisos · Preferencias */}
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
      </div>

      {/* Switch role */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
        <button
          className="btn-soft"
          onClick={() => setRole('roberto')}
        >
          <LogOut size={16} /> Cambiar al modo de Roberto (Paciente)
        </button>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-muted-light)', marginTop: 8 }}>
          MediRecord Familiar v1.0 · Universidad Demo
        </div>
      </div>
    </div>
  );
};
