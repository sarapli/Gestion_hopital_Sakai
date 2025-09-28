import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { AppLayoutComponent } from './layout/app.layout';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppLayoutComponent, AsyncPipe, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Essaie Sakai';
  isAuthPage = false;
  isHomePage = false;
  isProtectedPage = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private router: Router
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation({
      accept: 'Accepter',
      reject: 'Rejeter',
      choose: 'Choisir',
      upload: 'Télécharger',
      cancel: 'Annuler',
      dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
      monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      today: 'Aujourd\'hui',
      clear: 'Effacer',
      weekHeader: 'Sem',
      firstDayOfWeek: 1,
      dateFormat: 'dd/mm/yy',
      weak: 'Faible',
      medium: 'Moyen',
      strong: 'Fort',
      passwordPrompt: 'Entrez un mot de passe',
      emptyFilterMessage: 'Aucun résultat trouvé',
      emptyMessage: 'Aucun enregistrement trouvé'
    });

    // Écouter les changements de route pour déterminer le type de page
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updatePageType(event.url);
      });

    // Vérifier la route actuelle
    this.updatePageType(this.router.url);
  }

  private updatePageType(url: string): void {
    this.isAuthPage = url.startsWith('/auth');
    this.isHomePage = url.startsWith('/home') || url === '/';
    this.isProtectedPage = url.startsWith('/dashboard') || 
                          url.startsWith('/appointments') || 
                          url.startsWith('/patients') ||
                          url.startsWith('/users') ||
                          url.startsWith('/settings') ||
                          url.startsWith('/reports') ||
                          url.startsWith('/profile');
  }
}
