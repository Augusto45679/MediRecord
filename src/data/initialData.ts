import type { MediRecordState, Medicine, DoseRecord, DayHistory } from '../types';

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-losartan',
    name: 'Losartán',
    dose: '1 comprimido de 50 mg',
    concentration: '50 mg',
    amount: '1 comprimido',
    times: ['08:00'],
    days: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'],
    frequency: 'Todos los días',
    addedBy: 'Silvana',
    status: 'active'
  },
  {
    id: 'med-metformina',
    name: 'Metformina',
    dose: '1 comprimido de 500 mg',
    concentration: '500 mg',
    amount: '1 comprimido',
    times: ['14:00', '20:00'],
    days: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'],
    frequency: 'Todos los días',
    addedBy: 'Silvana',
    status: 'active'
  }
];

export const INITIAL_TODAY_DOSES: DoseRecord[] = [
  {
    id: 'dose-today-1',
    medicineId: 'med-losartan',
    medicineName: 'Losartán',
    time: '08:00',
    doseDescription: '50 mg · 1 comprimido',
    status: 'taken',
    takenAt: '08:05'
  },
  {
    id: 'dose-today-2',
    medicineId: 'med-metformina',
    medicineName: 'Metformina',
    time: '14:00',
    doseDescription: '500 mg · 1 comprimido',
    status: 'pending' // Ready for interactive demonstration
  },
  {
    id: 'dose-today-3',
    medicineId: 'med-metformina',
    medicineName: 'Metformina',
    time: '20:00',
    doseDescription: '500 mg · 1 comprimido',
    status: 'pending'
  }
];

export const INITIAL_HISTORY: DayHistory[] = [
  {
    dateString: '2026-10-15',
    displayDate: 'Jueves 15 de octubre',
    isToday: true,
    records: [
      {
        id: 'hist-today-1',
        medicineName: 'Losartán',
        doseDescription: '50 mg · 1 comprimido',
        time: '08:00',
        status: 'taken',
        note: 'Registrada a las 08:05',
        registeredAt: '08:05'
      }
    ]
  },
  {
    dateString: '2026-10-14',
    displayDate: 'Ayer · 14 de octubre',
    isToday: false,
    records: [
      {
        id: 'hist-yest-1',
        medicineName: 'Losartán',
        doseDescription: '50 mg · 1 comprimido',
        time: '08:00',
        status: 'taken',
        note: 'Registrada a las 08:02',
        registeredAt: '08:02'
      },
      {
        id: 'hist-yest-2',
        medicineName: 'Metformina',
        doseDescription: '500 mg · 1 comprimido',
        time: '14:00',
        status: 'taken',
        note: 'Registrada a las 14:00',
        registeredAt: '14:00'
      },
      {
        id: 'hist-yest-3',
        medicineName: 'Metformina',
        doseDescription: '500 mg · 1 comprimido',
        time: '20:00',
        status: 'omitted',
        note: 'Lo indicó Roberto a las 20:10 (Me sentí mal)',
        registeredAt: '20:10'
      }
    ]
  },
  {
    dateString: '2026-10-13',
    displayDate: 'Martes 13 de octubre',
    isToday: false,
    records: [
      {
        id: 'hist-tues-1',
        medicineName: 'Losartán',
        doseDescription: '50 mg · 1 comprimido',
        time: '08:00',
        status: 'taken',
        note: 'Registrada a las 08:10',
        registeredAt: '08:10'
      },
      {
        id: 'hist-tues-2',
        medicineName: 'Metformina',
        doseDescription: '500 mg · 1 comprimido',
        time: '14:00',
        status: 'taken',
        note: 'Registrada a las 14:05',
        registeredAt: '14:05'
      },
      {
        id: 'hist-tues-3',
        medicineName: 'Metformina',
        doseDescription: '500 mg · 1 comprimido',
        time: '20:00',
        status: 'taken',
        note: 'Registrada a las 20:03',
        registeredAt: '20:03'
      }
    ]
  }
];

export const DEFAULT_STATE: MediRecordState = {
  currentRole: 'roberto',
  currentTab: 'hoy',
  specialView: 'none',
  fontSize: 'large', // Default "Grande" per MVP decisions
  highContrast: false,
  soundEnabled: true,
  vibrationEnabled: true,
  voiceConfirmationEnabled: true,
  silvanaAlertWaitMinutes: 60, // 60 min default per MVP decisions
  noticeAttendedBySilvana: false,
  medicines: INITIAL_MEDICINES,
  todayDoses: INITIAL_TODAY_DOSES,
  history: INITIAL_HISTORY,
  familyLinked: true,
  familyCode: '482 716',
  pendingInvitation: false,
  invitationRejected: false
};
