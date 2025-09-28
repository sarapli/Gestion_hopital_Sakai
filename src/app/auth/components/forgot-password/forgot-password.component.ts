import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth.service';
import { Card3dComponent, Button3dComponent, ParticlesComponent } from '../../../shared/components';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
    Card3dComponent,
    Button3dComponent,
    ParticlesComponent
  ],
  template: `
    <div class="forgot-password-container">
      <!-- Particules d'arrière-plan -->
      <app-particles></app-particles>
      
      <!-- Carte de réinitialisation 3D -->
      <div class="forgot-password-card-wrapper">
        <app-card-3d 
          header="Mot de passe oublié"
          subtitle="Entrez votre email pour recevoir un lien de réinitialisation"
          icon="pi pi-key"
          variant="warning"
          [showShine]="true"
        >
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="forgot-password-form">
            <div class="form-group">
              <label for="email" class="form-label">
                <i class="pi pi-envelope"></i>
                Email
              </label>
              <input 
                id="email" 
                type="email" 
                pInputText 
                formControlName="email"
                placeholder="votre@email.com"
                class="form-input"
                [class.input-error]="isFieldInvalid('email')"
              />
              <div 
                class="error-message" 
                *ngIf="isFieldInvalid('email') && forgotPasswordForm.get('email')?.touched"
              >
                Email requis et valide
              </div>
            </div>

            <div class="form-actions">
              <app-button-3d 
                type="submit"
                label="Envoyer le lien"
                icon="pi pi-send"
                variant="warning"
                size="large"
                [loading]="isLoading"
                [disabled]="forgotPasswordForm.invalid"
                [showShine]="true"
                [showRipple]="true"
                (buttonClick)="onSubmit()"
              ></app-button-3d>
            </div>

            <div class="forgot-password-footer">
              <p>Vous vous souvenez de votre mot de passe ? 
                <a routerLink="/auth/login" class="login-link">
                  <i class="pi pi-sign-in"></i>
                  Se connecter
                </a>
              </p>
            </div>
          </form>
        </app-card-3d>
      </div>
    </div>
    <p-toast></p-toast>
  `,
  styles: [`
    .forgot-password-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
      background-image: url('/assets/images/Image-Authentification-Inscription.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .forgot-password-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    .forgot-password-card-wrapper {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 450px;
      animation: slideInUp 0.8s ease-out;
    }

    .forgot-password-form {
      padding: 0;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .form-label i {
      color: #f59e0b;
      font-size: 16px;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }

    .form-input:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
      transform: translateY(-2px);
    }

    .input-error {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }

    .error-message {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
    }

    .form-actions {
      margin-bottom: 24px;
    }

    .forgot-password-footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .forgot-password-footer p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    .login-link {
      color: #f59e0b;
      text-decoration: none;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: 8px;
      transition: all 0.3s ease;
    }

    .login-link:hover {
      color: #d97706;
      transform: translateY(-1px);
    }

    .login-link i {
      font-size: 14px;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px) rotateX(-10deg);
      }
      to {
        opacity: 1;
        transform: translateY(0) rotateX(0deg);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .forgot-password-container {
        padding: 16px;
      }
      
      .forgot-password-card-wrapper {
        max-width: 100%;
      }
    }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      try {
        const { email } = this.forgotPasswordForm.value;
        await this.authService.resetPassword(email);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Email envoyé',
          detail: 'Un lien de réinitialisation a été envoyé à votre adresse email'
        });
        
        // Rediriger vers la page de confirmation
        this.router.navigate(['/auth/reset-password-confirmation']);
      } catch (error: any) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: this.getErrorMessage(error.code)
        });
      } finally {
        this.isLoading = false;
      }
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Aucun compte trouvé avec cet email';
      case 'auth/invalid-email':
        return 'Email invalide';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Veuillez réessayer plus tard';
      default:
        return 'Une erreur est survenue lors de l\'envoi de l\'email';
    }
  }
}
