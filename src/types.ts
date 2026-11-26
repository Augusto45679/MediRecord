export type UserRole = 'roberto' | 'silvana';

export type MainTab = 'hoy' | 'medicinas' | 'historial' | 'ajustes';

export type DoseStatus = 'pending' | 'taken' | 'omitted' | 'unconfirmed';

export type FontSizePreference = 'normal' | 'large' | 'xlarge';

export type DayOfWeek = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export type SpecialView = 'none' | 'onboarding-roberto' | 'onboarding-silvana';

export type ApiRole = 'patient' | 'caregiver';

export type OmissionReason = 'Me olvidé' | 'Me sentí mal' | 'Otro motivo';

export interface ApiUser {
  id: number;
  username: string;
  displayName: string;
  role: ApiRole;
  linkCode: string | null;
  fontSize: FontSizePreference;
  highContrast: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  voiceConfirmationEnabled: boolean;
  alertWaitMinutes: number;
}

export interface LinkInfo {
  status: 'none' | 'pending' | 'accepted' | 'rejected';
  otherDisplayName: string | null;
  otherUsername: string | null;
}

export interface DoseRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  time: string; // e.g. "08:00", "14:00", "20:00"
  doseDescription: string; // e.g. "50 mg · 1 comprimido", "500 mg · 1 comprimido"
  status: DoseStatus;
  takenAt?: string | null; // hora local "HH:MM"
  omittedAt?: string | null;
  omissionReason?: OmissionReason | null;
  isDelayed?: boolean;
  postponedUntil?: string | null;
  noticeAttended?: boolean; // la persona de apoyo marcó "ya hablé"
}

export interface DayDoses {
  date: string; // "YYYY-MM-DD"
  isToday: boolean;
  doses: DoseRecord[];
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

export interface MediRecordState {
  user: ApiUser | null;
  link: LinkInfo;
  loading: boolean;
  currentRole: UserRole; // vista: 'roberto' = paciente, 'silvana' = persona de apoyo
  currentTab: MainTab;
  specialView: SpecialView;
  fontSize: FontSizePreference;
  highContrast: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  voiceConfirmationEnabled: boolean;
  silvanaAlertWaitMinutes: number; // 30, 60, 90
  medicines: Medicine[];
  todayDate: string; // "YYYY-MM-DD" según la zona de la paciente
  todayDoses: DoseRecord[];
  history: DayDoses[];
}
