export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName?: string; // Pour l'affichage
  doctorName?: string; // Pour l'affichage
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // en minutes
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  diagnosis?: string;
  prescription?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type AppointmentType = 
  | 'consultation'
  | 'follow-up'
  | 'emergency'
  | 'surgery'
  | 'checkup'
  | 'vaccination';

export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: string;
}

export interface AppointmentFilter {
  dateFrom?: Date;
  dateTo?: Date;
  status?: AppointmentStatus;
  type?: AppointmentType;
  doctorId?: string;
  patientId?: string;
}
