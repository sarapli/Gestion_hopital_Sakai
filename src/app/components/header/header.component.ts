import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Accueil',
        icon: 'pi pi-home',
        routerLink: ['/dashboard']
      },
      {
        label: 'Gestion',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Utilisateurs',
            icon: 'pi pi-users',
            routerLink: ['/users']
          },
          {
            label: 'Paramètres',
            icon: 'pi pi-wrench',
            routerLink: ['/settings']
          }
        ]
      },
      {
        label: 'Rapports',
        icon: 'pi pi-chart-bar',
        routerLink: ['/reports']
      }
    ];

    this.userMenuItems = [
      {
        label: 'Profil',
        icon: 'pi pi-user',
        routerLink: ['/profile']
      },
      {
        label: 'Paramètres',
        icon: 'pi pi-cog',
        routerLink: ['/settings']
      },
      {
        separator: true
      },
      {
        label: 'Déconnexion',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];
  }

  logout(): void {
    // Implémentation de la déconnexion
    console.log('Déconnexion...');
  }
}
