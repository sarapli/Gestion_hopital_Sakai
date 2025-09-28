import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Button3dComponent } from '../shared/components/button-3d/button-3d.component';
import { ParticlesComponent } from '../shared/components/particles/particles.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Button3dComponent, ParticlesComponent, FooterComponent],
  template: `
    <div class="home-container">
      <!-- Particules d'arrière-plan -->
      <app-particles></app-particles>
      

      <!-- Contenu principal -->
      <main class="home-main">
        <div class="hero-section">
          <div class="hero-content">
            <div class="hero-text">
              <h1 class="hero-title">
                <span class="title-line">Gestion Médicale</span>
                <span class="title-line highlight">Moderne & Efficace</span>
              </h1>
              <p class="hero-description">
                Simplifiez la gestion de vos rendez-vous médicaux avec notre plateforme 
                intuitive et sécurisée. Conçue pour les professionnels de santé et leurs patients.
              </p>
               <div class="hero-actions">
                 <app-button-3d
                   label="Se connecter"
                   icon="pi pi-sign-in"
                   variant="info"
                   size="large"
                   [showShine]="true"
                   [showRipple]="true"
                   (click)="navigateToAuth()"
                   class="cta-button">
                 </app-button-3d>
               </div>
            </div>
          </div>
        </div>

      </main>

      <!-- Footer -->
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
     .home-container {
       min-height: 100vh;
       position: relative;
       background-image: url('/assets/images/Image_accueille.png');
       background-size: cover;
       background-position: center;
       background-repeat: no-repeat;
       overflow-x: hidden;
     }

     .home-container::before {
       content: '';
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       background: rgba(0, 0, 0, 0.4);
       z-index: 1;
     }

     .home-main {
       position: relative;
       z-index: 2;
     }

    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 2rem;
    }

     .hero-content {
       max-width: 1200px;
       margin: 0 auto;
       display: flex;
       justify-content: center;
       align-items: center;
     }

    .hero-text {
      color: white;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }

    .title-line {
      display: block;
    }

    .highlight {
      background: linear-gradient(45deg, #ffd700, #ffed4e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.25rem;
      line-height: 1.6;
      margin-bottom: 2.5rem;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .cta-button {
      transform: translateY(0);
      transition: transform 0.3s ease;
    }

    .cta-button:hover {
      transform: translateY(-2px);
    }





     /* Responsive Design */
     @media (max-width: 768px) {
       .hero-content {
         text-align: center;
       }

       .hero-title {
         font-size: 2.5rem;
       }

       .hero-actions {
         justify-content: center;
       }
     }

     @media (max-width: 480px) {
       .hero-title {
         font-size: 2rem;
       }

       .hero-description {
         font-size: 1.1rem;
       }

       .hero-actions {
         flex-direction: column;
         align-items: center;
       }
     }
  `]
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToAuth(): void {
    this.router.navigate(['/auth']);
  }
}
