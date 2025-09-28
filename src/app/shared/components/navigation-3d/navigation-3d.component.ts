import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-3d',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navigation-3d" [class.navigation-open]="isOpen">
      <!-- Bouton de menu hamburger 3D -->
      <button 
        class="menu-toggle"
        [class.menu-open]="isOpen"
        (click)="toggleMenu()"
        [attr.aria-label]="isOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <!-- Menu de navigation -->
      <div class="nav-menu" [class.nav-menu-open]="isOpen">
        <div class="nav-header">
          <div class="nav-logo">
            <i class="pi pi-heart" style="font-size: 2rem; color: #667eea;"></i>
            <span class="logo-text">MedApp</span>
          </div>
        </div>

        <ul class="nav-list">
          <li 
            *ngFor="let item of menuItems; trackBy: trackByLabel" 
            class="nav-item"
            [class.nav-item-active]="item.active"
          >
            <a 
              [routerLink]="item.route" 
              class="nav-link"
              (click)="onItemClick(item)"
            >
              <div class="nav-icon">
                <i [class]="item.icon"></i>
              </div>
              <span class="nav-text">{{ item.label }}</span>
              <div class="nav-indicator" *ngIf="item.active"></div>
            </a>
          </li>
        </ul>

        <!-- Actions rapides -->
        <div class="nav-actions">
          <button 
            class="action-btn"
            *ngFor="let action of quickActions; trackBy: trackByAction"
            (click)="onActionClick(action)"
            [title]="action.tooltip"
          >
            <i [class]="action.icon"></i>
          </button>
        </div>
      </div>

      <!-- Overlay pour fermer le menu -->
      <div 
        class="nav-overlay" 
        [class.nav-overlay-open]="isOpen"
        (click)="closeMenu()"
      ></div>
    </nav>
  `,
  styles: [`
    .navigation-3d {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      width: 100%;
      height: 100vh;
      pointer-events: none;
    }

    .menu-toggle {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 
        0 4px 20px rgba(102, 126, 234, 0.3),
        0 2px 8px rgba(0, 0, 0, 0.1);
      pointer-events: all;
    }

    .menu-toggle:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 
        0 8px 30px rgba(102, 126, 234, 0.4),
        0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .menu-toggle.menu-open {
      transform: rotate(90deg);
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .hamburger-line {
      width: 20px;
      height: 2px;
      background: white;
      border-radius: 1px;
      transition: all 0.3s ease;
    }

    .menu-toggle.menu-open .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .menu-toggle.menu-open .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .menu-toggle.menu-open .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }

    .nav-menu {
      position: fixed;
      top: 0;
      left: -300px;
      width: 300px;
      height: 100vh;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 0 50px rgba(0, 0, 0, 0.1),
        0 0 100px rgba(102, 126, 234, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: all;
      overflow-y: auto;
    }

    .nav-menu-open {
      left: 0;
    }

    .nav-header {
      padding: 30px 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .logo-text {
      background: linear-gradient(45deg, #fff, #f0f0f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-list {
      list-style: none;
      padding: 20px 0;
      margin: 0;
    }

    .nav-item {
      margin: 0;
      position: relative;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      color: #374151;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
      transition: left 0.6s ease;
    }

    .nav-link:hover::before {
      left: 100%;
    }

    .nav-link:hover {
      background: rgba(102, 126, 234, 0.05);
      transform: translateX(8px);
    }

    .nav-item-active .nav-link {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      font-weight: 600;
    }

    .nav-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 12px;
      font-size: 18px;
      transition: all 0.3s ease;
    }

    .nav-item-active .nav-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transform: scale(1.1);
    }

    .nav-text {
      font-size: 16px;
      font-weight: 500;
    }

    .nav-indicator {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }

    .nav-actions {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .action-btn {
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 12px;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }

    .nav-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      pointer-events: all;
    }

    .nav-overlay-open {
      opacity: 1;
      visibility: visible;
    }

    /* Animations d'entrée pour les éléments du menu */
    .nav-item {
      animation: slideInLeft 0.5s ease-out;
      animation-fill-mode: both;
    }

    .nav-item:nth-child(1) { animation-delay: 0.1s; }
    .nav-item:nth-child(2) { animation-delay: 0.2s; }
    .nav-item:nth-child(3) { animation-delay: 0.3s; }
    .nav-item:nth-child(4) { animation-delay: 0.4s; }
    .nav-item:nth-child(5) { animation-delay: 0.5s; }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-menu {
        width: 280px;
        left: -280px;
      }
      
      .menu-toggle {
        width: 44px;
        height: 44px;
        top: 16px;
        left: 16px;
      }
      
      .hamburger-line {
        width: 18px;
      }
    }
  `]
})
export class Navigation3dComponent {
  @Input() isOpen = false;
  @Output() menuToggle = new EventEmitter<boolean>();
  @Output() itemClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<any>();

  menuItems = [
    { label: 'Tableau de bord', icon: 'pi pi-home', route: '/dashboard', active: true },
    { label: 'Rendez-vous', icon: 'pi pi-calendar', route: '/appointments', active: false },
    { label: 'Patients', icon: 'pi pi-users', route: '/patients', active: false },
    { label: 'Calendrier', icon: 'pi pi-calendar-plus', route: '/appointments/calendar', active: false },
    { label: 'Rapports', icon: 'pi pi-chart-bar', route: '/reports', active: false }
  ];

  quickActions = [
    { icon: 'pi pi-bell', tooltip: 'Notifications' },
    { icon: 'pi pi-cog', tooltip: 'Paramètres' },
    { icon: 'pi pi-question-circle', tooltip: 'Aide' }
  ];

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
    this.menuToggle.emit(this.isOpen);
  }

  closeMenu(): void {
    this.isOpen = false;
    this.menuToggle.emit(false);
  }

  onItemClick(item: any): void {
    // Mettre à jour l'état actif
    this.menuItems.forEach(menuItem => {
      menuItem.active = menuItem === item;
    });
    
    this.itemClick.emit(item);
    this.closeMenu();
  }

  onActionClick(action: any): void {
    this.actionClick.emit(action);
  }

  trackByLabel(index: number, item: any): string {
    return item.label;
  }

  trackByAction(index: number, action: any): string {
    return action.icon;
  }
}
