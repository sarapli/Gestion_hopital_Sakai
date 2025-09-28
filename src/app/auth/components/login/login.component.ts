import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth.service';
import { Card3dComponent, Button3dComponent, ParticlesComponent } from '../../../shared/components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ToastModule,
    Card3dComponent,
    Button3dComponent,
    ParticlesComponent
  ],
  template: `
    <div class="login-container">
      <!-- Particules d'arrière-plan -->
      <app-particles></app-particles>
      
      <!-- Carte de connexion 3D -->
      <div class="login-card-wrapper">
        <app-card-3d 
          header="Connexion"
          subtitle="Accédez à votre espace médical"
          icon="pi pi-user-circle"
          variant="info"
          [showShine]="true"
        >
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
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
                *ngIf="isFieldInvalid('email') && loginForm.get('email')?.touched"
              >
                Email requis et valide
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">
                <i class="pi pi-lock"></i>
                Mot de passe
              </label>
              <p-password 
                id="password" 
                formControlName="password"
                placeholder="Votre mot de passe"
                [feedback]="false"
                [toggleMask]="true"
                class="form-input"
                [class.input-error]="isFieldInvalid('password')"
              ></p-password>
              <div 
                class="error-message" 
                *ngIf="isFieldInvalid('password') && loginForm.get('password')?.touched"
              >
                Mot de passe requis
              </div>
            </div>

            <div class="form-options">
              <div class="checkbox-group">
                <p-checkbox 
                  formControlName="rememberMe" 
                  [binary]="true"
                  inputId="rememberMe"
                ></p-checkbox>
                <label for="rememberMe" class="checkbox-label">Se souvenir de moi</label>
              </div>
              <a routerLink="/auth/forgot-password" class="forgot-password">Mot de passe oublié ?</a>
            </div>

            <div class="form-actions">
              <app-button-3d 
                type="submit"
                label="Se connecter"
                icon="pi pi-sign-in"
                variant="info"
                size="large"
                [loading]="isLoading"
                [disabled]="loginForm.invalid"
                [showShine]="true"
                [showRipple]="true"
                (buttonClick)="onSubmit()"
              ></app-button-3d>
            </div>

            <div class="login-footer">
              <p>Pas encore de compte ? 
                <a routerLink="/auth/register" class="register-link">
                  <i class="pi pi-user-plus"></i>
                  Créer un compte
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
    .login-container {
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

    .login-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    .login-card-wrapper {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 450px;
      animation: slideInUp 0.8s ease-out;
    }

    .login-form {
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
      color: #667eea;
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
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .checkbox-label {
      font-size: 14px;
      color: #6b7280;
      cursor: pointer;
    }

    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .forgot-password:hover {
      color: #5a67d8;
      text-decoration: underline;
    }

    .form-actions {
      margin-bottom: 24px;
    }

    .login-footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .login-footer p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    .register-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: 8px;
      transition: all 0.3s ease;
    }

    .register-link:hover {
      color: #5a67d8;
      transform: translateY(-1px);
    }

    .register-link i {
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

    @keyframes float {
      0%, 100% { transform: translateY(-50%) translateY(0px); }
      50% { transform: translateY(-50%) translateY(-10px); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .login-container {
        padding: 16px;
      }
      
      .login-card-wrapper {
        max-width: 100%;
      }
      
      .form-options {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.signIn(email, password);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Connexion réussie',
          detail: 'Bienvenue dans votre espace médical'
        });
        
        this.router.navigate(['/dashboard']);
      } catch (error: any) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de connexion',
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
      case 'auth/wrong-password':
        return 'Mot de passe incorrect';
      case 'auth/invalid-email':
        return 'Email invalide';
      case 'auth/user-disabled':
        return 'Ce compte a été désactivé';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Veuillez réessayer plus tard';
      default:
        return 'Une erreur est survenue lors de la connexion';
    }
  }
}
