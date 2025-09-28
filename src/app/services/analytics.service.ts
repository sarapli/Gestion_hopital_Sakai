import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { AppointmentsService } from './appointments.service';
import { PatientsService } from './patients.service';
import { AuthService } from './auth.service';

export interface DashboardStats {
  appointments: {
    total: number;
    today: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    thisWeek: number;
    thisMonth: number;
  };
  patients: {
    total: number;
    active: number;
    newThisMonth: number;
    averageAge: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    averagePerAppointment: number;
  };
  performance: {
    averageAppointmentDuration: number;
    patientSatisfaction: number;
    noShowRate: number;
    utilizationRate: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private firebaseService: FirebaseService,
    private appointmentsService: AppointmentsService,
    private patientsService: PatientsService,
    private authService: AuthService
  ) {}

  // Obtenir les statistiques du tableau de bord
  async getDashboardStats(doctorId?: string): Promise<DashboardStats> {
    const [appointmentStats, patientStats] = await Promise.all([
      this.appointmentsService.getAppointmentStats(doctorId),
      this.patientsService.getPatientStats(doctorId)
    ]);

    // Calculer les statistiques de revenus (exemple)
    const revenue = await this.calculateRevenue(doctorId);

    // Calculer les métriques de performance
    const performance = await this.calculatePerformance(doctorId);

    return {
      appointments: {
        total: appointmentStats.total,
        today: appointmentStats.today,
        pending: appointmentStats.pending,
        confirmed: appointmentStats.confirmed,
        completed: appointmentStats.completed,
        cancelled: appointmentStats.cancelled,
        thisWeek: await this.getAppointmentsThisWeek(doctorId),
        thisMonth: await this.getAppointmentsThisMonth(doctorId)
      },
      patients: {
        total: patientStats.total,
        active: patientStats.active,
        newThisMonth: patientStats.newThisMonth,
        averageAge: patientStats.averageAge
      },
      revenue,
      performance
    };
  }

  // Obtenir les données pour les graphiques
  async getAppointmentsChartData(period: 'week' | 'month' | 'year' = 'month', doctorId?: string): Promise<ChartData> {
    const appointments = doctorId 
      ? await this.appointmentsService.getAppointmentsByDoctor(doctorId)
      : await this.appointmentsService.getAllAppointments();

    const now = new Date();
    let labels: string[] = [];
    let data: number[] = [];

    switch (period) {
      case 'week':
        labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        data = this.getWeeklyData(appointments, now);
        break;
      case 'month':
        labels = this.getMonthLabels(now);
        data = this.getMonthlyData(appointments, now);
        break;
      case 'year':
        labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        data = this.getYearlyData(appointments, now);
        break;
    }

    return {
      labels,
      datasets: [{
        label: 'Rendez-vous',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
      }]
    };
  }

  // Obtenir les données de revenus
  async getRevenueChartData(period: 'week' | 'month' | 'year' = 'month', doctorId?: string): Promise<ChartData> {
    // Simulation de données de revenus
    const now = new Date();
    let labels: string[] = [];
    let data: number[] = [];

    switch (period) {
      case 'week':
        labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        data = [1200, 1500, 1800, 1400, 1600, 2000, 0]; // Exemple
        break;
      case 'month':
        labels = this.getMonthLabels(now);
        data = [45000, 52000, 48000, 55000, 60000, 58000, 62000, 59000, 65000, 68000, 70000, 72000]; // Exemple
        break;
      case 'year':
        labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        data = [45000, 52000, 48000, 55000, 60000, 58000, 62000, 59000, 65000, 68000, 70000, 72000]; // Exemple
        break;
    }

    return {
      labels,
      datasets: [{
        label: 'Revenus (€)',
        data,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2
      }]
    };
  }

  // Obtenir les données de patients
  async getPatientsChartData(doctorId?: string): Promise<ChartData> {
    const patients = doctorId 
      ? await this.patientsService.getPatientsByDoctor(doctorId)
      : await this.patientsService.getAllPatients();

    const ageGroups = this.groupPatientsByAge(patients);
    const genderGroups = this.groupPatientsByGender(patients);

    return {
      labels: ['0-18', '19-35', '36-50', '51-65', '65+'],
      datasets: [{
        label: 'Patients par âge',
        data: ageGroups,
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(139, 92, 246, 0.5)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 2
      }]
    };
  }

  // Obtenir les rapports détaillés
  async generateReport(type: 'appointments' | 'patients' | 'revenue' | 'performance', period: 'week' | 'month' | 'year' = 'month', doctorId?: string): Promise<any> {
    switch (type) {
      case 'appointments':
        return await this.generateAppointmentsReport(period, doctorId);
      case 'patients':
        return await this.generatePatientsReport(period, doctorId);
      case 'revenue':
        return await this.generateRevenueReport(period, doctorId);
      case 'performance':
        return await this.generatePerformanceReport(period, doctorId);
      default:
        throw new Error('Type de rapport non supporté');
    }
  }

