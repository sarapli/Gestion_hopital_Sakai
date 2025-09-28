import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] = [];
  sidebarVisible = true;

  constructor() { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Tableau de bord',
        icon: 'pi pi-home',
        routerLink: ['/dashboard']
      },
      {
        label: 'Gestion des utilisateurs',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Liste des utilisateurs',
            icon: 'pi pi-list',
            routerLink: ['/users']
          },
          {
            label: 'Ajouter un utilisateur',
            icon: 'pi pi-plus',
            routerLink: ['/users/add']
          }
        ]
      },
      {
        label: 'Gestion des produits',
        icon: 'pi pi-shopping-cart',
        items: [
          {
            label: 'Catalogue',
            icon: 'pi pi-th-large',
            routerLink: ['/products']
          },
          {
            label: 'Catégories',
            icon: 'pi pi-tags',
            routerLink: ['/categories']
          }
        ]
      },
      {
        label: 'Commandes',
        icon: 'pi pi-shopping-bag',
        routerLink: ['/orders']
      },
      {
        label: 'Rapports',
        icon: 'pi pi-chart-bar',
        items: [
          {
            label: 'Ventes',
            icon: 'pi pi-chart-line',
            routerLink: ['/reports/sales']
          },
          {
            label: 'Clients',
            icon: 'pi pi-users',
            routerLink: ['/reports/customers']
          }
        ]
      },
      {
        label: 'Paramètres',
        icon: 'pi pi-cog',
        routerLink: ['/settings']
      }
    ];
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
