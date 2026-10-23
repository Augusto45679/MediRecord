import React, { useState } from 'react';
import { Pill } from 'lucide-react';
import type { UserRole } from '../../types';

export interface LoginInitialScreenProps {
  currentRole?: UserRole;
  onGoogleLogin: (role?: UserRole) => void;
  onEmailLogin?: (email: string, role?: UserRole) => void;
  onNavigateToRoleSelection?: () => void;
}

export const LoginInitialScreen: React.FC<LoginInitialScreenProps> = ({
  currentRole = 'roberto',
  onGoogleLogin,
  onEmailLogin,
  onNavigateToRoleSelection
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleClick = () => {
    onGoogleLogin(currentRole);
  };

  const handleEntrar = (e: React.FormEvent) => {
    e.preventDefault();
    const lower = email.toLowerCase();
    const detectedRole: UserRole = lower.includes('silvana') ? 'silvana' : 'roberto';
    if (onEmailLogin) {
      onEmailLogin(email || `${detectedRole}@ejemplo.com`, detectedRole);
    } else {
      onGoogleLogin(detectedRole);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#FCFAF5',
      padding: '16px 24px 12px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div>
        {/* Status Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 14,
          fontWeight: 700,
          color: '#153E3A',
          marginBottom: 16
        }}>
          <span>9:00</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Cellular */}
            <svg width="17" height="12" viewBox="0 0 18 12" fill="none">
              <rect x="0" y="8" width="2.5" height="4" rx="0.8" fill="#153E3A" />
              <rect x="5" y="5.5" width="2.5" height="6.5" rx="0.8" fill="#153E3A" />
              <rect x="10" y="3" width="2.5" height="9" rx="0.8" fill="#153E3A" />
              <rect x="15" y="0.5" width="2.5" height="11.5" rx="0.8" fill="#153E3A" />
            </svg>
            {/* WiFi */}
            <svg width="17" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="#153E3A" />
              <path d="M4.5 7.5c1.9-1.8 5.1-1.8 7 0" stroke="#153E3A" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M2 4.5c3.3-3.1 8.7-3.1 12 0" stroke="#153E3A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {/* Battery */}
            <div style={{
              width: 22,
              height: 12,
              border: '1.8px solid #153E3A',
              borderRadius: 4,
              padding: 1.5,
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{ width: 14, height: 7, backgroundColor: '#153E3A', borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* Central Pill Icon Circle (100x100, no shadow, no extra rotation) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 12
        }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: '#E6F1EC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Pill
              size={48}
              color="#07564F"
              strokeWidth={2.4}
            />
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 30,
            fontWeight: 800,
            color: '#07564F',
            textAlign: 'center',
            margin: '18px 0 6px 0',
            letterSpacing: -0.6
          }}>
            MediRecord
          </h1>

          <div style={{
            fontSize: 23,
            fontWeight: 800,
            color: '#153E3A',
            textAlign: 'center',
            letterSpacing: -0.4,
            marginBottom: 8
          }}>
            Tus medicinas, a tu ritmo.
          </div>

          <p style={{
            fontSize: 17,
            color: '#49625D',
            textAlign: 'center',
            lineHeight: 1.42,
            margin: '0 auto 22px auto',
            maxWidth: 340
          }}>
            Recordá cada toma y registrala cuando la hayas tomado.
          </p>
        </div>

        {/* Botón: Continuar con Google (altura 68-72px, plano, sin sombras) */}
        <button
          onClick={handleGoogleClick}
          style={{
            width: '100%',
            minHeight: 68,
            padding: '16px 20px',
            backgroundColor: '#07564F',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 16,
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            transition: 'opacity 0.15s ease'
          }}
          onMouseDown={(e) => { e.currentTarget.style.opacity = '0.9'; }}
          onMouseUp={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <span style={{
            fontSize: 22,
            fontWeight: 800,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            G
          </span>
          <span>Continuar con Google</span>
        </button>

        {/* Separador */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '22px 0 16px 0',
          gap: 12
        }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#B9CEC5' }} />
          <span style={{ fontSize: 15, color: '#49625D', fontWeight: 500 }}>
            O usá tu correo
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#B9CEC5' }} />
        </div>

        {/* Formulario */}
        <form onSubmit={handleEntrar} style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#153E3A',
            marginBottom: 6
          }}>
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@ejemplo.com"
            style={{
              width: '100%',
              minHeight: 58,
              padding: '14px 18px',
              borderRadius: 16,
              border: '2px solid #B9CEC5',
              backgroundColor: '#FFFFFF',
              fontSize: 16,
              color: '#153E3A',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />

          <label style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#153E3A',
            marginBottom: 6,
            marginTop: 14
          }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              minHeight: 58,
              padding: '14px 18px',
              borderRadius: 16,
              border: '2px solid #B9CEC5',
              backgroundColor: '#FFFFFF',
              fontSize: 16,
              color: '#153E3A',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />

          {/* Botón Entrar */}
          <button
            type="submit"
            style={{
              width: '100%',
              minHeight: 58,
              padding: '14px 20px',
              backgroundColor: 'transparent',
              color: '#07564F',
              border: '2px solid #07564F',
              borderRadius: 16,
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 18
            }}
          >
            Entrar
          </button>

          {/* Botón Crear cuenta nueva */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateToRoleSelection) {
                onNavigateToRoleSelection();
              } else {
                onGoogleLogin(currentRole);
              }
            }}
            style={{
              width: '100%',
              minHeight: 58,
              padding: '14px 20px',
              backgroundColor: 'transparent',
              color: '#07564F',
              border: '2px solid #07564F',
              borderRadius: 16,
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 10
            }}
          >
            Crear cuenta nueva
          </button>
        </form>
      </div>

      {/* Role Picker Helper Drawer for Quick Testing during Demo */}
      <div style={{
        marginTop: 14,
        padding: '8px 12px',
        backgroundColor: '#E6F1EC',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12.5,
        color: '#153E3A'
      }}>
        <span style={{ fontWeight: 600 }}>Demo: Continuar como</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => onGoogleLogin('roberto')}
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              background: currentRole === 'roberto' ? '#07564F' : '#FFFFFF',
              color: currentRole === 'roberto' ? '#FFFFFF' : '#07564F',
              border: '1px solid #07564F',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Roberto
          </button>
          <button
            type="button"
            onClick={() => onGoogleLogin('silvana')}
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              background: currentRole === 'silvana' ? '#07564F' : '#FFFFFF',
              color: currentRole === 'silvana' ? '#FFFFFF' : '#07564F',
              border: '1px solid #07564F',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Silvana
          </button>
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div style={{
        width: 120,
        height: 5,
        backgroundColor: '#153E3A',
        borderRadius: 999,
        margin: '14px auto 4px auto',
        flexShrink: 0
      }} />
    </div>
  );
};
