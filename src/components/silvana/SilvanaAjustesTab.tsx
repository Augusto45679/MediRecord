import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { AccessibilitySettingsView } from '../common/AccessibilitySettingsView';
import {
  Bell,
  Eye,
  UserCheck,
  ChevronRight,
  ArrowLeft,
  Check,
  Volume2,
  Vibrate,
  LogOut,
  ShieldCheck,
  Copy,
  Share2,
  Send,
  CheckCircle2,
  ShieldAlert,
  Clock
} from 'lucide-react';

export const SilvanaAjustesTab: React.FC = () => {
  const {
    state,
    setSilvanaAlertWait,
    setSoundEnabled,
    setVibrationEnabled,
    setRole,
    setPendingInvitation,
    toggleFamilyLink,
    showToast
  } = useMediRecord();

  const [activeSubscreen, setActiveSubscreen] = useState<'main' | 'avisos' | 'vinculo' | 'codigo' | 'accesibilidad'>('main');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitationSent, setInvitationSent] = useState(false);

  const waitOptions = [
    { minutes: 30, label: '30 minutos', desc: 'Aviso rápido ante tomas críticas' },
    { minutes: 60, label: '60 minutos (Recomendado)', desc: 'Tiempo óptimo para dar margen a Roberto sin generar falsas alarmas' },
    { minutes: 90, label: '90 minutos', desc: 'Mayor margen de autonomía para Roberto' }
  ];

  // Subscreen: Avisos · Preferencias (H-11)
  if (activeSubscreen === 'avisos') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setActiveSubscreen('main')}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 24 }}>
            Avisos de omisión
          </h1>
          <div className="screen-subtitle">
            ¿Cuánto esperamos antes de avisarte?
          </div>
        </div>

        {/* Wait time selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {waitOptions.map(opt => {
            const isSelected = state.silvanaAlertWaitMinutes === opt.minutes;
            return (
              <button
                key={opt.minutes}
                onClick={() => setSilvanaAlertWait(opt.minutes)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--bg-mint)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>{opt.desc}</div>
                </div>
                {isSelected && <Check size={20} color="var(--color-primary)" />}
              </button>
            );
          })}
        </div>

        {/* Sound & vibration toggles */}
        <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Volume2 size={20} color="var(--color-primary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>
                  Sonido de aviso
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                  Alerta sonora ante una omisión
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={state.soundEnabled}
              onChange={e => setSoundEnabled(e.target.checked)}
              style={{ width: 22, height: 22, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Vibrate size={20} color="var(--color-primary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary-dark)' }}>
                  Vibración
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                  Patrón distintivo de aviso
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={state.vibrationEnabled}
              onChange={e => setVibrationEnabled(e.target.checked)}
              style={{ width: 22, height: 22, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Design rule note */}
        <div className="card-mint" style={{ fontSize: 13, color: 'var(--color-primary-dark)', lineHeight: 1.4 }}>
          <strong>Regla de MediRecord:</strong> Solo te avisamos ante una omisión. Si Roberto confirma tarde, se actualiza ese mismo aviso y queda resuelto automáticamente.
        </div>

        <button className="btn-primary" onClick={() => setActiveSubscreen('main')}>
          Guardar preferencias
        </button>
      </div>
    );
  }

  // Subscreen: Vínculo Familiar & Enviar Invitación
  if (activeSubscreen === 'vinculo' || activeSubscreen === 'codigo') {
    const handleCopy = () => {
      showToast('Código copiado', 'success', `El código ${state.familyCode} fue copiado al portapapeles.`);
    };

    const handleSendInvitation = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const targetEmail = inviteEmail.trim() || 'roberto.gomez@gmail.com';
      setPendingInvitation(true);
      setInvitationSent(true);
      showToast(
        '¡Invitación enviada!',
        'success',
        `Se envió la invitación a ${targetEmail}. Código: ${state.familyCode}`
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setActiveSubscreen('main')}>
            <ArrowLeft size={16} /> Volver a Ajustes
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 24 }}>
            {state.familyLinked ? 'Vínculo familiar' : 'Vincular a tu familiar'}
          </h1>
          <div className="screen-subtitle">
            {state.familyLinked
              ? 'Consentimiento y acompañamiento activo'
              : 'Enviá una invitación para comenzar el acompañamiento'}
          </div>
        </div>

        {/* SI YA ESTÁ VINCULADO */}
        {state.familyLinked ? (
          <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  Roberto Gómez
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={14} /> Consentimiento activo
                </div>
              </div>
            </div>

            <div style={{ fontSize: 13.5, color: 'var(--color-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-mint)', paddingTop: 12 }}>
              Roberto te otorgó permiso para cargar sus medicinas y horarios. Solo recibís avisos ante omisiones críticas.
              <br /><br />
              Código utilizado: <strong style={{ color: 'var(--color-primary-dark)', letterSpacing: 1 }}>{state.familyCode}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <button
                className="btn-soft"
                onClick={handleCopy}
              >
                <Copy size={16} /> Copiar código de vinculación ({state.familyCode})
              </button>

              <button
                className="btn-danger-outline"
                onClick={() => {
                  toggleFamilyLink(false);
                  setInvitationSent(false);
                  showToast('Familiar desvinculado', 'info', 'Se retiró el vínculo. Podés enviar una nueva invitación.');
                }}
              >
                <ShieldAlert size={16} /> Desvincular familiar
              </button>
            </div>
          </div>
        ) : (
          /* SI NO ESTÁ VINCULADO: FLUJO GENÉRICO DE INVITACIÓN */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Formulario de Envío de Invitación */}
            <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-mint)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Send size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    Enviar invitación por correo
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-muted)' }}>
                    Ingresá el mail de la persona que querés acompañar
                  </div>
                </div>
              </div>

              <form onSubmit={handleSendInvitation} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="ejemplo: roberto.gomez@gmail.com"
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: 14,
                    border: '1.5px solid #C4D6CD',
                    backgroundColor: '#FFFFFF',
                    fontSize: 15,
                    color: '#153E3A',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />

                {!inviteEmail && (
                  <button
                    type="button"
                    onClick={() => setInviteEmail('roberto.gomez@gmail.com')}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary)',
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    Sugerencia: roberto.gomez@gmail.com
                  </button>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ marginTop: 4 }}
                >
                  <Send size={16} /> Enviar invitación
                </button>
              </form>
            </div>

            {/* Aviso de Invitación pendiente */}
            {(state.pendingInvitation || invitationSent) && (
              <div className="card-amber" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Clock size={20} color="var(--alert-amber-text)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--alert-amber-text)' }}>
                  <strong>Invitación enviada:</strong> Se notificó a {inviteEmail || 'roberto.gomez@gmail.com'}. En cuanto ingrese el código en su app o responda la invitación, quedarán vinculados de inmediato.
                </div>
              </div>
            )}

            {/* Tarjeta con Código de Vinculación */}
            <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, padding: '22px 16px' }}>
              <div style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                color: 'var(--color-primary)',
                fontWeight: 800
              }}>
                Código de vinculación directa
              </div>

              <div style={{
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: 6,
                color: 'var(--color-primary-dark)',
                fontFamily: 'monospace',
                background: '#FFFFFF',
                padding: '8px 24px',
                borderRadius: 14,
                border: '1.5px solid var(--border-mint)'
              }}>
                {state.familyCode}
              </div>

              <div style={{ fontSize: 13.5, color: 'var(--color-muted)', lineHeight: 1.45, maxWidth: 320 }}>
                Tu familiar puede ingresar este código en la sección <strong>«Mi persona de apoyo»</strong> dentro de sus Ajustes para autorizar tu acompañamiento.
              </div>

              <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 6, flexWrap: 'wrap' }}>
                <button
                  className="btn-primary"
                  onClick={handleCopy}
                  style={{ flex: 1, minHeight: 46, fontSize: 14 }}
                >
                  <Copy size={16} /> Copiar código
                </button>

                <button
                  className="btn-soft"
                  onClick={() => {
                    showToast('Enlace enviado', 'info', `Se compartió la invitación con el código ${state.familyCode}.`);
                  }}
                  style={{ flex: 1, minHeight: 46, fontSize: 14 }}
                >
                  <Share2 size={16} /> Compartir
                </button>
              </div>
            </div>

            <div style={{
              fontSize: 12,
              color: 'var(--color-muted-light)',
              textAlign: 'center',
              lineHeight: 1.4,
              padding: '0 10px'
            }}>
              Por seguridad y respeto a la autonomía, la vinculación siempre requiere el consentimiento explícito de la persona que toma las medicinas.
            </div>
          </div>
        )}
      </div>
    );
  }

  // Subscreen: Accesibilidad
  if (activeSubscreen === 'accesibilidad') {
    return <AccessibilitySettingsView onBack={() => setActiveSubscreen('main')} />;
  }

  // Main Silvana Menu (H-10)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)', marginBottom: 2 }}>
          Ajustes
        </h1>
        <div className="screen-subtitle">
          Configuración de familiar cuidador
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Único botón de Vínculo e Invitación en Ajustes */}
        <div
          className="card-white"
          onClick={() => setActiveSubscreen('vinculo')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <UserCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Vínculo familiar
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                {state.familyLinked
                  ? 'Vinculado con Roberto Gómez (Consentimiento activo)'
                  : state.pendingInvitation
                  ? `Invitación enviada · Código: ${state.familyCode}`
                  : 'Sin vincular · Enviá una invitación a tu familiar'}
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--color-muted-light)" />
        </div>

        {/* Option 2: Avisos · Preferencias */}
        <div
          className="card-white"
          onClick={() => setActiveSubscreen('avisos')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bell size={20} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Avisos · Preferencias
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                Avisar a los {state.silvanaAlertWaitMinutes} min
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--color-muted-light)" />
        </div>

        {/* Option 4: Accesibilidad */}
        <div
          className="card-white"
          onClick={() => setActiveSubscreen('accesibilidad')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-mint)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Eye size={20} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Accesibilidad
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                {state.fontSize === 'normal' ? 'Letra normal' : state.fontSize === 'large' ? 'Letra grande' : 'Letra muy grande'}
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--color-muted-light)" />
        </div>
      </div>

      {/* Switch role */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
        <button
          className="btn-soft"
          onClick={() => setRole('roberto')}
        >
          <LogOut size={16} /> Cambiar al modo de Roberto (Paciente)
        </button>
      </div>
    </div>
  );
};
