import React, { useState } from 'react';
import { Pill } from 'lucide-react';

/** Primera pantalla de la app sin conexión: solo pide el nombre. Sin cuenta ni contraseña. */
export const OfflineWelcome: React.FC<{ onStart: (displayName: string) => Promise<void> }> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError('');
    try {
      await onStart(name.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal. Intentá de nuevo.');
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            backgroundColor: '#E3F1EC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Pill size={44} color="#07564F" strokeWidth={2.4} />
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#07564F', margin: '16px 0 4px 0' }}>MediRecord</h1>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#153E3A', textAlign: 'center' }}>Tus medicinas, a tu ritmo.</div>
        <p style={{ fontSize: 16, color: '#49625D', textAlign: 'center', lineHeight: 1.4, maxWidth: 340 }}>
          No hace falta cuenta ni internet. Todo queda guardado en este teléfono y te avisamos a la hora de cada toma.
        </p>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label htmlFor="offline-name" style={{ fontSize: 16, fontWeight: 700, color: '#153E3A' }}>
          ¿Cómo te llamás?
        </label>
        <input
          id="offline-name"
          type="text"
          autoComplete="given-name"
          value={name}
          maxLength={40}
          onChange={e => setName(e.target.value)}
          placeholder="Tu nombre"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            border: '1.5px solid var(--border-mint)',
            fontSize: 18,
            fontFamily: 'inherit'
          }}
        />
        {error && (
          <div role="alert" style={{ color: '#8A2A1F', fontSize: 15 }}>
            {error}
          </div>
        )}
        <button type="submit" className="btn-primary" disabled={!name.trim() || busy} style={{ opacity: name.trim() && !busy ? 1 : 0.5 }}>
          Empezar
        </button>
      </form>
    </div>
  );
};
