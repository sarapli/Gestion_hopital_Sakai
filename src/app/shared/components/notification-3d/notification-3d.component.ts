import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Notification3D {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  icon?: string;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

@Component({
  selector: 'app-notification-3d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications; trackBy: trackById"
        class="notification-3d"
        [class]="'notification-' + notification.type"
        [class.notification-enter]="notification.entering"
        [class.notification-exit]="notification.exiting"
        (click)="onNotificationClick(notification)"
      >
        <!-- Effet de brillance -->
        <div class="notification-shine" *ngIf="notification.type === 'success'"></div>
        
        <!-- Icône de notification -->
        <div class="notification-icon">
          <i [class]="getNotificationIcon(notification)"></i>
        </div>
        
        <!-- Contenu de la notification -->
        <div class="notification-content">
          <h4 class="notification-title">{{ notification.title }}</h4>
          <p class="notification-message">{{ notification.message }}</p>
          
          <!-- Actions de la notification -->
          <div class="notification-actions" *ngIf="notification.actions && notification.actions.length > 0">
            <button 
              *ngFor="let action of notification.actions; trackBy: trackByAction"
              class="action-btn"
              [class]="'action-' + (action.style || 'primary')"
              (click)="onActionClick(action, notification, $event)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
        
        <!-- Bouton de fermeture -->
        <button 
          class="notification-close"
          (click)="removeNotification(notification.id, $event)"
          [attr.aria-label]="'Fermer la notification'"
        >
          <i class="pi pi-times"></i>
        </button>
        
        <!-- Barre de progression -->
        <div 
          class="notification-progress" 
          *ngIf="notification.duration && notification.duration > 0"
          [style.animation-duration]="notification.duration + 'ms'"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
      pointer-events: none;
    }

    .notification-3d {
      position: relative;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 20px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
      pointer-events: all;
      overflow: hidden;
      min-width: 300px;
    }

    .notification-3d:hover {
      transform: translateY(-4px) rotateX(5deg) rotateY(2deg);
      box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.15),
        0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .notification-enter {
      animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .notification-exit {
      animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .notification-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      animation: shine 2s ease-in-out;
    }

    .notification-icon {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: white;
      animation: pulse 2s ease-in-out infinite;
    }

    .notification-success .notification-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .notification-info .notification-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .notification-warning .notification-icon {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .notification-error .notification-icon {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .notification-content {
      margin-left: 60px;
      margin-right: 40px;
    }

    .notification-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .notification-message {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }

    .notification-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .action-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .action-secondary {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .action-danger {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
    }

    .action-btn:hover {
      transform: translateY(-1px) scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .notification-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 24px;
      height: 24px;
      border: none;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      color: #6b7280;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: all 0.3s ease;
    }

    .notification-close:hover {
      background: rgba(0, 0, 0, 0.2);
      color: #374151;
      transform: scale(1.1);
    }

    .notification-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 0 0 16px 16px;
      animation: progressBar linear;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%) rotateY(-10deg);
      }
      to {
        opacity: 1;
        transform: translateX(0) rotateY(0deg);
      }
    }

    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0) rotateY(0deg);
      }
      to {
        opacity: 0;
        transform: translateX(100%) rotateY(10deg);
      }
    }

    @keyframes shine {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes progressBar {
      from { width: 100%; }
      to { width: 0%; }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
      
      .notification-3d {
        min-width: auto;
        padding: 16px;
      }
      
      .notification-content {
        margin-left: 50px;
        margin-right: 30px;
      }
      
      .notification-icon {
        width: 32px;
        height: 32px;
        font-size: 14px;
      }
    }
  `]
})
export class Notification3dComponent implements OnInit, OnDestroy {
  @Input() notifications: (Notification3D & { entering?: boolean; exiting?: boolean })[] = [];
  @Output() notificationClick = new EventEmitter<Notification3D>();
  @Output() notificationClose = new EventEmitter<string>();
  @Output() actionClick = new EventEmitter<{ action: NotificationAction; notification: Notification3D }>();

  private timers: Map<string, any> = new Map();

  ngOnInit(): void {
    this.setupAutoClose();
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
  }

  private setupAutoClose(): void {
    this.notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          this.removeNotification(notification.id);
        }, notification.duration);
        
        this.timers.set(notification.id, timer);
      }
    });
  }

  private clearAllTimers(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  getNotificationIcon(notification: Notification3D): string {
    if (notification.icon) {
      return notification.icon;
    }

    switch (notification.type) {
      case 'success':
        return 'pi pi-check-circle';
      case 'info':
        return 'pi pi-info-circle';
      case 'warning':
        return 'pi pi-exclamation-triangle';
      case 'error':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-bell';
    }
  }

  onNotificationClick(notification: Notification3D): void {
    this.notificationClick.emit(notification);
  }

  removeNotification(id: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    // Marquer comme en cours de sortie
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.exiting = true;
      
      // Supprimer après l'animation
      setTimeout(() => {
        this.notificationClose.emit(id);
      }, 300);
    }

    // Nettoyer le timer
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  onActionClick(action: NotificationAction, notification: Notification3D, event: Event): void {
    event.stopPropagation();
    action.action();
    this.actionClick.emit({ action, notification });
  }

  trackById(index: number, notification: Notification3D): string {
    return notification.id;
  }

  trackByAction(index: number, action: NotificationAction): string {
    return action.label;
  }
}
