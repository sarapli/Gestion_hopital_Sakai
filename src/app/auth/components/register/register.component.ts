import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Card3dComponent, Button3dComponent, ParticlesComponent } from '../../../shared/components';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    ToastModule,
    Card3dComponent,
    Button3dComponent,
    ParticlesComponent
  ],
  template: `
    <div class="register-container">
      <!-- Particules d'arrière-plan -->
      <app-particles></app-particles>
      
      <!-- Carte d'inscription 3D -->
      <div class="register-card-wrapper">
        <app-card-3d 
          header="Créer un compte"
          subtitle="Rejoignez notre équipe médicale"
          icon="pi pi-user-plus"
          variant="success"
          [showShine]="true"
        >
          
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="p-fluid">
              <div class="field">
                <label for="firstName">Prénom</label>
                <input 
                  id="firstName" 
                  type="text" 
                  pInputText 
                  formControlName="firstName"
                  placeholder="Votre prénom"
                  [class.ng-invalid]="isFieldInvalid('firstName')"
                />
                <small 
                  class="p-error" 
                  *ngIf="isFieldInvalid('firstName') && registerForm.get('firstName')?.touched"
                >
                  Prénom requis
                </small>
              </div>

              <div class="field">
                <label for="lastName">Nom</label>
                <input 
                  id="lastName" 
                  type="text" 
                  pInputText 
                  formControlName="lastName"
                  placeholder="Votre nom"
                  [class.ng-invalid]="isFieldInvalid('lastName')"
                />
                <small 
                  class="p-error" 
                  *ngIf="isFieldInvalid('lastName') && registerForm.get('lastName')?.touched"
                >
                  Nom requis
                </small>
              </div>

              <div class="field">
                <label for="email">Email</label>
                <input 
                  id="email" 
                  type="email" 
                  pInputText 
                  formControlName="email"
                  placeholder="votre@email.com"
                  [class.ng-invalid]="isFieldInvalid('email')"
                />
                <small 
                  class="p-error" 
                  *ngIf="isFieldInvalid('email') && registerForm.get('email')?.touched"
                >
                  Email requis et valide
                </small>
              </div>

              <div class="field">
                <label for="phone">Téléphone</label>
                <input 
                  id="phone" 
                  type="tel" 
                  pInputText 
                  formControlName="phone"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div class="field">
                <label for="role">Rôle</label>
                <p-dropdown 
                  id="role"
                  formControlName="role"
                  [options]="roleOptions"
                  placeholder="Sélectionnez votre rôle"
                  [class.ng-invalid]="isFieldInvalid('role')"
                ></p-dropdown>
                <small 
                  class="p-error" 
                  *ngIf="isFieldInvalid('role') && registerForm.get('role')?.touched"
                >
                  Rôle requis
                </small>
              </div>

              <div class="field" *ngIf="registerForm.get('role')?.value === 'doctor'">
                <label for="specialty">Spécialité</label>
                <input 
                  id="specialty" 
                  type="text" 
                  pInputText 
                  formControlName="specialty"
                  placeholder="Votre spécialité médicale"
                />
              </div>

              <div class="field">
                <label for="password">Mot de passe</label>
                <p-password 
                  id="password" 
                  formControlName="password"
                  placeholder="Votre mot de passe"
                  [feedback]="true"
                  [toggleMask]="true"
                  [class.ng-invalid]="isFieldInvalid('password')"
                ></p-password>
                <small 
                  class="p-error" 
                  *ngIf="isFieldInvalid('password') && registerForm.get('password')?.touched"
                >
                  Mot de passe requis (min. 6 caractères)
                </small>
              </div>

              <div class="field">
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <p-password 
                  id="confirmPassword" 
                  formControlName="confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                  [feedback]="false"
                  [toggleMask]="true"
                  [class.ng-invalid]="isFieldInvalid('confirmPassword')"
                ></p-password>
                <small 
                  class="p-error" 
                  *ngIf="isFieldInvalid('confirmPassword') && registerForm.get('confirmPassword')?.touched"
                >
                  Les mots de passe ne correspondent pas
                </small>
              </div>

              <div class="field">
                <p-button 
                  type="submit" 
                  label="Créer le compte" 
                  icon="pi pi-user-plus"
                  [loading]="isLoading"
                  [disabled]="registerForm.invalid"
                  styleClass="p-button-raised p-button-lg w-full"
                ></p-button>
              </div>

              <div class="register-footer">
                <p>Déjà un compte ? 
                  <a routerLink="/auth/login" class="text-primary">Se connecter</a>
                </p>
              </div>
            </div>
          </form>
        </app-card-3d>
      </div>
    </div>
    <p-toast></p-toast>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      position: relative;
      overflow: hidden;
      background-image: url('/assets/images/Image-Authentification-Inscription.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .register-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    .register-card-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 500px;
    }

    .register-header {
      text-align: center;
      padding: 2rem 0 1rem 0;
    }

    .register-header h2 {
      margin: 1rem 0 0.5rem 0;
      color: #333;
    }

    .register-header p {
      color: #666;
      margin: 0;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .register-footer {
      text-align: center;
      margin-top: 1.5rem;
    }

    .register-footer a {
      text-decoration: none;
      font-weight: 500;
    }

    @keyframes float {
      0%, 100% { transform: translateY(-50%) translateY(0px); }
      50% { transform: translateY(-50%) translateY(-10px); }
    }

    .w-full {
      width: 100%;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;

  roleOptions = [
    { label: 'Médecin', value: 'doctor' },
    { label: 'Assistant(e)', value: 'assistant' },
    { label: 'Administrateur', value: 'admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['', [Validators.required]],
      specialty: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading = true;
      try {
        const formValue = this.registerForm.value;
        const userData: Partial<User> = {
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          role: formValue.role,
          phone: formValue.phone,
          specialty: formValue.specialty
        };

        await this.authService.signUp(formValue.email, formValue.password, userData);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Compte créé avec succès',
          detail: 'Bienvenue dans notre équipe médicale'
        });
        
        this.router.navigate(['/dashboard']);
      } catch (error: any) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur lors de la création',
          detail: this.getErrorMessage(error.code)
        });
      } finally {
        this.isLoading = false;
      }
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Cet email est déjà utilisé';
      case 'auth/invalid-email':
        return 'Email invalide';
      case 'auth/weak-password':
        return 'Le mot de passe est trop faible';
      default:
        return 'Une erreur est survenue lors de la création du compte';
    }
  }
}
