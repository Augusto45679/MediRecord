import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type {
  ApiUser,
  DayDoses,
  DoseRecord,
  FontSizePreference,
  LinkInfo,
  MainTab,
  MediRecordState,
  Medicine,
  OmissionReason,
  SpecialView
} from '../types';
import { api, ApiError, getToken, setOnUnauthorized, setToken } from '../api/client';
import type { RegisterData } from '../components/common/AuthScreen';

interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'alert' | 'sound';
  text: string;
  subtext?: string;
}

type MedicineInput = Omit<Medicine, 'id' | 'frequency' | 'addedBy' | 'status'> &
  Partial<Pick<Medicine, 'frequency' | 'addedBy' | 'status'>>;

interface MediRecordContextType {
  state: MediRecordState;
  isAuthenticated: boolean;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (text: string, type?: ToastMessage['type'], subtext?: string) => void;
  setTab: (tab: MainTab) => void;
  setSpecialView: (view: SpecialView) => void;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  setFontSize: (size: FontSizePreference) => Promise<void>;
  setHighContrast: (enabled: boolean) => Promise<void>;
  setSoundEnabled: (enabled: boolean) => Promise<void>;
  setVibrationEnabled: (enabled: boolean) => Promise<void>;
  setVoiceConfirmationEnabled: (enabled: boolean) => Promise<void>;
  setSilvanaAlertWait: (minutes: number) => Promise<void>;
  markDoseTaken: (doseId: string) => Promise<void>;
  markDoseOmitted: (doseId: string, reason: OmissionReason) => Promise<void>;
  postponeDose: (doseId: string, minutes?: number) => Promise<void>;
  undoDoseStatus: (doseId: string) => Promise<void>;
  attendNotice: (doseId: string) => Promise<void>;
  addMedicine: (med: MedicineInput) => Promise<void>;
  updateMedicine: (id: string, updated: Partial<MedicineInput>) => Promise<void>;
  togglePauseMedicine: (id: string) => Promise<void>;
  deleteMedicine: (id: string) => Promise<void>;
  inviteByCode: (code: string) => Promise<void>;
  acceptInvitation: () => Promise<void>;
  rejectInvitation: () => Promise<void>;
  unlink: () => Promise<void>;
}

const NO_LINK: LinkInfo = { status: 'none', otherDisplayName: null, otherUsername: null };
const REFRESH_MS = 60_000;

function localIsoDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const EMPTY_STATE: MediRecordState = {
  user: null,
  link: NO_LINK,
  loading: false,
  currentRole: 'roberto',
  currentTab: 'hoy',
  specialView: 'none',
  fontSize: 'large',
  highContrast: false,
  soundEnabled: true,
  vibrationEnabled: true,
  voiceConfirmationEnabled: true,
  silvanaAlertWaitMinutes: 60,
  medicines: [],
  todayDate: localIsoDate(),
  todayDoses: [],
  history: []
};

function fromUser(user: ApiUser): Partial<MediRecordState> {
  return {
    user,
    currentRole: user.role === 'patient' ? 'roberto' : 'silvana',
    fontSize: user.fontSize,
    highContrast: user.highContrast,
    soundEnabled: user.soundEnabled,
    vibrationEnabled: user.vibrationEnabled,
    voiceConfirmationEnabled: user.voiceConfirmationEnabled,
    silvanaAlertWaitMinutes: user.alertWaitMinutes
  };
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : 'Algo salió mal. Intentá de nuevo.';
}

const MediRecordContext = createContext<MediRecordContextType | undefined>(undefined);

