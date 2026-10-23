import React from 'react';
import { Pill, Check } from 'lucide-react';
import type { UserRole } from '../../types';

export interface LoginGoogleConfirmScreenProps {
  role: UserRole;
  onConfirmAccount: (role: UserRole) => void;
  onChooseOtherAccount: () => void;
  onSwitchRole?: (role: UserRole) => void;
}

export const LoginGoogleConfirmScreen: React.FC<LoginGoogleConfirmScreenProps> = ({
  role,
  onConfirmAccount,
  onChooseOtherAccount,
  onSwitchRole
}) => {
  const isRoberto = role === 'roberto';
  const userName = isRoberto ? 'Roberto Gómez' : 'Silvana Gomez';
  const userEmail = isRoberto ? 'roberto.gomez@gmail.com' : 'Silvana.gomez@gmail.com';
  const screenJourneyCode = isRoberto ? 'A-02 · Crear cuenta con Google' : 'S-02 · Crear cuenta con Google';

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
        {/* Journey Indicator Header */}
        <div style={{
          fontSize: 14,
          fontWeight: 800,
          color: '#07564F',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{screenJourneyCode}</span>
          {onSwitchRole && (
            <button
              onClick={() => onSwitchRole(isRoberto ? 'silvana' : 'roberto')}
              style={{
                fontSize: 12,
                padding: '3px 10px',
                borderRadius: 8,
                border: '1.5px solid #07564F',
                background: '#FFFFFF',
                color: '#07564F',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Ver {isRoberto ? 'Silvana' : 'Roberto'}
            </button>
          )}
        </div>

        {/* Status Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 14,
          fontWeight: 700,
          color: '#153E3A',
          marginBottom: 18
        }}>
          <span>9:01</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="17" height="12" viewBox="0 0 18 12" fill="none">
              <rect x="0" y="8" width="2.5" height="4" rx="0.8" fill="#153E3A" />
              <rect x="5" y="5.5" width="2.5" height="6.5" rx="0.8" fill="#153E3A" />
              <rect x="10" y="3" width="2.5" height="9" rx="0.8" fill="#153E3A" />
              <rect x="15" y="0.5" width="2.5" height="11.5" rx="0.8" fill="#153E3A" />
            </svg>
            <svg width="17" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="#153E3A" />
              <path d="M4.5 7.5c1.9-1.8 5.1-1.8 7 0" stroke="#153E3A" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M2 4.5c3.3-3.1 8.7-3.1 12 0" stroke="#153E3A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
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

        {/* Brand Header: Pill + MediRecord (Natural diagonal angle, no extra rotation) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: '#07564F',
          marginBottom: 16
        }}>
          <Pill size={26} color="#07564F" strokeWidth={2.4} />
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>
            MediRecord
          </span>
        </div>

        {/* Screen Title */}
        <h1 style={{
          fontSize: 32,
          fontWeight: 800,
          color: '#153E3A',
          letterSpacing: -0.6,
          margin: '0 0 20px 0',
          lineHeight: 1.15
        }}>
          Cuenta nueva
        </h1>

        {/* Verified Google Account Card (Plano, sin bordes de línea, sin sombras) */}
        <div style={{
          backgroundColor: '#E6F1EC',
          borderRadius: 20,
          padding: '22px 20px 24px 20px',
          border: 'none'
        }}>
          {/* Google Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{
                color: '#4285F4',
                fontWeight: 800,
                fontSize: 20,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                G
              </span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#153E3A' }}>
              Cuenta de Google
            </span>
          </div>

          {/* User Name */}
          <div style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#153E3A',
            letterSpacing: -0.4,
            marginTop: 16
          }}>
            {userName}
          </div>

          {/* User Email */}
          <div style={{
            fontSize: 16,
            color: '#49625D',
            marginTop: 4,
            fontWeight: 400
          }}>
            {userEmail}
          </div>

          {/* Verified Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
            color: '#07564F',
            fontWeight: 700,
            fontSize: 16
          }}>
            <Check size={18} strokeWidth={3} color="#07564F" />
            <span>Cuenta verificada</span>
          </div>
        </div>

        {/* Privacy Note */}
        <p style={{
          fontSize: 17,
          color: '#153E3A',
          lineHeight: 1.45,
          margin: '22px 0 24px 0',
          fontWeight: 400
        }}>
          Usaremos tu cuenta de Google solo para identificarte. No publicamos nada ni accedemos a tu correo.
        </p>

        {/* Primary Action Button (68px altura, plano, sin sombras) */}
        <button
          onClick={() => onConfirmAccount(role)}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            cursor: 'pointer'
          }}
        >
          <Check size={22} strokeWidth={3} />
          <span>Usar esta cuenta</span>
        </button>

        {/* Secondary Action Button (68px altura, fondo transparente, borde 2px) */}
        <button
          onClick={onChooseOtherAccount}
          style={{
            width: '100%',
            minHeight: 68,
            padding: '16px 20px',
            backgroundColor: 'transparent',
            color: '#07564F',
            border: '2px solid #07564F',
            borderRadius: 16,
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: 12,
            textAlign: 'center'
          }}
        >
          Elegir otra cuenta
        </button>
      </div>

      {/* Bottom Home Indicator */}
      <div style={{
        width: 120,
        height: 5,
        backgroundColor: '#153E3A',
        borderRadius: 999,
        margin: '16px auto 4px auto',
        flexShrink: 0
      }} />
    </div>
  );
};
