import React, { useState } from 'react';
import {
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Type
} from 'lucide-react';

interface FamilyLinkWalkthroughModalProps {
  onClose: () => void;
}

export const FamilyLinkWalkthroughModal: React.FC<FamilyLinkWalkthroughModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '90%' }}>
        <div className="drag-handle" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>
            Recorrido de Vinculación Familiar (Paso {step} de 4)
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-muted)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: Silvana sends invite (F-04) */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              width: 'fit-content'
            }}>
              <span>Vista de Silvana (F-04)</span>
            </div>

            <h2 className="screen-title" style={{ fontSize: 22 }}>
              Invitar a tu familiar
            </h2>

            <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.4 }}>
              Acompañá el tratamiento de tu familiar con su permiso. Tu familiar recibirá una notificación.
            </div>

            <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 4 }}>
                  Nombre de tu familiar
                </label>
                <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#F8FAF8', border: '1px solid var(--border-subtle)', fontWeight: 600 }}>
                  Roberto Gómez
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 4 }}>
                  Correo o teléfono
                </label>
                <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#F8FAF8', border: '1px solid var(--border-subtle)' }}>
                  roberto.gomez@gmail.com
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: '12px', background: 'var(--bg-mint)', color: 'var(--color-primary-dark)' }}>
                <KeyRound size={18} color="var(--color-primary)" />
                <span style={{ fontSize: 13, fontWeight: 700 }}>
                  Código generado: 482 716
                </span>
              </div>
            </div>

            <button className="btn-primary" onClick={() => setStep(2)}>
              Enviar invitación <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: Silvana waiting for consent (F-05) */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              width: 'fit-content'
            }}>
              <span>Vista de Silvana (F-05)</span>
            </div>

            <h2 className="screen-title" style={{ fontSize: 22 }}>
              Invitación enviada
            </h2>

            <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Roberto Gómez
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                roberto.gomez@gmail.com
              </div>

              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#FFF8E6',
                border: '1px solid #F2DEC0',
                color: '#76500E',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                ⏳ Esperando su permiso · Código: 482 716
              </div>

              <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4 }}>
                No podés acceder a sus datos hasta que dé su consentimiento. Roberto recibirá una notificación.
              </div>
            </div>

            <button className="btn-primary" onClick={() => setStep(3)}>
              Ver qué recibe Roberto <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 3: Roberto receives & reviews invite (B-01) */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#DCECE5',
              color: 'var(--color-primary-dark)',
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              width: 'fit-content'
            }}>
              <span>Vista de Roberto (B-01)</span>
            </div>

            <h2 className="screen-title" style={{ fontSize: 22 }}>
              Elegí tu apoyo
            </h2>

            <div style={{ fontSize: 15, color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              Roberto, recibiste una invitación de tu hija Silvana Gómez.
            </div>

            <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Silvana Gómez · Código: 482 716
              </div>

              <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4 }}>
                Si aceptás, Silvana podrá ver tus medicinas, horarios y registros, y ayudarte a configurarlos.
                <br /><br />
                <strong>Solo recibe avisos si no confirmás una toma</strong> o si indicás que no la tomaste. Podés retirar este permiso en cualquier momento desde Ajustes.
              </div>
            </div>

            <button className="btn-primary" onClick={() => setStep(4)}>
              <CheckCircle2 size={18} /> Sí, vincular a Silvana
            </button>
          </div>
        )}

        {/* STEP 4: Link confirmed and accessibility setup (B-02, L-02) */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              width: 'fit-content'
            }}>
              <span>¡Vínculo Confirmado! (B-02 / L-02)</span>
            </div>

            <h2 className="screen-title" style={{ fontSize: 22 }}>
              ¡Ya están vinculados!
            </h2>

            <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', fontWeight: 700 }}>
                <CheckCircle2 size={20} />
                <span>Silvana Gómez · Vinculada con tu permiso</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4 }}>
                Silvana ya puede ayudarte a cargar tus recetas. Antes de comenzar tus recordatorios diarios, MediRecord te permite elegir el tamaño de letra óptimo para tu vista.
              </div>
            </div>

            <div className="card-white" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Type size={22} color="var(--color-primary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>
                  Tamaño de letra: Grande
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                  Letra clara aplicada automáticamente
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={onClose}>
              Finalizar recorrido y explorar la demo
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 13,
                fontWeight: 600
              }}
            >
              <ArrowLeft size={14} /> Paso anterior
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-muted)',
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            Cerrar recorrido
          </button>
        </div>
      </div>
    </div>
  );
};