export const MediRecordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [state, setState] = useState<MediRecordState>(() => ({ ...EMPTY_STATE, loading: Boolean(getToken()) }));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const refreshing = useRef<Promise<void> | null>(null);

  const showToast = useCallback((text: string, type: ToastMessage['type'] = 'info', subtext?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type, subtext }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const dismissToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    setState({ ...EMPTY_STATE });
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      setTokenState(null);
      setState({ ...EMPTY_STATE });
    });
  }, []);

  const doRefresh = useCallback(async () => {
    const [user, link] = await Promise.all([api<ApiUser>('/api/me'), api<LinkInfo>('/api/link')]);
    const canSeePatient = user.role === 'patient' || link.status === 'accepted';
    let medicines: Medicine[] = [];
    let today: DayDoses = { date: localIsoDate(), isToday: true, doses: [] };
    let history: DayDoses[] = [];
    if (canSeePatient) {
      [medicines, today, history] = await Promise.all([
        api<Medicine[]>('/api/medicines'),
        api<DayDoses>('/api/doses/today'),
        api<DayDoses[]>('/api/history?days=7')
      ]);
    }
    setState(prev => ({
      ...prev,
      ...fromUser(user),
      link,
      loading: false,
      medicines,
      todayDate: today.date,
      todayDoses: today.doses,
      history
    }));
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) return;
    if (!refreshing.current) {
      refreshing.current = doRefresh().finally(() => {
        refreshing.current = null;
      });
    }
    try {
      await refreshing.current;
    } catch (err) {
      setState(prev => ({ ...prev, loading: false }));
      if (!(err instanceof ApiError && err.status === 401)) {
        showToast('No pudimos actualizar', 'alert', errorText(err));
      }
    }
  }, [doRefresh, showToast]);

  // Carga inicial + polling + al volver a la pestaña
  useEffect(() => {
    if (!token) return;
    refresh();
    const interval = setInterval(refresh, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [token, refresh]);

  /** Ejecuta una mutación, refresca y muestra el toast de éxito (o el error). */
  const run = useCallback(
    async (fn: () => Promise<unknown>, success?: [string, ToastMessage['type'], string?]) => {
      try {
        await fn();
        await refresh();
        if (success) showToast(success[0], success[1], success[2]);
      } catch (err) {
        if (!(err instanceof ApiError && err.status === 401)) {
          showToast('No se pudo guardar', 'alert', errorText(err));
        }
      }
    },
    [refresh, showToast]
  );

  const startSession = (newToken: string, user: ApiUser) => {
    setToken(newToken);
    setState(prev => ({ ...prev, ...fromUser(user), loading: true, currentTab: 'hoy' }));
    setTokenState(newToken);
  };

  const login = async (username: string, password: string) => {
    const res = await api<{ token: string; user: ApiUser }>('/api/auth/login', { method: 'POST', body: { username, password } });
    startSession(res.token, res.user);
  };

  const register = async (data: RegisterData) => {
    const res = await api<{ token: string; user: ApiUser }>('/api/auth/register', { method: 'POST', body: data });
    startSession(res.token, res.user);
    setState(prev => ({ ...prev, specialView: data.role === 'patient' ? 'onboarding-roberto' : 'onboarding-silvana' }));
  };

  const patchSettings = (body: Partial<ApiUser>, success?: [string, ToastMessage['type'], string?]) =>
    run(() => api('/api/me/settings', { method: 'PATCH', body }), success);

  const doseName = (doseId: string): DoseRecord | undefined => state.todayDoses.find(d => d.id === doseId);
  const supportName = state.link.status === 'accepted' ? state.link.otherDisplayName : null;

  const value: MediRecordContextType = {
    state,
    isAuthenticated: Boolean(token),
    toasts,
    dismissToast,
    showToast,
    setTab: tab => setState(prev => ({ ...prev, currentTab: tab })),
    setSpecialView: view => setState(prev => ({ ...prev, specialView: view })),
    login,
    register,
    logout,
    refresh,
    setFontSize: size => {
      setState(prev => ({ ...prev, fontSize: size }));
      return patchSettings({ fontSize: size });
    },
    setHighContrast: enabled => {
      setState(prev => ({ ...prev, highContrast: enabled }));
      return patchSettings({ highContrast: enabled });
    },
    setSoundEnabled: enabled => patchSettings({ soundEnabled: enabled }),
    setVibrationEnabled: enabled => patchSettings({ vibrationEnabled: enabled }),
    setVoiceConfirmationEnabled: enabled => patchSettings({ voiceConfirmationEnabled: enabled }),
    setSilvanaAlertWait: minutes =>
      patchSettings({ alertWaitMinutes: minutes }, ['Preferencia actualizada', 'success', `Aviso configurado a los ${minutes} minutos.`]),
    markDoseTaken: doseId =>
      run(() => api(`/api/doses/${doseId}/take`, { method: 'POST' }), [
        'Toma registrada',
        'success',
        supportName ? `${doseName(doseId)?.medicineName ?? 'La toma'} quedó registrada. ${supportName} lo va a ver.` : undefined
      ]),
    markDoseOmitted: (doseId, reason) =>
      run(() => api(`/api/doses/${doseId}/omit`, { method: 'POST', body: { reason } }), [
        'Quedó como no tomada',
        'alert',
        supportName ? `${supportName} va a ver el motivo: "${reason}".` : `Motivo: "${reason}".`
      ]),
    postponeDose: (doseId, minutes = 10) =>
      run(() => api(`/api/doses/${doseId}/postpone`, { method: 'POST', body: { minutes } }), [
        `Recordatorio postergado ${minutes} min`,
        'info',
        'El plazo para avisar a tu persona de apoyo no se reinicia.'
      ]),
    undoDoseStatus: doseId =>
      run(() => api(`/api/doses/${doseId}/undo`, { method: 'POST' }), ['Registro deshecho', 'info', 'La toma volvió a pendiente.']),
    attendNotice: doseId =>
      run(() => api(`/api/doses/${doseId}/attend`, { method: 'POST' }), [
        'Aviso atendido',
        'success',
        'La toma sigue sin confirmar: solo la persona que la toma puede registrarla.'
      ]),
    addMedicine: med =>
      run(
        () =>
          api('/api/medicines', {
            method: 'POST',
            body: {
              name: med.name,
              dose: med.dose,
              concentration: med.concentration ?? '',
              amount: med.amount ?? '',
              times: med.times,
              days: med.days
            }
          }),
        ['Medicina guardada', 'success', `${med.name} se agregó al plan.`]
      ),
    updateMedicine: (id, updated) => {
      const body: Record<string, unknown> = {};
      for (const key of ['name', 'dose', 'concentration', 'amount', 'times', 'days'] as const) {
        if (updated[key] !== undefined) body[key] = updated[key];
      }
      const name = updated.name ?? state.medicines.find(m => m.id === id)?.name ?? 'La medicina';
      return run(() => api(`/api/medicines/${id}`, { method: 'PATCH', body }), ['Cambios guardados', 'success', `${name} fue actualizada.`]);
    },
    togglePauseMedicine: id => run(() => api(`/api/medicines/${id}/toggle-pause`, { method: 'POST' })),
    deleteMedicine: id =>
      run(() => api(`/api/medicines/${id}`, { method: 'DELETE' }), ['Medicina eliminada', 'info', 'El historial se conserva.']),
    inviteByCode: code =>
      run(() => api('/api/link/invite', { method: 'POST', body: { code } }), [
        'Invitación enviada',
        'success',
        'Cuando la acepte, vas a ver sus tomas.'
      ]),
    acceptInvitation: () =>
      run(() => api('/api/link/accept', { method: 'POST' }), [
        '¡Vínculo aceptado!',
        'success',
        `${state.link.otherDisplayName ?? 'Tu persona de apoyo'} ahora puede acompañarte.`
      ]),
    rejectInvitation: () =>
      run(() => api('/api/link/reject', { method: 'POST' }), ['Invitación rechazada', 'info', 'Seguís sin persona de apoyo vinculada.']),
    unlink: () => run(() => api('/api/link', { method: 'DELETE' }), ['Vínculo eliminado', 'info'])
  };

  return <MediRecordContext.Provider value={value}>{children}</MediRecordContext.Provider>;
};

export const useMediRecord = () => {
  const context = useContext(MediRecordContext);
  if (!context) {
    throw new Error('useMediRecord must be used within a MediRecordProvider');
  }
  return context;
};
