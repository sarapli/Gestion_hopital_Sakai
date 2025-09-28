import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth.service';
import { Card3dComponent, Button3dComponent, ParticlesComponent } from '../../../shared/components';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    Card3dComponent,
    Button3dComponent,
    ParticlesComponent
  ],
  template: `
    <div class="reset-password-container">
      <!-- Particules d'arrière-plan -->
      <app-particles></app-particles>
      
      <!-- Carte de réinitialisation 3D -->
      <div class="reset-password-card-wrapper">
        <app-card-3d 
          header="Nouveau mot de passe"
          subtitle="Créez un nouveau mot de passe sécurisé"
          icon="pi pi-lock"
          variant="success"
          [showShine]="true"
        >
          <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()" class="reset-password-form">
            <div class="form-group">
              <label for="password" class="form-label">
                <i class="pi pi-lock"></i>
                Nouveau mot de passe
              </label>
              <p-password 
                id="password" 
                formControlName="password"
                placeholder="Votre nouveau mot de passe"
                [feedback]="true"
                [toggleMask]="true"
                class="form-input"
                [class.input-error]="isFieldInvalid('password')"
              ></p-password>
              <div 
                class="error-message" 
                *ngIf="isFieldInvalid('password') && resetPasswordForm.get('password')?.touched"
              >
                <span *ngIf="resetPasswordForm.get('password')?.errors?.['required']">Le mot de passe est requis</span>
                <span *ngIf="resetPasswordForm.get('password')?.errors?.['minlength']">Minimum 8 caractères</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">
                <i class="pi pi-check"></i>
                Confirmer le mot de passe
              </label>
              <p-password 
                id="confirmPassword" 
                formControlName="confirmPassword"
                placeholder="Confirmez votre nouveau mot de passe"
                [feedback]="false"
                [toggleMask]="true"
                class="form-input"
                [class.input-error]="isFieldInvalid('confirmPassword')"
              ></p-password>
              <div 
                class="error-message" 
                *ngIf="isFieldInvalid('confirmPassword') && resetPasswordForm.get('confirmPassword')?.touched"
              >
                <span *ngIf="resetPasswordForm.get('confirmPassword')?.errors?.['required']">La confirmation est requise</span>
                <span *ngIf="resetPasswordForm.get('confirmPassword')?.errors?.['mismatch']">Les mots de passe ne correspondent pas</span>
              </div>
            </div>

            <div class="form-actions">
              <app-button-3d 
                type="submit"
                label="Réinitialiser le mot de passe"
                icon="pi pi-check"
                variant="success"
                size="large"
                [loading]="isLoading"
                [disabled]="resetPasswordForm.invalid"
                [showShine]="true"
                [showRipple]="true"
                (buttonClick)="onSubmit()"
              ></app-button-3d>
            </div>

            <div class="reset-password-footer">
              <p>Vous vous souvenez de votre mot de passe ? 
                <a routerLink="login" class="login-link">
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
    .reset-password-container {
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

    .reset-password-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    .reset-password-card-wrapper {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 450px;
      animation: slideInUp 0.8s ease-out;
    }

    .reset-password-form {
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
      color: #10b981;
      font-size: 16px;
    }

    .form-input {
      width: 100%;
    }

    .form-input .p-inputtext {
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }

    .form-input .p-inputtext:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      transform: translateY(-2px);
    }

    .input-error .p-inputtext {
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

    .reset-password-footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .reset-password-footer p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    .login-link {
      color: #10b981;
      text-decoration: none;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: 8px;
      transition: all 0.3s ease;
    }

    .login-link:hover {
      color: #059669;
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
      .reset-password-container {
        padding: 16px;
      }
      
      .reset-password-card-wrapper {
        max-width: 100%;
      }
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  oobCode: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Récupérer le code de réinitialisation depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'];
      if (!this.oobCode) {
        this.router.navigate(['/auth/forgot-password']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.valid && this.oobCode) {
      this.isLoading = true;
      try {
        const { password } = this.resetPasswordForm.value;
        await this.authService.confirmPasswordReset(this.oobCode, password);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Mot de passe réinitialisé',
          detail: 'Votre mot de passe a été mis à jour avec succès'
        });
        
        // Rediriger vers la page de connexion
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
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
      case 'auth/expired-action-code':
        return 'Le lien de réinitialisation a expiré. Veuillez en demander un nouveau.';
      case 'auth/invalid-action-code':
        return 'Le lien de réinitialisation est invalide. Veuillez en demander un nouveau.';
      case 'auth/weak-password':
        return 'Le mot de passe est trop faible. Veuillez en choisir un plus fort.';
      default:
        return 'Une erreur est survenue lors de la réinitialisation';
    }
  }
}
