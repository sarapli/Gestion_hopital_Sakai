import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-3d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="card-3d-container"
      [class.card-3d-hover]="isHovered"
      [class.card-3d-clicked]="isClicked"
      [class.card-3d-disabled]="disabled"
      [style.transform]="cardTransform"
      (click)="onCardClick()"
    >
      <!-- Effet de brillance -->
      <div class="card-shine" *ngIf="showShine"></div>
      
      <!-- Header de la carte -->
      <div class="card-header" *ngIf="header || icon">
        <div class="card-icon" *ngIf="icon">
          <i [class]="icon"></i>
        </div>
        <div class="card-title" *ngIf="header">
          <h3>{{ header }}</h3>
          <p *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <div class="card-actions" *ngIf="showActions">
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>
      
      <!-- Contenu principal -->
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      
      <!-- Footer de la carte -->
      <div class="card-footer" *ngIf="footer || showFooter">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
      
      <!-- Indicateur de chargement -->
      <div class="card-loading" *ngIf="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .card-3d-container {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
      cursor: pointer;
      min-height: 200px;
    }

    .card-3d-container:hover {
      transform: translateY(-8px) rotateX(5deg) rotateY(2deg);
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.15),
        0 8px 32px rgba(102, 126, 234, 0.1);
    }

    .card-3d-container:active {
      transform: translateY(-4px) rotateX(2deg) rotateY(1deg) scale(0.98);
    }

    .card-3d-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    .card-shine {
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
      pointer-events: none;
    }

    .card-header {
      padding: 24px 24px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }

    .card-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }

    .card-3d-container:hover .card-header::before {
      transform: translateX(100%);
    }

    .card-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      margin-bottom: 16px;
      font-size: 24px;
      animation: float 3s ease-in-out infinite;
    }

    .card-title h3 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .card-title p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.9rem;
    }

    .card-actions {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .card-content {
      padding: 24px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      min-height: 120px;
    }

    .card-footer {
      padding: 16px 24px;
      background: rgba(248, 250, 252, 0.8);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .card-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(102, 126, 234, 0.2);
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes shine {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Variantes de couleurs */
    .card-3d-container.card-success .card-header {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .card-3d-container.card-warning .card-header {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .card-3d-container.card-danger .card-header {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .card-3d-container.card-info .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .card-3d-container:hover {
        transform: translateY(-4px) scale(1.02);
      }
      
      .card-header {
        padding: 20px 20px 12px;
      }
      
      .card-content {
        padding: 20px;
      }
    }
  `]
})
export class Card3dComponent {
  @Input() header: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() footer: string = '';
  @Input() variant: 'default' | 'success' | 'warning' | 'danger' | 'info' = 'default';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showActions: boolean = false;
  @Input() showFooter: boolean = false;
  @Input() showShine: boolean = true;

  @Output() cardClick = new EventEmitter<void>();

  isHovered = false;
  isClicked = false;
  cardTransform = '';

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.disabled) {
      this.isHovered = true;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHovered = false;
  }

  @HostListener('mousedown')
  onMouseDown(): void {
    if (!this.disabled) {
      this.isClicked = true;
    }
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.isClicked = false;
  }

  onCardClick(): void {
    if (!this.disabled && !this.loading) {
      this.cardClick.emit();
    }
  }
}
