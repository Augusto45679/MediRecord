import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  MediRecordState,
  UserRole,
  MainTab,
  FontSizePreference,
  SpecialView,
  Medicine
} from '../types';
import { DEFAULT_STATE } from '../data/initialData';

interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'alert' | 'sound';
  text: string;
  subtext?: string;
}

interface MediRecordContextType {
  state: MediRecordState;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (text: string, type?: ToastMessage['type'], subtext?: string) => void;
  setRole: (role: UserRole) => void;
  setTab: (tab: MainTab) => void;
  setFontSize: (size: FontSizePreference) => void;
  setHighContrast: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setVoiceConfirmationEnabled: (enabled: boolean) => void;
  setSilvanaAlertWait: (minutes: number) => void;
  markDoseTaken: (doseId: string, customTime?: string) => void;
  markDoseOmitted: (doseId: string, reason: 'Me olvidé' | 'Me sentí mal' | 'Otro motivo') => void;
  markDoseUnconfirmed: (doseId: string) => void;
  postponeDose: (doseId: string, minutes?: number) => void;
  undoDoseStatus: (doseId: string) => void;
  attendNoticeSilvana: () => void;
  addMedicine: (med: Omit<Medicine, 'id'>) => void;
  togglePauseMedicine: (id: string) => void;
  deleteMedicine: (id: string) => void;
  toggleFamilyLink: (linked?: boolean) => void;
  setPendingInvitation: (pending: boolean) => void;
  acceptInvitation: () => void;
  rejectInvitation: () => void;
  setSpecialView: (view: SpecialView) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = 'medirecord_demo_state_v1';

const MediRecordContext = createContext<MediRecordContextType | undefined>(undefined);

export const MediRecordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MediRecordState>(() => {
    // Check URL parameters first for direct presentation links
    let initial = DEFAULT_STATE;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        initial = JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role') as UserRole | null;
      const urlTab = params.get('tab') as MainTab | null;
      const urlStatus = params.get('status');

      if (urlRole === 'roberto' || urlRole === 'silvana') {
        initial = { ...initial, currentRole: urlRole };
      }
      if (urlTab === 'hoy' || urlTab === 'medicinas' || urlTab === 'historial' || urlTab === 'ajustes') {
        initial = { ...initial, currentTab: urlTab };
      }
      if (urlStatus === 'taken' || urlStatus === 'omitted' || urlStatus === 'unconfirmed') {
        const updatedDoses = initial.todayDoses.map(d => {
          if (d.time === '14:00') {
            return {
              ...d,
              status: urlStatus as any,
              takenAt: urlStatus === 'taken' ? '14:02' : undefined,
              omittedAt: urlStatus === 'omitted' ? '14:05' : undefined,
              omissionReason: urlStatus === 'omitted' ? ('Me sentí mal' as const) : undefined
            };
          }
          return d;
        });
        initial = { ...initial, todayDoses: updatedDoses };
      }
    }

    return initial;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Save state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage error ignore
    }
  }, [state]);

  const showToast = (text: string, type: ToastMessage['type'] = 'info', subtext?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type, subtext }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setRole = (role: UserRole) => {
    setState(prev => ({ ...prev, currentRole: role, specialView: 'none' }));
    showToast(
      role === 'roberto' ? 'Modo Roberto (Paciente)' : 'Modo Silvana (Familiar)',
      'info',
      role === 'roberto' ? 'Visualizando experiencia de Roberto Gómez' : 'Visualizando acompañamiento de Silvana Gómez'
    );
  };

  const setSpecialView = (view: SpecialView) => {
    setState(prev => ({ ...prev, specialView: view }));
  };

  const setTab = (tab: MainTab) => {
    setState(prev => ({ ...prev, currentTab: tab }));
  };

  const setFontSize = (size: FontSizePreference) => {
    setState(prev => ({ ...prev, fontSize: size }));
  };

  const setHighContrast = (enabled: boolean) => {
    setState(prev => ({ ...prev, highContrast: enabled }));
  };

  const setSoundEnabled = (enabled: boolean) => {
    setState(prev => ({ ...prev, soundEnabled: enabled }));
  };

  const setVibrationEnabled = (enabled: boolean) => {
    setState(prev => ({ ...prev, vibrationEnabled: enabled }));
  };

  const setVoiceConfirmationEnabled = (enabled: boolean) => {
    setState(prev => ({ ...prev, voiceConfirmationEnabled: enabled }));
  };

  const setSilvanaAlertWait = (minutes: number) => {
    setState(prev => ({ ...prev, silvanaAlertWaitMinutes: minutes }));
    showToast('Preferencia actualizada', 'success', `Aviso configurado a los ${minutes} minutos.`);
  };

  const markDoseTaken = (doseId: string, customTime?: string) => {
    const timeNow = customTime || '14:02';
    setState(prev => {
      const updatedDoses = prev.todayDoses.map(d => {
        if (d.id === doseId) {
          return {
            ...d,
            status: 'taken' as const,
            takenAt: timeNow,
            postponedUntil: undefined,
            isDelayed: timeNow > '15:00'
          };
        }
        return d;
      });

      const dose = prev.todayDoses.find(d => d.id === doseId);
      const doseName = dose ? dose.medicineName : 'Medicina';

      // Update history
      const todayHistory = prev.history.find(h => h.isToday);
      const otherHistory = prev.history.filter(h => !h.isToday);

      const newRecord = {
        id: 'hist-' + doseId,
        medicineName: doseName,
        doseDescription: dose ? dose.doseDescription : '1 comprimido',
        time: dose ? dose.time : '14:00',
        status: 'taken' as const,
        note: `Registrada a las ${timeNow}`,
        registeredAt: timeNow
      };

      const updatedTodayRecords = todayHistory
        ? [
            ...todayHistory.records.filter(r => r.id !== 'hist-' + doseId),
            newRecord
          ].sort((a, b) => a.time.localeCompare(b.time))
        : [newRecord];

      return {
        ...prev,
        todayDoses: updatedDoses,
        noticeAttendedBySilvana: false,
        history: [
          {
            dateString: '2026-10-15',
            displayDate: 'Jueves 15 de octubre',
            isToday: true,
            records: updatedTodayRecords
          },
          ...otherHistory
        ]
      };
    });

    showToast('Toma registrada', 'success', `Registrada a las ${timeNow}. Silvana verá el aviso resuelto.`);
  };

  const markDoseOmitted = (doseId: string, reason: 'Me olvidé' | 'Me sentí mal' | 'Otro motivo') => {
    const timeNow = '14:05';
    setState(prev => {
      const updatedDoses = prev.todayDoses.map(d => {
        if (d.id === doseId) {
          return {
            ...d,
            status: 'omitted' as const,
            omittedAt: timeNow,
            omissionReason: reason,
            postponedUntil: undefined
          };
        }
        return d;
      });

      const dose = prev.todayDoses.find(d => d.id === doseId);
      const doseName = dose ? dose.medicineName : 'Medicina';

      // Update history
      const todayHistory = prev.history.find(h => h.isToday);
      const otherHistory = prev.history.filter(h => !h.isToday);

      const newRecord = {
        id: 'hist-' + doseId,
        medicineName: doseName,
        doseDescription: dose ? dose.doseDescription : '1 comprimido',
        time: dose ? dose.time : '14:00',
        status: 'omitted' as const,
        note: `No tomada: Lo indicó Roberto a las ${timeNow} (${reason})`,
        registeredAt: timeNow
      };

      const updatedTodayRecords = todayHistory
        ? [
            ...todayHistory.records.filter(r => r.id !== 'hist-' + doseId),
            newRecord
          ].sort((a, b) => a.time.localeCompare(b.time))
        : [newRecord];

      return {
        ...prev,
        todayDoses: updatedDoses,
        history: [
          {
            dateString: '2026-10-15',
            displayDate: 'Jueves 15 de octubre',
            isToday: true,
            records: updatedTodayRecords
          },
          ...otherHistory
        ]
      };
    });

    showToast('Aviso de omisión enviado', 'alert', `Quedó como no tomada. Silvana recibe un aviso con el motivo "${reason}".`);
  };

  const markDoseUnconfirmed = (doseId: string) => {
    setState(prev => {
      const updatedDoses = prev.todayDoses.map(d => {
        if (d.id === doseId) {
          return {
            ...d,
            status: 'unconfirmed' as const,
            takenAt: undefined,
            omittedAt: undefined,
            postponedUntil: undefined
          };
        }
        return d;
      });

      return {
        ...prev,
        todayDoses: updatedDoses,
        noticeAttendedBySilvana: false
      };
    });

    showToast(
      'Simulando 60 min sin confirmación',
      'alert',
      'La toma de las 14:00 no fue confirmada. Silvana recibe el aviso de omisión a las 15:00.'
    );
  };

  const postponeDose = (doseId: string, minutes: number = 10) => {
    const postponedTime = '14:10';
    setState(prev => {
      const updatedDoses = prev.todayDoses.map(d => {
        if (d.id === doseId) {
          return {
            ...d,
            postponedUntil: postponedTime
          };
        }
        return d;
      });
      return { ...prev, todayDoses: updatedDoses };
    });

    showToast(
      `Recordatorio postergado ${minutes} min`,
      'info',
      `Te volveremos a avisar a las ${postponedTime}. El plazo para avisar a Silvana no se reinicia.`
    );
  };

  const undoDoseStatus = (doseId: string) => {
    setState(prev => {
      const updatedDoses = prev.todayDoses.map(d => {
        if (d.id === doseId) {
          return {
            ...d,
            status: 'pending' as const,
            takenAt: undefined,
            omittedAt: undefined,
            omissionReason: undefined,
            postponedUntil: undefined
          };
        }
        return d;
      });

      const todayHistory = prev.history.find(h => h.isToday);
      const otherHistory = prev.history.filter(h => !h.isToday);

      const updatedTodayRecords = todayHistory
        ? todayHistory.records.filter(r => r.id !== 'hist-' + doseId)
        : [];

      return {
        ...prev,
        todayDoses: updatedDoses,
        history: [
          {
            dateString: '2026-10-15',
            displayDate: 'Jueves 15 de octubre',
            isToday: true,
            records: updatedTodayRecords
          },
          ...otherHistory
        ]
      };
    });

    showToast('Registro deshecho', 'info', 'La toma volvió al estado pendiente.');
  };

  const attendNoticeSilvana = () => {
    setState(prev => ({ ...prev, noticeAttendedBySilvana: true }));
    showToast(
      'Aviso atendido',
      'success',
      'Marcado como "Ya hablé con Roberto". La toma sigue sin confirmar: solo Roberto puede registrarla.'
    );
  };

  const addMedicine = (medData: Omit<Medicine, 'id'>) => {
    const id = 'med-' + Date.now();
    const newMed: Medicine = {
      ...medData,
      id
    };

    setState(prev => {
      // Add corresponding doses to today
      const newDoses = newMed.times.map((t, idx) => ({
        id: `dose-${id}-${idx}`,
        medicineId: id,
        medicineName: newMed.name,
        time: t,
        doseDescription: newMed.dose,
        status: 'pending' as const
      }));

      return {
        ...prev,
        medicines: [...prev.medicines, newMed],
        todayDoses: [...prev.todayDoses, ...newDoses].sort((a, b) => a.time.localeCompare(b.time))
      };
    });

    showToast('Medicina guardada', 'success', `${medData.name} se agregó al plan de Roberto.`);
  };

  const togglePauseMedicine = (id: string) => {
    setState(prev => {
      const med = prev.medicines.find(m => m.id === id);
      const nextStatus = med?.status === 'active' ? 'paused' : 'active';
      const updated = prev.medicines.map(m => {
        if (m.id === id) {
          return { ...m, status: nextStatus as 'active' | 'paused' };
        }
        return m;
      });

      return {
        ...prev,
        medicines: updated
      };
    });
  };

  const deleteMedicine = (id: string) => {
    setState(prev => {
      const updated = prev.medicines.filter(m => m.id !== id);
      const updatedDoses = prev.todayDoses.filter(d => d.medicineId !== id);

      return {
        ...prev,
        medicines: updated,
        todayDoses: updatedDoses
      };
    });

    showToast('Medicina eliminada', 'info', 'Se quitó de las medicinas de Roberto. El historial se conserva.');
  };

  const toggleFamilyLink = (linked?: boolean) => {
    setState(prev => ({
      ...prev,
      familyLinked: linked !== undefined ? linked : !prev.familyLinked,
      pendingInvitation: false,
      invitationRejected: false
    }));
  };

  const setPendingInvitation = (pending: boolean) => {
    setState(prev => ({
      ...prev,
      pendingInvitation: pending,
      invitationRejected: false
    }));
  };

  const acceptInvitation = () => {
    setState(prev => ({
      ...prev,
      familyLinked: true,
      pendingInvitation: false,
      invitationRejected: false
    }));
    showToast('¡Vínculo aceptado!', 'success', 'Silvana Gómez ahora es tu persona de apoyo con tu consentimiento.');
  };

  const rejectInvitation = () => {
    setState(prev => ({
      ...prev,
      familyLinked: false,
      pendingInvitation: false,
      invitationRejected: true
    }));
    showToast('Invitación rechazada', 'alert', 'Rechazaste la invitación de Silvana. Continuás sin persona de apoyo vinculada.');
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ ...DEFAULT_STATE, specialView: 'none' });
    showToast('Demo restablecida', 'info', 'Se han restablecido los valores y estados iniciales.');
  };

  return (
    <MediRecordContext.Provider
      value={{
        state,
        toasts,
        dismissToast,
        showToast,
        setRole,
        setTab,
        setFontSize,
        setHighContrast,
        setSoundEnabled,
        setVibrationEnabled,
        setVoiceConfirmationEnabled,
        setSilvanaAlertWait,
        markDoseTaken,
        markDoseOmitted,
        markDoseUnconfirmed,
        postponeDose,
        undoDoseStatus,
        attendNoticeSilvana,
        addMedicine,
        togglePauseMedicine,
        deleteMedicine,
        toggleFamilyLink,
        setPendingInvitation,
        acceptInvitation,
        rejectInvitation,
        setSpecialView,
        resetDemo
      }}
    >
      {children}
    </MediRecordContext.Provider>
  );
};

export const useMediRecord = () => {
  const context = useContext(MediRecordContext);
  if (!context) {
    throw new Error('useMediRecord must be used within a MediRecordProvider');
  }
  return context;
};
