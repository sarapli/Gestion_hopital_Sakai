import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-particles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="particles-container" #particlesContainer>
      <div 
        *ngFor="let particle of particles; trackBy: trackByIndex" 
        class="particle"
        [style.left.%]="particle.x"
        [style.top.%]="particle.y"
        [style.animation-delay.s]="particle.delay"
        [style.animation-duration.s]="particle.duration"
      ></div>
    </div>
  `,
  styles: [`
    .particles-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(102, 126, 234, 0.6);
      border-radius: 50%;
      animation: particle-float 6s linear infinite;
    }

    .particle:nth-child(odd) {
      background: rgba(118, 75, 162, 0.6);
      animation-duration: 8s;
    }

    .particle:nth-child(3n) {
      background: rgba(240, 147, 251, 0.6);
      animation-duration: 10s;
    }

    @keyframes particle-float {
      0% { 
        transform: translateY(100vh) rotate(0deg); 
        opacity: 0; 
      }
      10% { 
        opacity: 1; 
      }
      90% { 
        opacity: 1; 
      }
      100% { 
        transform: translateY(-100px) rotate(360deg); 
        opacity: 0; 
      }
    }
  `]
})
export class ParticlesComponent implements OnInit, OnDestroy {
  @ViewChild('particlesContainer', { static: true }) particlesContainer!: ElementRef;
  
  particles: Particle[] = [];
  private animationId?: number;

  ngOnInit(): void {
    this.createParticles();
    this.startAnimation();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private createParticles(): void {
    const particleCount = 50;
    this.particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 6 + Math.random() * 4,
        size: 2 + Math.random() * 4
      });
    }
  }

  private startAnimation(): void {
    const animate = () => {
      this.particles.forEach(particle => {
        particle.y -= 0.5;
        if (particle.y < -10) {
          particle.y = 110;
          particle.x = Math.random() * 100;
        }
      });
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  trackByIndex(index: number): number {
    return index;
  }
}

interface Particle {
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}
