import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import type { UserRole } from '../../types';
import { Pill, HeartHandshake, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { RobertoAccessFlow } from './RobertoAccessFlow';
import { SilvanaAccessFlow } from './SilvanaAccessFlow';

interface RoleSelectionViewProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onSelectRole }) => {
  const { setRole, setSpecialView } = useMediRecord();
  const [onboarding, setOnboarding] = useState<UserRole | null>(null);

  const handleChoose = (role: UserRole) => {
    setRole(role);
    setOnboarding(role);
  };

  const handleOnboardingComplete = (role: UserRole) => {
    setOnboarding(null);
    onSelectRole(role);
  };

  // Mostrar el flujo de acceso/onboarding si se eligió un rol
  if (onboarding === 'roberto') {
    return <RobertoAccessFlow onComplete={() => handleOnboardingComplete('roberto')} />;
  }
  if (onboarding === 'silvana') {
    return <SilvanaAccessFlow onComplete={() => handleOnboardingComplete('silvana')} />;
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--bg-app)',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflowY: 'auto'
    }}>
      {/* Brand Header */}
      <div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-mint)',
          padding: '6px 14px',
          borderRadius: 999,
          color: 'var(--color-primary)',
          fontWeight: 700,
          fontSize: 14,
          marginBottom: 20
        }}>
          <Pill size={18} />
          <span>MediRecord</span>
        </div>

        <h1 style={{
          fontSize: 32,
          fontWeight: 800,
          lineHeight: 1.15,
          color: 'var(--color-primary-dark)',
          letterSpacing: -0.8,
          marginBottom: 8
        }}>
          Tus medicinas,<br />a tu ritmo.
        </h1>

        <p style={{
          fontSize: 15,
          color: 'var(--color-muted)',
          lineHeight: 1.45,
          marginBottom: 24
        }}>
          Recordá cada toma y registrala cuando la hayas tomado. Acompañá a quien querés con su consentimiento.
        </p>

        <div style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--color-primary-dark)',
          marginBottom: 12
        }}>
          ¿Cómo vas a usar MediRecord?
        </div>

        {/* Roles options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Option 1: Roberto */}
          <button
            onClick={() => handleChoose('roberto')}
            style={{
              padding: '18px 20px',
              borderRadius: '20px',
              border: '2px solid var(--border-mint)',
              backgroundColor: '#FFFFFF',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 4px 12px rgba(21, 62, 58, 0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <User size={26} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Tomo medicinas
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.35 }}>
                Recordatorios claros, confirmación con un toque y voz.
              </div>
            </div>

            <ArrowRight size={20} color="var(--color-primary)" />
          </button>

          {/* Option 2: Silvana */}
          <button
            onClick={() => handleChoose('silvana')}
            style={{
              padding: '18px 20px',
              borderRadius: '20px',
              border: '2px solid var(--border-mint)',
              backgroundColor: '#FFFFFF',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 4px 12px rgba(21, 62, 58, 0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <HeartHandshake size={26} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Soy familiar o cuidador
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.35 }}>
                Carga de recetas y aviso únicamente ante omisiones.
              </div>
            </div>

            <ArrowRight size={20} color="var(--color-primary)" />
          </button>
        </div>

        {/* Acceso directo a Log In */}
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <button
            onClick={() => {
              setRole('roberto');
              setSpecialView('login-1');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '6px 12px'
            }}
          >
            ¿Ya tenés una cuenta? Iniciar sesión
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: 24 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          color: 'var(--color-muted)',
          justifyContent: 'center',
          marginBottom: 4
        }}>
          <ShieldCheck size={16} color="var(--color-primary)" />
          <span>Tus datos y registros están seguros en tu dispositivo</span>
        </div>
      </div>
    </div>
  );
};
