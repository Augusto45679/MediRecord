import React from 'react';
import { useMediRecord } from '../context/MediRecordContext';
import { Bell, CheckCircle2, AlertTriangle, Volume2, X } from 'lucide-react';

export const ToastList: React.FC = () => {
  const { toasts, dismissToast } = useMediRecord();

  if (toasts.length === 0) return null;

  return (
    <div className="phone-toast-container">
      {toasts.map(toast => {
        let Icon = Bell;
        let className = 'phone-toast';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          className += ' success';
        } else if (toast.type === 'alert') {
          Icon = AlertTriangle;
          className += ' alert';
        } else if (toast.type === 'sound') {
          Icon = Volume2;
        }

        return (
          <div key={toast.id} className={className}>
            <Icon size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: toast.subtext ? 2 : 0 }}>
                {toast.text}
              </div>
              {toast.subtext && (
                <div style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.35 }}>
                  {toast.subtext}
                </div>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                opacity: 0.7,
                cursor: 'pointer',
                padding: 2
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
