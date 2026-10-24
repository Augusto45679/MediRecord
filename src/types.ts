export type UserRole = 'roberto' | 'silvana';

export type MainTab = 'hoy' | 'medicinas' | 'historial' | 'ajustes';

export type DoseStatus = 'pending' | 'taken' | 'omitted' | 'unconfirmed';

export type FontSizePreference = 'normal' | 'large' | 'xlarge';

export type DayOfWeek = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export type SpecialView =
  | 'none'
  | 'welcome'
  | 'onboarding-roberto'
  | 'onboarding-silvana'
  | 'login-1'
  | 'login-2-roberto'
  | 'login-2-silvana';

export interface DoseRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  time: string; // e.g. "08:00", "14:00", "20:00"
  doseDescription: string; // e.g. "50 mg · 1 comprimido", "500 mg · 1 comprimido"
  status: DoseStatus;
  takenAt?: string; // e.g. "08:05", "14:02"
  omittedAt?: string; // e.g. "14:05"
  omissionReason?: 'Me olvidé' | 'Me sentí mal' | 'Otro motivo';
  isDelayed?: boolean; // confirmed late, e.g. 15:20
  delayedAt?: string;
  postponedUntil?: string; // e.g. "14:10"
}

export interface Medicine {
  id: string;
  name: string;
  dose: string; // "1 comprimido de 500 mg"
  concentration: string; // "500 mg"
  amount: string; // "1 comprimido"
  times: string[]; // ["14:00", "20:00"]
  days?: DayOfWeek[]; // ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']
  frequency: string; // "Todos los días", "Lunes a Viernes", etc.
  addedBy: string; // "Silvana"
  status: 'active' | 'paused';
}

export interface DayHistory {
  dateString: string; // e.g. "2026-10-15"
  displayDate: string; // e.g. "Jueves 15 de octubre"
  isToday: boolean;
  records: {
    id: string;
    medicineName: string;
    doseDescription: string;
    time: string;
    status: DoseStatus;
    note: string;
    registeredAt?: string;
  }[];
}

export interface MediRecordState {
  currentRole: UserRole;
  currentTab: MainTab;
  specialView: SpecialView;
  fontSize: FontSizePreference;
  highContrast: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  voiceConfirmationEnabled: boolean;
  silvanaAlertWaitMinutes: number; // 30, 60, 90
  noticeAttendedBySilvana: boolean; // "Ya hablé con Roberto"
  medicines: Medicine[];
  todayDoses: DoseRecord[];
  history: DayHistory[];
  familyLinked: boolean;
  familyCode: string;
  pendingInvitation: boolean;
  invitationRejected: boolean;
}
