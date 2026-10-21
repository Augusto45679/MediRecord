import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import type { Medicine } from '../../types';
import { ArrowLeft, ChevronRight, MessageSquare, Pill } from 'lucide-react';

export const RobertoMedicinasTab: React.FC = () => {
  const { state, showToast } = useMediRecord();
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);

  const handleNotifySilvana = (medName: string) => {
    showToast(
      'Mensaje enviado a Silvana',
      'info',
      `Le avisamos a Silvana que revises ${medName}.`
    );
  };

  // If viewing details of a medicine (Screen H-02)
  if (selectedMed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setSelectedMed(null)}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 26 }}>
            {selectedMed.name}
          </h1>
          <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Detalles de tu medicina
          </div>
        </div>

        <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-primary)', fontWeight: 700 }}>
              Dosis indicada
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary-dark)', marginTop: 2 }}>
              {selectedMed.dose}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 600 }}>
              Frecuencia
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-primary-dark)', marginTop: 2 }}>
              {selectedMed.frequency}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 600 }}>
              Horarios
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {selectedMed.times.map(t => (
                <span
                  key={t}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 999,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-mint)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--color-primary)'
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-mint)', paddingTop: 10, fontSize: 13, color: 'var(--color-muted)' }}>
            La cargó {selectedMed.addedBy}
          </div>
        </div>

        <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.4 }}>
            Si sentís molestias, cambios de dosis o algo no está bien, avisale a Silvana para que revise las indicaciones con tu médico.
          </div>
          <button
            className="btn-soft"
            onClick={() => handleNotifySilvana(selectedMed.name)}
          >
            <MessageSquare size={16} /> Avisarle a Silvana
          </button>
        </div>
      </div>
    );
  }

  // List View (Screen H-01)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)' }}>
          Tus medicinas
        </h1>
        <div className="screen-subtitle">
          Las cargó Silvana. Elegí una para ver los detalles.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state.medicines.map(med => (
          <div
            key={med.id}
            className="card-white"
            onClick={() => setSelectedMed(med)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease',
              padding: '18px 20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'var(--bg-mint)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2
              }}>
                <Pill size={20} />
              </div>

              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  {med.name}
                </div>
                <div style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 2 }}>
                  {med.concentration} · {med.amount}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600, marginTop: 4 }}>
                  {med.frequency} · {med.times.join(' y ')}
                </div>
              </div>
            </div>

            <ChevronRight size={20} color="var(--color-muted-light)" />
          </div>
        ))}
      </div>

      <div className="card-mint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
        <div style={{ fontSize: 13, color: 'var(--color-primary-dark)', lineHeight: 1.35, maxWidth: '75%' }}>
          ¿Alguna medicina no coincide con tus recetas?
        </div>
        <button
          className="btn-soft"
          onClick={() => handleNotifySilvana('tus medicinas')}
          style={{ width: 'auto', padding: '8px 14px', fontSize: 12 }}
        >
          Avisar
        </button>
      </div>
    </div>
  );
};
