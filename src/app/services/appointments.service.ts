import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private readonly COLLECTION = 'appointments';

  constructor(private firebaseService: FirebaseService) {}

  // Créer un rendez-vous
  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return await this.firebaseService.createDocument(this.COLLECTION, appointment);
  }

  // Mettre à jour un rendez-vous
  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<void> {
    return await this.firebaseService.updateDocument(this.COLLECTION, id, appointment);
  }

  // Supprimer un rendez-vous
  async deleteAppointment(id: string): Promise<void> {
    return await this.firebaseService.deleteDocument(this.COLLECTION, id);
  }

  // Obtenir un rendez-vous par ID
  async getAppointment(id: string): Promise<Appointment | null> {
    return await this.firebaseService.getDocument<Appointment>(this.COLLECTION, id);
  }

  // Obtenir tous les rendez-vous
  async getAllAppointments(): Promise<Appointment[]> {
    return await this.firebaseService.getCollection<Appointment>(this.COLLECTION, {
      orderBy: 'appointmentDate',
      orderDirection: 'desc'
    });
  }

  // Obtenir les rendez-vous d'un médecin
  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return await this.firebaseService.searchDocuments<Appointment>(
      this.COLLECTION,
      'doctorId',
      '==',
      doctorId,
      { orderBy: 'appointmentDate', orderDirection: 'asc' }
    );
  }

  // Obtenir les rendez-vous d'un patient
  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return await this.firebaseService.searchDocuments<Appointment>(
      this.COLLECTION,
      'patientId',
      '==',
      patientId,
      { orderBy: 'appointmentDate', orderDirection: 'desc' }
    );
  }

  // Obtenir les rendez-vous par statut
  async getAppointmentsByStatus(status: string): Promise<Appointment[]> {
    return await this.firebaseService.searchDocuments<Appointment>(
      this.COLLECTION,
      'status',
      '==',
      status,
      { orderBy: 'appointmentDate', orderDirection: 'asc' }
    );
  }

  // Obtenir les rendez-vous d'une date spécifique
  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.firebaseService.searchDocuments<Appointment>(
      this.COLLECTION,
      'appointmentDate',
      '>=',
      this.firebaseService.dateToTimestamp(startOfDay)
    ).then(appointments => 
      appointments.filter(apt => 
        apt.appointmentDate.toDate() <= endOfDay
      )
    );
  }

  // Obtenir les rendez-vous à venir
  async getUpcomingAppointments(doctorId?: string): Promise<Appointment[]> {
    const now = new Date();
    const appointments = doctorId 
      ? await this.getAppointmentsByDoctor(doctorId)
      : await this.getAllAppointments();
    
    return appointments.filter(apt => 
      apt.appointmentDate.toDate() > now && 
      apt.status !== 'cancelled' && 
      apt.status !== 'completed'
    ).sort((a, b) => a.appointmentDate.toDate().getTime() - b.appointmentDate.toDate().getTime());
  }

  // Obtenir les rendez-vous du jour
  async getTodayAppointments(doctorId?: string): Promise<Appointment[]> {
    return await this.getAppointmentsByDate(new Date());
  }

  // Écouter les rendez-vous en temps réel
  listenToAppointments(): Observable<Appointment[]> {
    return this.firebaseService.listenToCollection<Appointment>(this.COLLECTION, {
      orderBy: 'appointmentDate',
      orderDirection: 'desc'
    });
  }

  // Écouter les rendez-vous d'un médecin en temps réel
  listenToDoctorAppointments(doctorId: string): Observable<Appointment[]> {
    return this.firebaseService.listenToCollection<Appointment>(this.COLLECTION, {
      orderBy: 'appointmentDate',
      orderDirection: 'asc'
    }).pipe(
      map(appointments => 
        appointments.filter(apt => apt.doctorId === doctorId)
      )
    );
  }

  // Statistiques des rendez-vous
  async getAppointmentStats(doctorId?: string): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    today: number;
  }> {
    const appointments = doctorId 
      ? await this.getAppointmentsByDoctor(doctorId)
      : await this.getAllAppointments();
    
    const today = new Date();
    const todayAppointments = appointments.filter(apt => 
      apt.appointmentDate.toDate().toDateString() === today.toDateString()
    );

    return {
      total: appointments.length,
      pending: appointments.filter(apt => apt.status === 'pending').length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
      today: todayAppointments.length
    };
  }

  // Rechercher des rendez-vous
  async searchAppointments(query: string, doctorId?: string): Promise<Appointment[]> {
    const appointments = doctorId 
      ? await this.getAppointmentsByDoctor(doctorId)
      : await this.getAllAppointments();
    
    const searchTerm = query.toLowerCase();
    return appointments.filter(apt => 
      apt.patientName?.toLowerCase().includes(searchTerm) ||
      apt.doctorName?.toLowerCase().includes(searchTerm) ||
      apt.reason?.toLowerCase().includes(searchTerm) ||
      apt.notes?.toLowerCase().includes(searchTerm)
    );
  }
}
