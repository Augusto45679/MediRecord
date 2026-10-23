import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { LoginGoogleConfirmScreen } from './LoginGoogleConfirmScreen';
import {
  ArrowRight,
  Check,
  Pill,
  HeartHandshake,
  Bell,
  Clock,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface SilvanaAccessFlowProps {
  onComplete: () => void;
  initialStep?: number;
}

export const SilvanaAccessFlow: React.FC<SilvanaAccessFlowProps> = ({ onComplete, initialStep = 0 }) => {
  const { setSilvanaAlertWait, state, setSpecialView } = useMediRecord();
  const [step, setStep] = useState(initialStep);

  // STEP 0: Log in 2 con Google para Silvana
  if (step === 0) {
    return (
      <LoginGoogleConfirmScreen
        role="silvana"
        onConfirmAccount={() => setStep(1)}
        onChooseOtherAccount={() => setSpecialView('login-1')}
        onSwitchRole={() => setSpecialView('onboarding-roberto')}
      />
    );
  }

  const waitOptions = [
    { minutes: 30, label: '30 minutos', desc: 'Aviso rápido ante tomas críticas' },
    { minutes: 60, label: '60 minutos (Recomendado)', desc: 'Tiempo óptimo sin generar falsas alarmas' },
    { minutes: 90, label: '90 minutos', desc: 'Mayor autonomía para Roberto' }
  ];

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: 'var(--bg-app)',
      padding: '28px 24px', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', overflowY: 'auto'
    }}>
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-mint)', padding: '6px 14px', borderRadius: 999,
          color: 'var(--color-primary)', fontWeight: 700, fontSize: 14, marginBottom: 28
        }}>
          <Pill size={16} /> MediRecord · Familiar
        </div>

        {/* STEP 1: Bienvenida Silvana */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <HeartHandshake size={36} />
            </div>

            <h1 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2, color: 'var(--color-primary-dark)', letterSpacing: -0.6 }}>
              Hola, Silvana.<br />Gracias por acompañar a Roberto.
            </h1>

            <p style={{ fontSize: 16, color: 'var(--color-muted)', lineHeight: 1.5 }}>
              MediRecord te avisa <strong>solo cuando Roberto omite una toma</strong>. Nunca ante cada toma normal, para respetar su autonomía.
            </p>

            <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: <ShieldCheck size={18} />, text: 'Roberto da su consentimiento explícito para que lo acompañes' },
                { icon: <Bell size={18} />, text: 'Solo te avisamos si no confirma una toma en el tiempo acordado' },
                { icon: <CheckCircle2 size={18} />, text: 'Podés cargar sus medicinas y horarios desde la app' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 1 }}>{item.icon}</div>
                  <span style={{ fontSize: 14, color: 'var(--color-primary-dark)', lineHeight: 1.4 }}>{item.text}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={() => setStep(2)}>
              Continuar <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: Preferencia de tiempo de aviso */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Clock size={36} />
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, color: 'var(--color-primary-dark)', letterSpacing: -0.5 }}>
              ¿Cuándo querés que te avisemos?
            </h1>

            <p style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.45 }}>
              Si Roberto no confirma una toma, esperamos este tiempo antes de avisarte. Podés cambiarlo después.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {waitOptions.map(opt => {
                const isSelected = state.silvanaAlertWaitMinutes === opt.minutes;
                return (
                  <button
                    key={opt.minutes}
                    onClick={() => setSilvanaAlertWait(opt.minutes)}
                    style={{
                      padding: '16px 20px', borderRadius: '18px',
                      border: isSelected ? '2.5px solid var(--color-primary)' : '1.5px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--bg-mint)' : 'var(--bg-card)',
                      cursor: 'pointer', textAlign: 'left', display: 'flex',
                      alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>{opt.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>{opt.desc}</div>
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
              ¡Configuración lista!
            </h1>

            <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>Tu preferencia:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--color-muted)' }}>
                <Bell size={16} color="var(--color-primary)" />
                <span>Te avisamos a los <strong>{state.silvanaAlertWaitMinutes} minutos</strong> de una toma no confirmada</span>
              </div>
            </div>

            <p style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.45 }}>
              Podés cargar las medicinas de Roberto desde la pestaña «Medicinas». Cualquier cambio queda registrado.
            </p>

            <button className="btn-primary" onClick={onComplete}>
              Ver resumen de Roberto <ArrowRight size={18} />
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
