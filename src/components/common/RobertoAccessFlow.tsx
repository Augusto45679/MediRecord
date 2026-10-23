import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import type { FontSizePreference } from '../../types';
import { LoginGoogleConfirmScreen } from './LoginGoogleConfirmScreen';
import {
  ArrowRight,
  Check,
  Pill,
  User,
  Type,
  Bell,
  CheckCircle2
} from 'lucide-react';

interface RobertoAccessFlowProps {
  onComplete: () => void;
  initialStep?: number;
}

export const RobertoAccessFlow: React.FC<RobertoAccessFlowProps> = ({ onComplete, initialStep = 1 }) => {
  const { setFontSize, state, setSpecialView } = useMediRecord();
  const [step, setStep] = useState(initialStep);

  // STEP 0: Log in 2 con Google para Roberto
  if (step === 0) {
    return (
      <LoginGoogleConfirmScreen
        role="roberto"
        onConfirmAccount={() => setStep(1)}
        onChooseOtherAccount={() => setSpecialView('login-1')}
        onSwitchRole={() => setSpecialView('onboarding-silvana')}
      />
    );
  }

  const fontSizes: { id: FontSizePreference; label: string; preview: string }[] = [
    { id: 'normal', label: 'Normal', preview: 'Aa' },
    { id: 'large', label: 'Grande', preview: 'Aa' },
    { id: 'xlarge', label: 'Muy grande', preview: 'Aa' }
  ];

  const previewSizes: Record<FontSizePreference, number> = {
    normal: 18,
    large: 24,
    xlarge: 32
  };

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: 'var(--bg-app)',
      padding: '28px 24px', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', overflowY: 'auto'
    }}>
      {/* Brand */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-mint)', padding: '6px 14px', borderRadius: 999,
          color: 'var(--color-primary)', fontWeight: 700, fontSize: 14, marginBottom: 28
        }}>
          <Pill size={16} /> MediRecord
        </div>

        {/* STEP 1: Bienvenida */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={36} />
            </div>

            <h1 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2, color: 'var(--color-primary-dark)', letterSpacing: -0.6 }}>
              Hola, Roberto.<br />Bienvenido.
            </h1>

            <p style={{ fontSize: 16, color: 'var(--color-muted)', lineHeight: 1.5 }}>
              MediRecord te va a recordar cada medicamento a su hora. Solo tenés que confirmar cuando lo tomés.
            </p>

            <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: <Bell size={18} />, text: 'Te avisamos a la hora exacta con una alarma clara' },
                { icon: <CheckCircle2 size={18} />, text: 'Confirmás fácilmente con un toque en pantalla' },
                { icon: <User size={18} />, text: 'Tu hija Silvana solo recibe aviso si olvidás una toma' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: 'var(--color-primary)', flexShrink: 0 }}>{item.icon}</div>
                  <span style={{ fontSize: 14, color: 'var(--color-primary-dark)', lineHeight: 1.4 }}>{item.text}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={() => setStep(2)}>
              Empezar <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: Tamaño de letra */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Type size={36} />
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, color: 'var(--color-primary-dark)', letterSpacing: -0.5 }}>
              ¿Cómo preferís ver el texto?
            </h1>

            <p style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.45 }}>
              Elegí el tamaño de letra que mejor se adapte a tu vista. Podés cambiarlo después en Ajustes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {fontSizes.map(f => {
                const isSelected = state.fontSize === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFontSize(f.id)}
                    style={{
                      padding: '16px 20px', borderRadius: '18px',
                      border: isSelected ? '2.5px solid var(--color-primary)' : '1.5px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--bg-mint)' : 'var(--bg-card)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{
                        fontSize: previewSizes[f.id], fontWeight: 800,
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-muted-light)',
                        lineHeight: 1, minWidth: 36
                      }}>
                        {f.preview}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                        {f.label}
                      </span>
                    </div>
                    {isSelected && <Check size={22} color="var(--color-primary)" />}
                  </button>
                );
              })}
            </div>

            <button className="btn-primary" onClick={() => setStep(3)}>
              Continuar <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 3: Listo */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              backgroundColor: 'var(--color-primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h1 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2, color: 'var(--color-primary-dark)', letterSpacing: -0.6 }}>
              ¡Todo listo, Roberto!
            </h1>

            <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>Tu configuración:</div>
              <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
                Letra: <strong>{state.fontSize === 'normal' ? 'Normal' : state.fontSize === 'large' ? 'Grande' : 'Muy grande'}</strong>
              </div>
              <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
                Confirmación: <strong>Con toque en pantalla</strong>
              </div>
            </div>

            <p style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.45 }}>
              Podés cambiar cualquier preferencia en cualquier momento desde el menú de Ajustes.
            </p>

            <button className="btn-primary" onClick={onComplete}>
              Ir a mis medicinas <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Indicador de paso */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        {[1, 2, 3].map(s => (
          <div
            key={s}
            style={{
              width: step >= s ? 24 : 8, height: 8, borderRadius: 4,
              backgroundColor: step >= s ? 'var(--color-primary)' : 'var(--border-mint)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};
