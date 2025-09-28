import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  constructor() {}

  // Animation de rebond pour les boutons
  bounce(element: HTMLElement, duration: number = 300): void {
    element.style.animation = 'none';
    element.offsetHeight; // Force reflow
    element.style.animation = `bounce ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    
    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  }

  // Animation de pulsation
  pulse(element: HTMLElement, duration: number = 1000): void {
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = `pulse ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  }

  // Animation de shake (secousse)
  shake(element: HTMLElement, duration: number = 500): void {
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = `shake ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  }

  // Animation de rotation
  rotate(element: HTMLElement, degrees: number = 360, duration: number = 500): void {
    element.style.transition = `transform ${duration}ms ease-in-out`;
    element.style.transform = `rotate(${degrees}deg)`;
    
    setTimeout(() => {
      element.style.transition = '';
      element.style.transform = '';
    }, duration);
  }

  // Animation de scale (zoom)
  scale(element: HTMLElement, scale: number = 1.1, duration: number = 200): void {
    element.style.transition = `transform ${duration}ms ease-in-out`;
    element.style.transform = `scale(${scale})`;
    
    setTimeout(() => {
      element.style.transition = '';
      element.style.transform = '';
    }, duration);
  }

  // Animation de slide (glissement)
  slideIn(element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down' = 'left', duration: number = 500): void {
    const directions = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    };

    element.style.transform = directions[direction];
    element.style.transition = `transform ${duration}ms ease-out`;
    element.offsetHeight; // Force reflow
    element.style.transform = 'translate(0, 0)';
    
    setTimeout(() => {
      element.style.transition = '';
      element.style.transform = '';
    }, duration);
  }

  // Animation de fade (fondu)
  fadeIn(element: HTMLElement, duration: number = 500): void {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.offsetHeight; // Force reflow
    element.style.opacity = '1';
    
    setTimeout(() => {
      element.style.transition = '';
      element.style.opacity = '';
    }, duration);
  }

  fadeOut(element: HTMLElement, duration: number = 500): Promise<void> {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms ease-in-out`;
      element.style.opacity = '0';
      
      setTimeout(() => {
        element.style.transition = '';
        element.style.opacity = '';
        resolve();
      }, duration);
    });
  }

  // Animation de typewriter (machine à écrire)
  typewriter(element: HTMLElement, text: string, speed: number = 50): Promise<void> {
    return new Promise((resolve) => {
      element.textContent = '';
      let i = 0;
      
      const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        
        if (i > text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  // Animation de particules
  createParticles(container: HTMLElement, count: number = 20): void {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(102, 126, 234, 0.6);
        border-radius: 50%;
        pointer-events: none;
        animation: particle-float ${2 + Math.random() * 3}s linear infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
      `;
      
      container.appendChild(particle);
      
      // Supprimer la particule après l'animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 5000);
    }
  }

  // Animation de confetti
  createConfetti(container: HTMLElement, count: number = 50): void {
    const colors = ['#667eea', '#764ba2', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'];
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events: none;
        animation: confetti-fall ${2 + Math.random() * 3}s ease-out forwards;
        left: ${Math.random() * 100}%;
        top: -10px;
        transform: rotate(${Math.random() * 360}deg);
      `;
      
      container.appendChild(confetti);
      
      // Supprimer le confetti après l'animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 5000);
    }
  }

  // Animation de ripple (ondulation)
  createRipple(event: MouseEvent, element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
}
