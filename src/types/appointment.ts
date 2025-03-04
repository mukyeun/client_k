export interface AppointmentState {
  selectedDate: Date | null;
  selectedTime: string | null;
  patientInfo: PatientInfo;
  selectedSymptoms: string[];
  availableTimes: TimeSlots;
  loading: boolean;
  error: string | null;
}

export interface PatientInfo {
  name: string;
  phone: string;
  gender: 'male' | 'female';
  age: string;
  isFirstVisit: boolean;
  existingConditions: string;
  currentMedications: string;
  notes: string;
}

export interface TimeSlots {
  morning: string[];
  afternoon: string[];
}

export interface Symptom {
  id: string;
  label: string;
  description?: string;
  category?: SymptomCategory;
}

export type SymptomCategory = 
  | 'musculoskeletal'
  | 'digestive'
  | 'respiratory'
  | 'circulatory'
  | 'neurological'
  | 'psychological'
  | 'other';

export interface DialogState {
  open: boolean;
  title: string;
  message: string;
  confirmAction: (() => void) | null;
  cancelAction?: (() => void) | null;
  severity: 'info' | 'warning' | 'error';
  confirmText?: string;
  cancelText?: string;
}

export interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

export interface AppointmentConfirmationData {
  date: Date;
  time: string;
  patientInfo: PatientInfo;
  symptoms: string[];
  totalPrice?: number;
  estimatedDuration?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type AppointmentStep = 
  | 'date'
  | 'time'
  | 'patient-info'
  | 'symptoms'
  | 'confirmation';

export interface StepConfig {
  key: AppointmentStep;
  label: string;
  description?: string;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  rule: (value: any) => boolean;
  message: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  reserved?: boolean;
  specialHours?: boolean;
}

export interface DaySchedule {
  date: Date;
  timeSlots: TimeSlot[];
  isHoliday?: boolean;
  specialNote?: string;
} 