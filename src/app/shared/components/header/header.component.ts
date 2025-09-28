import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Button3dComponent } from '../button-3d/button-3d.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Button3dComponent],
  template: `
    <header class="header">
      <div class="header-container">
        <div class="logo-section">
          <img src="assets/layout/images/logo-dark.svg" alt="MedApp Logo" class="logo-img">
          <span class="logo-text">MedApp</span>
        </div>
        
        <nav class="nav-section">
          <a href="#about" class="nav-link" (click)="scrollToSection('about', $event)">À propos</a>
          <a href="#features" class="nav-link" (click)="scrollToSection('features', $event)">Fonctionnalités</a>
          <a href="#contact" class="nav-link" (click)="scrollToSection('contact', $event)">Contact</a>
        </nav>
        
        <div class="action-section">
          <app-button-3d
            label="Se connecter"
            icon="pi pi-sign-in"
            variant="info"
            size="medium"
            [showRipple]="true"
            (click)="navigateToAuth()"
            class="auth-button">
          </app-button-3d>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-img {
      height: 40px;
      width: auto;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
    }

    .nav-section {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      color: #4a5568;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      position: relative;
      cursor: pointer;
    }

    .nav-link:hover {
      color: #667eea;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: #667eea;
      transition: width 0.3s ease;
    }

    .nav-link:hover::after {
      width: 100%;
    }

    .action-section {
      display: flex;
      align-items: center;
    }

    .auth-button {
      transform: translateY(0);
      transition: transform 0.3s ease;
    }

    .auth-button:hover {
      transform: translateY(-2px);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-container {
        padding: 1rem;
      }

      .nav-section {
        display: none;
      }

      .logo-text {
        font-size: 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .header-container {
        padding: 0.75rem;
      }

      .logo-img {
        height: 32px;
      }

      .logo-text {
        font-size: 1.1rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToAuth(): void {
    this.router.navigate(['/auth']);
  }

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
