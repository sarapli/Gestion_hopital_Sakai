import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Card3dComponent, Button3dComponent, ParticlesComponent } from '../../../shared/components';

@Component({
  selector: 'app-reset-password-confirmation',
  standalone: true,
  imports: [CommonModule, Card3dComponent, Button3dComponent, ParticlesComponent],
  template: `
    <div class="confirmation-container">
      <!-- Particules d'arrière-plan -->
      <app-particles></app-particles>
      
      <!-- Carte de confirmation 3D -->
      <div class="confirmation-card-wrapper">
        <app-card-3d 
          header="Email envoyé"
          subtitle="Vérifiez votre boîte de réception"
          icon="pi pi-check-circle"
          variant="success"
          [showShine]="true"
        >
          <div class="confirmation-content">
            <div class="confirmation-icon">
              <i class="pi pi-envelope"></i>
            </div>
            
            <div class="confirmation-text">
              <h3>Lien de réinitialisation envoyé</h3>
              <p>
                Nous avons envoyé un lien de réinitialisation de mot de passe à votre adresse email. 
                Vérifiez votre boîte de réception et suivez les instructions pour créer un nouveau mot de passe.
              </p>
              
              <div class="confirmation-actions">
                <app-button-3d
                  label="Retour à la connexion"
                  icon="pi pi-arrow-left"
                  variant="info"
                  size="large"
                  [showRipple]="true"
                  (click)="goToLogin()"
                  class="back-button">
                </app-button-3d>
                
                <app-button-3d
                  label="Renvoyer l'email"
                  icon="pi pi-refresh"
                  variant="outline"
                  size="large"
                  [showRipple]="true"
                  (click)="resendEmail()"
                  class="resend-button">
                </app-button-3d>
              </div>
            </div>
          </div>
        </app-card-3d>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
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

    .confirmation-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    .confirmation-card-wrapper {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 500px;
      animation: slideInUp 0.8s ease-out;
    }

    .confirmation-content {
      text-align: center;
      padding: 1rem 0;
    }

    .confirmation-icon {
      font-size: 4rem;
      color: #10b981;
      margin-bottom: 1.5rem;
      animation: bounce 2s infinite;
    }

    .confirmation-text h3 {
      color: #374151;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .confirmation-text p {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .confirmation-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .back-button {
      width: 100%;
    }

    .resend-button {
      width: 100%;
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

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .confirmation-container {
        padding: 16px;
      }
      
      .confirmation-card-wrapper {
        max-width: 100%;
      }

      .confirmation-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ResetPasswordConfirmationComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  resendEmail(): void {
    // Ici vous pourriez implémenter la logique pour renvoyer l'email
    // Pour l'instant, on redirige vers la page de mot de passe oublié
    this.router.navigate(['/auth/forgot-password']);
  }
}
