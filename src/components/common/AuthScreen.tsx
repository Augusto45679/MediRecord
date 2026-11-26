import React, { useState } from 'react';
import { Pill } from 'lucide-react';
import type { ApiRole } from '../../types';

export interface RegisterData {
  username: string;
  password: string;
  displayName: string;
  role: ApiRole;
}

export interface AuthScreenProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onRegister: (data: RegisterData) => Promise<void>;
}

const inputStyle: React.CSSProperties = {
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
};

const labelStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: '#153E3A',
  marginBottom: 6,
  marginTop: 14
};

const primaryBtn: React.CSSProperties = {
  width: '100%',
  minHeight: 64,
  padding: '14px 20px',
  backgroundColor: '#07564F',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: 16,
  fontSize: 18,
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: 20
};

const secondaryBtn: React.CSSProperties = {
  width: '100%',
  minHeight: 54,
  padding: '12px 20px',
  backgroundColor: 'transparent',
  color: '#07564F',
  border: '2px solid #07564F',
  borderRadius: 16,
  fontSize: 17,
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: 10
};

const ROLE_OPTIONS: { role: ApiRole; title: string; desc: string }[] = [
  { role: 'patient', title: 'Voy a tomar mis medicinas', desc: 'Recordatorios y registro de tus tomas.' },
  { role: 'caregiver', title: 'Acompaño a alguien', desc: 'Ves sus tomas y te avisamos si hay demoras.' }
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<ApiRole>('patient');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      if (isRegister) {
        await onRegister({ username: username.trim(), password, displayName: displayName.trim(), role });
      } else {
        await onLogin(username.trim(), password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal. Intentá de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#FCFAF5',
      padding: '24px 24px 16px 24px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          backgroundColor: '#E6F1EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Pill size={44} color="#07564F" strokeWidth={2.4} />
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#07564F', margin: '16px 0 4px 0', letterSpacing: -0.6 }}>
          MediRecord
        </h1>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#153E3A', textAlign: 'center', marginBottom: 6 }}>
          {isRegister ? 'Creá tu cuenta' : 'Tus medicinas, a tu ritmo.'}
        </div>
        <p style={{ fontSize: 16, color: '#49625D', textAlign: 'center', lineHeight: 1.4, margin: '0 auto 8px auto', maxWidth: 340 }}>
          {isRegister
            ? 'Elegí un nombre de usuario y una contraseña que puedas recordar.'
            : 'Entrá con tu usuario y contraseña.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        {isRegister && (
          <>
            <label style={labelStyle} htmlFor="auth-name">¿Cómo te llamás?</label>
            <input
              id="auth-name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              autoComplete="name"
              required
              maxLength={60}
              style={inputStyle}
            />
          </>
        )}

        <label style={labelStyle} htmlFor="auth-user">Usuario</label>
        <input
          id="auth-user"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="por ejemplo: ana.gomez"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          required
          minLength={3}
          maxLength={30}
          style={inputStyle}
        />

        <label style={labelStyle} htmlFor="auth-pass">Contraseña</label>
        <input
          id="auth-pass"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={isRegister ? 'Mínimo 6 caracteres' : '••••••••'}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          required
          minLength={isRegister ? 6 : undefined}
          style={inputStyle}
        />

        {isRegister && (
          <fieldset style={{ border: 'none', padding: 0, margin: '16px 0 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <legend style={{ ...labelStyle, marginTop: 0, padding: 0 }}>¿Cómo vas a usar MediRecord?</legend>
            {ROLE_OPTIONS.map(opt => {
              const selected = role === opt.role;
              return (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => setRole(opt.role)}
                  aria-pressed={selected}
                  style={{
                    textAlign: 'left',
                    padding: '14px 16px',
                    borderRadius: 16,
                    border: `2px solid ${selected ? '#07564F' : '#B9CEC5'}`,
                    backgroundColor: selected ? '#E6F1EC' : '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#153E3A' }}>{opt.title}</div>
                  <div style={{ fontSize: 14, color: '#49625D', marginTop: 2 }}>{opt.desc}</div>
                </button>
              );
            })}
          </fieldset>
        )}

        {error && (
          <div role="alert" style={{
            marginTop: 14,
            padding: '12px 14px',
            borderRadius: 12,
            backgroundColor: 'var(--alert-red-bg, #FDECEC)',
            color: 'var(--alert-red-text, #9B1C1C)',
            fontSize: 15,
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.7 : 1 }}>
          {busy ? 'Un momento…' : isRegister ? 'Crear cuenta' : 'Entrar'}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(isRegister ? 'login' : 'register');
            setError(null);
          }}
          style={secondaryBtn}
        >
          {isRegister ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}
        </button>
      </form>
    </div>
  );
};
