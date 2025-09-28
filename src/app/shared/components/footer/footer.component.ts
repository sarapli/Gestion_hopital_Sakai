import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">MedApp</h3>
            <p class="footer-description">
              La solution moderne pour la gestion des rendez-vous médicaux. 
              Conçue pour les professionnels de santé et leurs patients.
            </p>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">Liens rapides</h4>
            <ul class="footer-links">
              <li><a href="#about" class="footer-link">À propos</a></li>
              <li><a href="#features" class="footer-link">Fonctionnalités</a></li>
              <li><a href="#contact" class="footer-link">Contact</a></li>
              <li><a href="/auth" class="footer-link">Connexion</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">Support</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Centre d'aide</a></li>
              <li><a href="#" class="footer-link">Documentation</a></li>
              <li><a href="#" class="footer-link">FAQ</a></li>
              <li><a href="#" class="footer-link">Support technique</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">Légal</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Conditions d'utilisation</a></li>
              <li><a href="#" class="footer-link">Politique de confidentialité</a></li>
              <li><a href="#" class="footer-link">Mentions légales</a></li>
              <li><a href="#" class="footer-link">RGPD</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p class="footer-copyright">
              &copy; 2024 MedApp. Tous droits réservés.
            </p>
            <div class="footer-social">
              <a href="#" class="social-link" aria-label="Facebook">
                <i class="pi pi-facebook"></i>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <i class="pi pi-twitter"></i>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <i class="pi pi-linkedin"></i>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <i class="pi pi-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
      color: white;
      padding: 3rem 0 1rem 0;
      margin-top: auto;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section {
      display: flex;
      flex-direction: column;
    }

    .footer-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #ffd700;
    }

    .footer-subtitle {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #e2e8f0;
    }

    .footer-description {
      color: #a0aec0;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.5rem;
    }

    .footer-link {
      color: #a0aec0;
      text-decoration: none;
      transition: color 0.3s ease;
      display: inline-block;
    }

    .footer-link:hover {
      color: #ffd700;
      transform: translateX(5px);
    }

    .footer-bottom {
      border-top: 1px solid #4a5568;
      padding-top: 1.5rem;
    }

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-copyright {
      color: #a0aec0;
      margin: 0;
      font-size: 0.9rem;
    }

    .footer-social {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: #a0aec0;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: #ffd700;
      color: #2d3748;
      transform: translateY(-2px);
    }

    .social-link i {
      font-size: 1.2rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .footer {
        padding: 2rem 0 1rem 0;
      }

      .footer-container {
        padding: 0 1rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
      }

      .footer-social {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .footer-social {
        gap: 0.5rem;
      }

      .social-link {
        width: 35px;
        height: 35px;
      }

      .social-link i {
        font-size: 1rem;
      }
    }
  `]
})
export class FooterComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}
}
