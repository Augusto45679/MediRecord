import React, { useCallback, useEffect, useState } from 'react';
import { AlarmClock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useMediRecord } from '../../context/MediRecordContext';
import { alarmStatus, isNativeApp, openAlarmSettings, testAlarm } from '../../native/alarms';
import type { AlarmSetting, AlarmStatus } from '../../native/alarms';

const CHECKS: { key: keyof AlarmStatus; setting: AlarmSetting; ok: string; fix: string; hint: string }[] = [
  { key: 'notifications', setting: 'notifications', ok: 'Avisos permitidos', fix: 'Permitir avisos', hint: 'Sin esto la alarma no aparece.' },
  { key: 'exactAlarms', setting: 'exactAlarms', ok: 'Suena a la hora justa', fix: 'Permitir alarmas exactas', hint: 'Sin esto puede sonar unos minutos tarde.' },
  { key: 'fullScreen', setting: 'fullScreen', ok: 'Se muestra con el teléfono bloqueado', fix: 'Permitir pantalla completa', hint: 'Sin esto solo aparece arriba, como un mensaje.' },
  { key: 'batteryUnrestricted', setting: 'battery', ok: 'Sin límite de batería', fix: 'Quitar límite de batería', hint: 'Algunos teléfonos frenan las alarmas para ahorrar batería.' },
];

/** Estado de los permisos que hacen sonar la alarma, con acceso directo a cada ajuste. Solo en Android. */
export const AlarmSetupCard: React.FC = () => {
  const { state, setVibrationEnabled, showToast } = useMediRecord();
  const [status, setStatus] = useState<AlarmStatus | null>(null);

  const reload = useCallback(() => {
    alarmStatus().then(setStatus).catch(() => setStatus(null));
  }, []);

  useEffect(() => {
    reload();
    // Al volver de los ajustes del sistema, se actualiza el estado.
    const onVisible = () => document.visibilityState === 'visible' && reload();
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [reload]);

  if (!isNativeApp()) return null;

  const handleTest = async () => {
    await testAlarm(5);
    showToast('Alarma de prueba', 'info', 'Va a sonar en 5 segundos. Podés bloquear el teléfono para ver cómo aparece.');
  };

  return (
    <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <AlarmClock size={22} color="var(--color-primary)" />
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-primary-dark)' }}>Alarma de las tomas</div>
      </div>
      <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.4 }}>
        Suena como un despertador hasta que respondas, aunque el teléfono esté en silencio o bloqueado.
      </div>

      {status &&
        CHECKS.map(c =>
          status[c.key] ? (
            <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: 'var(--color-primary-dark)' }}>
              <CheckCircle2 size={18} color="var(--color-primary)" /> {c.ok}
            </div>
          ) : (
            <div key={c.key} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, borderRadius: 12, background: '#FFF6E5', border: '1px solid #F2D49B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#7A4B00' }}>
                <AlertTriangle size={18} /> {c.hint}
              </div>
              <button className="btn-outline" onClick={() => openAlarmSettings(c.setting)}>
                {c.fix}
              </button>
            </div>
          )
        )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label htmlFor="alarm-vibration" style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-primary-dark)' }}>
          Vibrar
        </label>
        <input
          id="alarm-vibration"
          type="checkbox"
          checked={state.vibrationEnabled}
          onChange={e => setVibrationEnabled(e.target.checked)}
          style={{ width: 22, height: 22, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
        />
      </div>

      <button className="btn-primary" onClick={handleTest}>
        <AlarmClock size={18} /> Probar la alarma
      </button>
    </div>
  );
};
