import React from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import type { FontSizePreference } from '../../types';
import { ArrowLeft, Check } from 'lucide-react';

interface AccessibilitySettingsViewProps {
  onBack: () => void;
}

export const AccessibilitySettingsView: React.FC<AccessibilitySettingsViewProps> = ({ onBack }) => {
  const { state, setFontSize, setHighContrast, showToast } = useMediRecord();

  const fontSizes: { id: FontSizePreference; label: string; desc: string }[] = [
    { id: 'normal', label: 'Normal', desc: 'Tamaño estándar para textos' },
    { id: 'large', label: 'Grande (Recomendado)', desc: 'Letra más clara y cómoda para leer' },
    { id: 'xlarge', label: 'Muy grande', desc: 'Máxima legibilidad y contraste alto' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} /> Volver
        </button>
      </div>

      <div>
        <h1 className="screen-title" style={{ fontSize: 24, marginBottom: 4 }}>
          Accesibilidad
        </h1>
        <div className="screen-subtitle">
          Personalizá cómo ves la aplicación
        </div>
      </div>

      {/* Selector de tamaño de letra */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
          Tamaño de letra
        </div>

        {fontSizes.map(f => {
          const isSelected = state.fontSize === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFontSize(f.id)}
              style={{
                padding: '16px 18px',
                borderRadius: '16px',
                border: isSelected ? '2.5px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? 'var(--bg-mint)' : 'var(--bg-card)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                minHeight: 64
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  {f.label}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.4 }}>
                  {f.desc}
                </div>
              </div>
              {isSelected && <Check size={22} color="var(--color-primary)" style={{ flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>

      {/* Alto contraste */}
      <div
        className="card-white"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          padding: '16px 20px'
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>
            Alto contraste
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.4 }}>
            Colores más oscuros y bordes más definidos
          </div>
        </div>
        <input
          type="checkbox"
          checked={state.highContrast}
          onChange={e => setHighContrast(e.target.checked)}
          style={{ width: 22, height: 22, accentColor: 'var(--color-primary)', cursor: 'pointer', flexShrink: 0 }}
        />
      </div>

      <button
        className="btn-primary"
        onClick={() => {
          showToast('Preferencias guardadas', 'success', 'Tu configuración de accesibilidad fue actualizada.');
          onBack();
        }}
      >
        Guardar preferencias
      </button>
    </div>
  );
};
