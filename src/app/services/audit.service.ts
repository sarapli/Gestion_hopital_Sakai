import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

export interface AuditLog {
  id?: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'auth' | 'data' | 'system' | 'security' | 'user' | 'appointment' | 'patient';
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly COLLECTION = 'audit_logs';

  constructor(private firebaseService: FirebaseService) {}

  // Créer un log d'audit
  async logAction(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<string> {
    const auditLog: Omit<AuditLog, 'id'> = {
      ...log,
      timestamp: this.firebaseService.dateToTimestamp(new Date())
    };

    return await this.firebaseService.createDocument(this.COLLECTION, auditLog);
  }

  // Logs d'authentification
  async logLogin(userId: string, userEmail: string, success: boolean, details?: any): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: success ? 'login_success' : 'login_failed',
      resource: 'auth',
      details: { success, ...details },
      severity: success ? 'low' : 'medium',
      category: 'auth'
    });
  }

  async logLogout(userId: string, userEmail: string): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: 'logout',
      resource: 'auth',
      details: {},
      severity: 'low',
      category: 'auth'
    });
  }

  async logPasswordReset(userId: string, userEmail: string, success: boolean): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: success ? 'password_reset_success' : 'password_reset_failed',
      resource: 'auth',
      details: { success },
      severity: 'medium',
      category: 'auth'
    });
  }

  // Logs de données
  async logDataAccess(userId: string, userEmail: string, resource: string, resourceId: string, action: string): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: `data_${action}`,
      resource,
      resourceId,
      details: { action },
      severity: 'low',
      category: 'data'
    });
  }

  async logDataModification(userId: string, userEmail: string, resource: string, resourceId: string, changes: any): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: 'data_modified',
      resource,
      resourceId,
      details: { changes },
      severity: 'medium',
      category: 'data'
    });
  }

  async logDataDeletion(userId: string, userEmail: string, resource: string, resourceId: string): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: 'data_deleted',
      resource,
      resourceId,
      details: {},
      severity: 'high',
      category: 'data'
    });
  }

  // Logs de rendez-vous
  async logAppointmentCreated(userId: string, userEmail: string, appointmentId: string, appointmentData: any): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: 'appointment_created',
      resource: 'appointments',
      resourceId: appointmentId,
      details: appointmentData,
      severity: 'medium',
      category: 'appointment'
    });
  }

  async logAppointmentUpdated(userId: string, userEmail: string, appointmentId: string, changes: any): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: 'appointment_updated',
      resource: 'appointments',
      resourceId: appointmentId,
      details: { changes },
      severity: 'medium',
      category: 'appointment'
    });
  }

  async logAppointmentCancelled(userId: string, userEmail: string, appointmentId: string, reason?: string): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: 'appointment_cancelled',
      resource: 'appointments',
      resourceId: appointmentId,
      details: { reason },
      severity: 'high',
      category: 'appointment'
    });
  }

  // Logs de patients
  async logPatientCreated(userId: string, userEmail: string, patientId: string, patientData: any): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: 'patient_created',
      resource: 'patients',
      resourceId: patientId,
      details: patientData,
      severity: 'medium',
      category: 'patient'
    });
  }

  async logPatientUpdated(userId: string, userEmail: string, patientId: string, changes: any): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: 'patient_updated',
      resource: 'patients',
      resourceId: patientId,
      details: { changes },
      severity: 'medium',
      category: 'patient'
    });
  }

  // Logs de sécurité
  async logSecurityEvent(userId: string, userEmail: string, event: string, details: any, severity: 'medium' | 'high' | 'critical' = 'medium'): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: `security_${event}`,
      resource: 'security',
      details,
      severity,
      category: 'security'
    });
  }

  async logUnauthorizedAccess(userId: string, userEmail: string, resource: string, details: any): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      action: 'unauthorized_access',
      resource,
      details,
      severity: 'high',
      category: 'security'
    });
  }

  // Logs système
  async logSystemEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'low'): Promise<void> {
    await this.logAction({
      userId: 'system',
      userEmail: 'system@hospital.com',
      action: `system_${event}`,
      resource: 'system',
      details,
      severity,
      category: 'system'
    });
  }

  // Obtenir les logs d'audit
  async getAuditLogs(filters?: {
    userId?: string;
    category?: string;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AuditLog[]> {
    let logs = await this.firebaseService.getCollection<AuditLog>(this.COLLECTION, {
      orderBy: 'timestamp',
      orderDirection: 'desc',
      limit: filters?.limit || 100
    });

    if (filters) {
      logs = logs.filter(log => {
        if (filters.userId && log.userId !== filters.userId) return false;
        if (filters.category && log.category !== filters.category) return false;
        if (filters.severity && log.severity !== filters.severity) return false;
        if (filters.startDate && this.firebaseService.timestampToDate(log.timestamp) < filters.startDate!) return false;
        if (filters.endDate && this.firebaseService.timestampToDate(log.timestamp) > filters.endDate!) return false;
        return true;
      });
    }

    return logs;
  }

  // Obtenir les statistiques d'audit
  async getAuditStats(period: 'day' | 'week' | 'month' = 'week'): Promise<{
    total: number;
    byCategory: { [key: string]: number };
    bySeverity: { [key: string]: number };
    byUser: { [key: string]: number };
  }> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const logs = await this.getAuditLogs({ startDate });

    const byCategory = logs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const bySeverity = logs.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const byUser = logs.reduce((acc, log) => {
      acc[log.userEmail] = (acc[log.userEmail] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      total: logs.length,
      byCategory,
      bySeverity,
      byUser
    };
  }

  // Nettoyer les anciens logs
  async cleanupOldLogs(daysToKeep: number = 90): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const oldLogs = await this.getAuditLogs({
      endDate: cutoffDate
    });

    const operations = oldLogs.map(log => ({
      type: 'delete' as const,
      collection: this.COLLECTION,
      id: log.id!
    }));

    if (operations.length > 0) {
      await this.firebaseService.batchWrite(operations);
    }
  }
}