  // Méthodes privées pour les calculs
  private async calculateRevenue(doctorId?: string): Promise<{
    total: number;
    thisMonth: number;
    thisWeek: number;
    averagePerAppointment: number;
  }> {
    // Simulation de calcul de revenus
    const appointments = doctorId 
      ? await this.appointmentsService.getAppointmentsByDoctor(doctorId)
      : await this.appointmentsService.getAllAppointments();

    const completedAppointments = appointments.filter(apt => apt.status === 'completed');
    const averagePrice = 80; // Prix moyen par consultation

    return {
      total: completedAppointments.length * averagePrice,
      thisMonth: Math.floor(completedAppointments.length * averagePrice * 0.3),
      thisWeek: Math.floor(completedAppointments.length * averagePrice * 0.1),
      averagePerAppointment: averagePrice
    };
  }

  private async calculatePerformance(doctorId?: string): Promise<{
    averageAppointmentDuration: number;
    patientSatisfaction: number;
    noShowRate: number;
    utilizationRate: number;
  }> {
    // Simulation de métriques de performance
    return {
      averageAppointmentDuration: 35, // minutes
      patientSatisfaction: 4.7, // sur 5
      noShowRate: 0.05, // 5%
      utilizationRate: 0.85 // 85%
    };
  }

  private async getAppointmentsThisWeek(doctorId?: string): Promise<number> {
    const appointments = doctorId 
      ? await this.appointmentsService.getAppointmentsByDoctor(doctorId)
      : await this.appointmentsService.getAllAppointments();

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    return appointments.filter(apt => {
      const aptDate = apt.appointmentDate.toDate();
      return aptDate >= startOfWeek && aptDate <= endOfWeek;
    }).length;
  }

  private async getAppointmentsThisMonth(doctorId?: string): Promise<number> {
    const appointments = doctorId 
      ? await this.appointmentsService.getAppointmentsByDoctor(doctorId)
      : await this.appointmentsService.getAllAppointments();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return appointments.filter(apt => {
      const aptDate = apt.appointmentDate.toDate();
      return aptDate >= startOfMonth && aptDate <= endOfMonth;
    }).length;
  }

  private getWeeklyData(appointments: any[], now: Date): number[] {
    const data = [0, 0, 0, 0, 0, 0, 0]; // 7 jours
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    appointments.forEach(apt => {
      const aptDate = apt.appointmentDate.toDate();
      const dayOfWeek = aptDate.getDay();
      if (dayOfWeek >= 0 && dayOfWeek < 7) {
        data[dayOfWeek]++;
      }
    });

    return data;
  }

  private getMonthlyData(appointments: any[], now: Date): number[] {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const data = new Array(daysInMonth).fill(0);

    appointments.forEach(apt => {
      const aptDate = apt.appointmentDate.toDate();
      if (aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear()) {
        const day = aptDate.getDate() - 1;
        if (day >= 0 && day < daysInMonth) {
          data[day]++;
        }
      }
    });

    return data;
  }

  private getYearlyData(appointments: any[], now: Date): number[] {
    const data = new Array(12).fill(0);

    appointments.forEach(apt => {
      const aptDate = apt.appointmentDate.toDate();
      if (aptDate.getFullYear() === now.getFullYear()) {
        const month = aptDate.getMonth();
        data[month]++;
      }
    });

    return data;
  }

  private getMonthLabels(now: Date): string[] {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  }

  private groupPatientsByAge(patients: any[]): number[] {
    const groups = [0, 0, 0, 0, 0]; // 0-18, 19-35, 36-50, 51-65, 65+

    patients.forEach(patient => {
      if (patient.dateOfBirth) {
        const age = new Date().getFullYear() - patient.dateOfBirth.getFullYear();
        if (age <= 18) groups[0]++;
        else if (age <= 35) groups[1]++;
        else if (age <= 50) groups[2]++;
        else if (age <= 65) groups[3]++;
        else groups[4]++;
      }
    });

    return groups;
  }

  private groupPatientsByGender(patients: any[]): number[] {
    const groups = [0, 0]; // Homme, Femme

    patients.forEach(patient => {
      if (patient.gender === 'male') groups[0]++;
      else if (patient.gender === 'female') groups[1]++;
    });

    return groups;
  }

  private async generateAppointmentsReport(period: string, doctorId?: string): Promise<any> {
    // Implémentation du rapport de rendez-vous
    return {
      title: 'Rapport des Rendez-vous',
      period,
      data: await this.getAppointmentsChartData(period as any, doctorId)
    };
  }

  private async generatePatientsReport(period: string, doctorId?: string): Promise<any> {
    // Implémentation du rapport de patients
    return {
      title: 'Rapport des Patients',
      period,
      data: await this.getPatientsChartData(doctorId)
    };
  }

  private async generateRevenueReport(period: string, doctorId?: string): Promise<any> {
    // Implémentation du rapport de revenus
    return {
      title: 'Rapport des Revenus',
      period,
      data: await this.getRevenueChartData(period as any, doctorId)
    };
  }

  private async generatePerformanceReport(period: string, doctorId?: string): Promise<any> {
    // Implémentation du rapport de performance
    return {
      title: 'Rapport de Performance',
      period,
      data: await this.calculatePerformance(doctorId)
    };
  }
}
