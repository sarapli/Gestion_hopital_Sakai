import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new Subject<Notification>();
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private messageService: MessageService) { }

  // Success notification
  success(title: string, message: string, duration: number = 3000): void {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: duration
    });

    this.addNotification({
      id: this.generateId(),
      type: 'success',
      title,
      message,
      duration,
      timestamp: new Date()
    });
  }

  // Error notification
  error(title: string, message: string, duration: number = 5000): void {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: duration
    });

    this.addNotification({
      id: this.generateId(),
      type: 'error',
      title,
      message,
      duration,
      timestamp: new Date()
    });
  }

  // Warning notification
  warning(title: string, message: string, duration: number = 4000): void {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: duration
    });

    this.addNotification({
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      duration,
      timestamp: new Date()
    });
  }

  // Info notification
  info(title: string, message: string, duration: number = 3000): void {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: duration
    });

    this.addNotification({
      id: this.generateId(),
      type: 'info',
      title,
      message,
      duration,
      timestamp: new Date()
    });
  }

  // Clear all notifications
  clear(): void {
    this.messageService.clear();
  }

  // Add notification to subject
  private addNotification(notification: Notification): void {
    this.notificationsSubject.next(notification);
  }

  // Generate unique ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Show loading notification
  showLoading(message: string = 'Chargement...'): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Chargement',
      detail: message,
      life: 0 // No auto-close
    });
  }

  // Hide loading notification
  hideLoading(): void {
    this.messageService.clear();
  }

  // Show confirmation dialog
  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      // This would typically use PrimeNG's ConfirmationService
      // For now, we'll use browser confirm
      const result = confirm(`${title}\n\n${message}`);
      resolve(result);
    });
  }

  // Show toast with custom options
  showToast(options: {
    severity: 'success' | 'error' | 'warning' | 'info';
    summary: string;
    detail: string;
    life?: number;
    closable?: boolean;
    sticky?: boolean;
  }): void {
    this.messageService.add({
      severity: options.severity,
      summary: options.summary,
      detail: options.detail,
      life: options.life || 3000,
      closable: options.closable !== false,
      sticky: options.sticky || false
    });
  }
}
