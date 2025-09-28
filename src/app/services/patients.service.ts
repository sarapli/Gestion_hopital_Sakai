import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private readonly COLLECTION = 'patients';

  constructor(private firebaseService: FirebaseService) {}

  // Créer un patient
  async createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return await this.firebaseService.createDocument(this.COLLECTION, patient);
  }

  // Mettre à jour un patient
  async updatePatient(id: string, patient: Partial<Patient>): Promise<void> {
    return await this.firebaseService.updateDocument(this.COLLECTION, id, patient);
  }

  // Supprimer un patient
  async deletePatient(id: string): Promise<void> {
    return await this.firebaseService.deleteDocument(this.COLLECTION, id);
  }

  // Obtenir un patient par ID
  async getPatient(id: string): Promise<Patient | null> {
    return await this.firebaseService.getDocument<Patient>(this.COLLECTION, id);
  }

  // Obtenir tous les patients
  async getAllPatients(): Promise<Patient[]> {
    return await this.firebaseService.getCollection<Patient>(this.COLLECTION, {
      orderBy: 'lastName',
      orderDirection: 'asc'
    });
  }

  // Obtenir les patients d'un médecin
  async getPatientsByDoctor(doctorId: string): Promise<Patient[]> {
    return await this.firebaseService.searchDocuments<Patient>(
      this.COLLECTION,
      'assignedDoctorId',
      '==',
      doctorId,
      { orderBy: 'lastName', orderDirection: 'asc' }
    );
  }

  // Rechercher des patients
  async searchPatients(query: string): Promise<Patient[]> {
    const patients = await this.getAllPatients();
    const searchTerm = query.toLowerCase();
    
    return patients.filter(patient => 
      patient.firstName?.toLowerCase().includes(searchTerm) ||
      patient.lastName?.toLowerCase().includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm) ||
      patient.phone?.toLowerCase().includes(searchTerm) ||
      patient.patientId?.toLowerCase().includes(searchTerm)
    );
  }

  // Obtenir les patients récents
  async getRecentPatients(limit: number = 10): Promise<Patient[]> {
    return await this.firebaseService.getCollection<Patient>(this.COLLECTION, {
      orderBy: 'createdAt',
      orderDirection: 'desc',
      limit
    });
  }

  // Obtenir les patients actifs
  async getActivePatients(): Promise<Patient[]> {
    return await this.firebaseService.searchDocuments<Patient>(
      this.COLLECTION,
      'isActive',
      '==',
      true,
      { orderBy: 'lastName', orderDirection: 'asc' }
    );
  }

  // Écouter les patients en temps réel
  listenToPatients(): Observable<Patient[]> {
    return this.firebaseService.listenToCollection<Patient>(this.COLLECTION, {
      orderBy: 'lastName',
      orderDirection: 'asc'
    });
  }

  // Écouter les patients d'un médecin en temps réel
  listenToDoctorPatients(doctorId: string): Observable<Patient[]> {
    return this.firebaseService.listenToCollection<Patient>(this.COLLECTION, {
      orderBy: 'lastName',
      orderDirection: 'asc'
    }).pipe(
      map(patients => 
        patients.filter(patient => patient.assignedDoctorId === doctorId)
      )
    );
  }

  // Statistiques des patients
  async getPatientStats(doctorId?: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    averageAge: number;
  }> {
    const patients = doctorId 
      ? await this.getPatientsByDoctor(doctorId)
      : await this.getAllPatients();
    
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const newThisMonth = patients.filter(patient => 
      patient.createdAt && 
      this.firebaseService.timestampToDate(patient.createdAt) >= thisMonth
    ).length;

    const activePatients = patients.filter(patient => patient.isActive);
    const totalAge = patients
      .filter(patient => patient.dateOfBirth)
      .reduce((sum, patient) => {
        const age = now.getFullYear() - patient.dateOfBirth!.getFullYear();
        return sum + age;
      }, 0);
    
    const patientsWithAge = patients.filter(patient => patient.dateOfBirth).length;

    return {
      total: patients.length,
      active: activePatients.length,
      inactive: patients.length - activePatients.length,
      newThisMonth,
      averageAge: patientsWithAge > 0 ? Math.round(totalAge / patientsWithAge) : 0
    };
  }

  // Obtenir l'historique médical d'un patient
  async getPatientMedicalHistory(patientId: string): Promise<any[]> {
    // Cette méthode pourrait récupérer les rendez-vous, diagnostics, prescriptions, etc.
    // Pour l'instant, retournons un tableau vide
    return [];
  }

  // Mettre à jour les informations de contact
  async updateContactInfo(patientId: string, contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  }): Promise<void> {
    return await this.updatePatient(patientId, {
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address,
      updatedAt: this.firebaseService.dateToTimestamp(new Date())
    });
  }

  // Archiver un patient
  async archivePatient(patientId: string): Promise<void> {
    return await this.updatePatient(patientId, {
      isActive: false,
      archivedAt: this.firebaseService.dateToTimestamp(new Date())
    });
  }

  // Restaurer un patient archivé
  async restorePatient(patientId: string): Promise<void> {
    return await this.updatePatient(patientId, {
      isActive: true,
      archivedAt: undefined
    });
  }
}
