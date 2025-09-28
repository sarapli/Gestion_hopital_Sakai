import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { MessageService } from 'primeng/api';

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId?: string;
  doctorId?: string;
  patientId?: string;
  appointmentId?: string;
  isRead: boolean;
  createdAt?: any;
  readAt?: any;
  actionUrl?: string;
  icon?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private readonly COLLECTION = 'notifications';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(
    private firebaseService: FirebaseService,
    private messageService: MessageService
  ) {
    this.initializeNotifications();
  }

  private async initializeNotifications(): Promise<void> {
    try {
      // Écouter les notifications en temps réel
      this.firebaseService.listenToCollection<Notification>(this.COLLECTION, {
        orderBy: 'createdAt',
        orderDirection: 'desc'
      }).subscribe(notifications => {
        this.notificationsSubject.next(notifications);
      });

      // Écouter les messages Firebase Cloud Messaging
      this.firebaseService.onMessage().subscribe(payload => {
        this.handleIncomingMessage(payload);
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications:', error);
    }
  }

  // Créer une notification
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<string> {
    const newNotification: Omit<Notification, 'id'> = {
      ...notification,
      isRead: false,
      createdAt: this.firebaseService.dateToTimestamp(new Date())
    };

    const id = await this.firebaseService.createDocument(this.COLLECTION, newNotification);
    
    // Afficher une notification toast
    this.showToastNotification(notification);
    
    return id;
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId: string): Promise<void> {
    await this.firebaseService.updateDocument(this.COLLECTION, notificationId, {
      isRead: true,
      readAt: this.firebaseService.dateToTimestamp(new Date())
    });
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(userId?: string): Promise<void> {
    const notifications = this.notificationsSubject.value;
    const unreadNotifications = notifications.filter(n => 
      !n.isRead && (!userId || n.userId === userId)
    );

    const operations = unreadNotifications.map(notification => ({
      type: 'update' as const,
      collection: this.COLLECTION,
      id: notification.id!,
      data: {
        isRead: true,
        readAt: this.firebaseService.dateToTimestamp(new Date())
      }
    }));

    await this.firebaseService.batchWrite(operations);
  }

  // Supprimer une notification
  async deleteNotification(notificationId: string): Promise<void> {
    await this.firebaseService.deleteDocument(this.COLLECTION, notificationId);
  }

  // Supprimer toutes les notifications lues
  async deleteReadNotifications(userId?: string): Promise<void> {
    const notifications = this.notificationsSubject.value;
    const readNotifications = notifications.filter(n => 
      n.isRead && (!userId || n.userId === userId)
    );

    const operations = readNotifications.map(notification => ({
      type: 'delete' as const,
      collection: this.COLLECTION,
      id: notification.id!
    }));

    await this.firebaseService.batchWrite(operations);
  }

  // Obtenir les notifications non lues
  getUnreadNotifications(userId?: string): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => 
        notifications.filter(n => 
          !n.isRead && (!userId || n.userId === userId)
        )
      )
    );
  }

  // Obtenir le nombre de notifications non lues
  getUnreadCount(userId?: string): Observable<number> {
    return this.getUnreadNotifications(userId).pipe(
      map(notifications => notifications.length)
    );
  }

  // Obtenir les notifications par priorité
  getNotificationsByPriority(priority: Notification['priority'], userId?: string): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => 
        notifications.filter(n => 
          n.priority === priority && (!userId || n.userId === userId)
        )
      )
    );
  }

  // Notifications spécifiques aux rendez-vous
  async notifyAppointmentCreated(appointment: any): Promise<void> {
    await this.createNotification({
      title: 'Nouveau rendez-vous',
      message: `Un nouveau rendez-vous a été créé pour ${appointment.patientName}`,
      type: 'info',
      doctorId: appointment.doctorId,
      appointmentId: appointment.id,
      priority: 'medium',
      icon: 'pi pi-calendar',
      actionUrl: `/appointments/${appointment.id}`
    });
  }

  async notifyAppointmentUpdated(appointment: any): Promise<void> {
    await this.createNotification({
      title: 'Rendez-vous modifié',
      message: `Le rendez-vous de ${appointment.patientName} a été modifié`,
      type: 'warning',
      doctorId: appointment.doctorId,
      appointmentId: appointment.id,
      priority: 'medium',
      icon: 'pi pi-pencil',
      actionUrl: `/appointments/${appointment.id}`
    });
  }

  async notifyAppointmentCancelled(appointment: any): Promise<void> {
    await this.createNotification({
      title: 'Rendez-vous annulé',
      message: `Le rendez-vous de ${appointment.patientName} a été annulé`,
      type: 'error',
      doctorId: appointment.doctorId,
      appointmentId: appointment.id,
      priority: 'high',
      icon: 'pi pi-times',
      actionUrl: `/appointments`
    });
  }

  async notifyAppointmentReminder(appointment: any): Promise<void> {
    await this.createNotification({
      title: 'Rappel de rendez-vous',
      message: `Vous avez un rendez-vous dans 30 minutes avec ${appointment.patientName}`,
      type: 'info',
      doctorId: appointment.doctorId,
      appointmentId: appointment.id,
      priority: 'urgent',
      icon: 'pi pi-bell',
      actionUrl: `/appointments/${appointment.id}`
    });
  }

  // Notifications système
  async notifySystemMaintenance(): Promise<void> {
    await this.createNotification({
      title: 'Maintenance système',
      message: 'Le système sera en maintenance de 2h à 4h du matin',
      type: 'warning',
      priority: 'high',
      icon: 'pi pi-cog'
    });
  }

  async notifyNewPatient(patient: any): Promise<void> {
    await this.createNotification({
      title: 'Nouveau patient',
      message: `${patient.firstName} ${patient.lastName} a été ajouté à votre liste de patients`,
      type: 'success',
      doctorId: patient.assignedDoctorId,
      patientId: patient.id,
      priority: 'medium',
      icon: 'pi pi-user-plus',
      actionUrl: `/patients/${patient.id}`
    });
  }

  // Gestion des messages Firebase Cloud Messaging
  private handleIncomingMessage(payload: any): void {
    const notification: Notification = {
      title: payload.notification?.title || 'Nouvelle notification',
      message: payload.notification?.body || payload.data?.message || 'Vous avez reçu une nouvelle notification',
      type: payload.data?.type || 'info',
      priority: payload.data?.priority || 'medium',
      isRead: false,
      createdAt: this.firebaseService.dateToTimestamp(new Date())
    };

    this.showToastNotification(notification);
  }

  private showToastNotification(notification: Notification): void {
    this.messageService.add({
      severity: notification.type,
      summary: notification.title,
      detail: notification.message,
      life: this.getToastLife(notification.priority)
    });
  }

  private getToastLife(priority: Notification['priority']): number {
    switch (priority) {
      case 'urgent': return 10000;
      case 'high': return 8000;
      case 'medium': return 5000;
      case 'low': return 3000;
      default: return 5000;
    }
  }

  // Obtenir le token de messagerie
  getMessagingToken(): Observable<string | null> {
    return this.firebaseService.getMessagingToken();
  }

  // Programmer une notification
  async scheduleNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>, delay: number): Promise<void> {
    setTimeout(async () => {
      await this.createNotification(notification);
    }, delay);
  }
}
