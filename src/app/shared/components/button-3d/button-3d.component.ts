import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-3d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="button-3d"
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      (click)="onClick()"
    >
      <!-- Effet de brillance -->
      <div class="button-shine" *ngIf="showShine && !disabled"></div>
      
      <!-- Contenu du bouton -->
      <div class="button-content">
        <i *ngIf="icon && !loading" [class]="icon" class="button-icon"></i>
        <div *ngIf="loading" class="button-spinner"></div>
        <span *ngIf="label" class="button-label">{{ label }}</span>
        <ng-content></ng-content>
      </div>
      
      <!-- Effet de vague au clic -->
      <div class="button-ripple" *ngIf="showRipple" [style]="rippleStyle"></div>
    </button>
  `,
  styles: [`
    .button-3d {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
      box-shadow: 
        0 4px 15px rgba(0, 0, 0, 0.1),
        0 2px 4px rgba(0, 0, 0, 0.06);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-width: 120px;
      height: 48px;
    }

    .button-3d:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 
        0 8px 25px rgba(102, 126, 234, 0.3),
        0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .button-3d:active:not(:disabled) {
      transform: translateY(0) scale(0.98);
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.06);
    }

    .button-3d:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .button-shine {
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
      transition: left 0.6s ease;
    }

    .button-3d:hover .button-shine {
      left: 100%;
    }

    .button-content {
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
      z-index: 2;
    }

    .button-icon {
      font-size: 16px;
      transition: transform 0.3s ease;
    }

    .button-3d:hover .button-icon {
      transform: scale(1.1);
    }

    .button-label {
      font-weight: 600;
    }

    .button-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .button-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }

    /* Variantes de couleurs */
    .button-3d.button-success {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .button-3d.button-warning {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .button-3d.button-danger {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .button-3d.button-info {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .button-3d.button-outline {
      background: transparent;
      border: 2px solid #667eea;
      color: #667eea;
    }

    .button-3d.button-outline:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }

    .button-3d.button-ghost {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      box-shadow: none;
    }

    .button-3d.button-ghost:hover:not(:disabled) {
      background: rgba(102, 126, 234, 0.2);
      transform: translateY(-1px);
    }

    /* Tailles */
    .button-3d.button-small {
      padding: 8px 16px;
      font-size: 12px;
      height: 36px;
      min-width: 80px;
    }

    .button-3d.button-large {
      padding: 16px 32px;
      font-size: 16px;
      height: 56px;
      min-width: 160px;
    }

    .button-3d.button-xl {
      padding: 20px 40px;
      font-size: 18px;
      height: 64px;
      min-width: 200px;
    }

    /* Formes */
    .button-3d.button-rounded {
      border-radius: 24px;
    }

    .button-3d.button-square {
      border-radius: 8px;
    }

    .button-3d.button-circle {
      border-radius: 50%;
      width: 48px;
      height: 48px;
      min-width: 48px;
      padding: 0;
    }

    .button-3d.button-circle.button-small {
      width: 36px;
      height: 36px;
      min-width: 36px;
    }

    .button-3d.button-circle.button-large {
      width: 56px;
      height: 56px;
      min-width: 56px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .button-3d {
        padding: 10px 20px;
        font-size: 13px;
        min-width: 100px;
        height: 44px;
      }
      
      .button-3d:hover:not(:disabled) {
        transform: translateY(-1px) scale(1.02);
      }
    }
  `]
})
export class Button3dComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'ghost' = 'default';
  @Input() size: 'small' | 'medium' | 'large' | 'xl' = 'medium';
  @Input() shape: 'default' | 'rounded' | 'square' | 'circle' = 'default';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() showShine: boolean = true;
  @Input() showRipple: boolean = true;

  @Output() buttonClick = new EventEmitter<void>();

  showRippleEffect = false;
  rippleStyle = '';

  get buttonClasses(): string {
    const classes = ['button-3d'];
    
    if (this.variant !== 'default') {
      classes.push(`button-${this.variant}`);
    }
    
    if (this.size !== 'medium') {
      classes.push(`button-${this.size}`);
    }
    
    if (this.shape !== 'default') {
      classes.push(`button-${this.shape}`);
    }
    
    return classes.join(' ');
  }

  @HostListener('click', ['$event'])
  onClick(event?: MouseEvent): void {
    if (this.disabled || this.loading) {
      return;
    }

    if (this.showRipple && event) {
      this.createRipple(event);
    }

    this.buttonClick.emit();
  }

  private createRipple(event: MouseEvent): void {
    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    this.rippleStyle = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;

    this.showRippleEffect = true;

    setTimeout(() => {
      this.showRippleEffect = false;
    }, 600);
  }
}
