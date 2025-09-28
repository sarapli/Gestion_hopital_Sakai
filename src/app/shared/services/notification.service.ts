import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification3D } from '../components/notification-3d/notification-3d.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<(Notification3D & { entering?: boolean; exiting?: boolean })[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private notificationId = 0;

  constructor() {}

  private generateId(): string {
    return `notification-${++this.notificationId}-${Date.now()}`;
  }

  private addNotification(notification: Notification3D): void {
    const newNotification = {
      ...notification,
      id: notification.id || this.generateId(),
      entering: true
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Marquer comme entrée après l'animation
    setTimeout(() => {
      const updatedNotifications = this.notificationsSubject.value.map(n => 
        n.id === newNotification.id ? { ...n, entering: false } : n
      );
      this.notificationsSubject.next(updatedNotifications);
    }, 500);
  }

  showSuccess(title: string, message: string, options?: Partial<Notification3D>): string {
    const notification: Notification3D = {
      id: this.generateId(),
      title,
      message,
      type: 'success',
      duration: 5000,
      icon: 'pi pi-check-circle',
      ...options
    };

    this.addNotification(notification);
    return notification.id;
  }

  showInfo(title: string, message: string, options?: Partial<Notification3D>): string {
    const notification: Notification3D = {
      id: this.generateId(),
      title,
      message,
      type: 'info',
      duration: 4000,
      icon: 'pi pi-info-circle',
      ...options
    };

    this.addNotification(notification);
    return notification.id;
  }

  showWarning(title: string, message: string, options?: Partial<Notification3D>): string {
    const notification: Notification3D = {
      id: this.generateId(),
      title,
      message,
      type: 'warning',
      duration: 6000,
      icon: 'pi pi-exclamation-triangle',
      ...options
    };

    this.addNotification(notification);
    return notification.id;
  }

  showError(title: string, message: string, options?: Partial<Notification3D>): string {
    const notification: Notification3D = {
      id: this.generateId(),
      title,
      message,
      type: 'error',
      duration: 8000,
      icon: 'pi pi-times-circle',
      ...options
    };

    this.addNotification(notification);
    return notification.id;
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  getNotifications(): (Notification3D & { entering?: boolean; exiting?: boolean })[] {
    return this.notificationsSubject.value;
  }
}
