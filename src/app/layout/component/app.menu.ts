import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { AppMenuItem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, MenuModule],
    templateUrl: './app.menu.html'
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    trackByFn(index: number, item: any): any {
        return item.label || index;
    }

    ngOnInit() {
        this.model = [
            {
                label: 'Accueil',
                items: [
                    {
                        label: 'Tableau de bord',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/dashboard']
                    }
                ]
            },
            {
                label: 'Gestion médicale',
                items: [
                    {
                        label: 'Rendez-vous',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/appointments']
                    },
                    {
                        label: 'Patients',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/patients']
                    },
                    {
                        label: 'Calendrier',
                        icon: 'pi pi-fw pi-calendar-plus',
                        routerLink: ['/appointments/calendar']
                    }
                ]
            },
            {
                label: 'Rapports',
                items: [
                    {
                        label: 'Statistiques',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/reports']
                    },
                    {
                        label: 'Exports',
                        icon: 'pi pi-fw pi-download',
                        routerLink: ['/reports/exports']
                    }
                ]
            },
            {
                label: 'UI Components',
                items: [
                    {
                        label: 'Form Layout',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/uikit/formlayout']
                    },
                    {
                        label: 'Input',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/uikit/input']
                    },
                    {
                        label: 'Float Label',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/uikit/floatlabel']
                    },
                    {
                        label: 'Invalid State',
                        icon: 'pi pi-fw pi-exclamation-triangle',
                        routerLink: ['/uikit/invalidstate']
                    },
                    {
                        label: 'Button',
                        icon: 'pi pi-fw pi-mobile',
                        routerLink: ['/uikit/button']
                    },
                    {
                        label: 'Table',
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/uikit/table']
                    },
                    {
                        label: 'List',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/uikit/list']
                    },
                    {
                        label: 'Tree',
                        icon: 'pi pi-fw pi-share-alt',
                        routerLink: ['/uikit/tree']
                    },
                    {
                        label: 'Panel',
                        icon: 'pi pi-fw pi-tablet',
                        routerLink: ['/uikit/panel']
                    },
                    {
                        label: 'Overlay',
                        icon: 'pi pi-fw pi-clone',
                        routerLink: ['/uikit/overlay']
                    },
                    {
                        label: 'Media',
                        icon: 'pi pi-fw pi-image',
                        routerLink: ['/uikit/media']
                    },
                    {
                        label: 'Menu',
                        icon: 'pi pi-fw pi-bars',
                        routerLink: ['/uikit/menu']
                    },
                    {
                        label: 'Message',
                        icon: 'pi pi-fw pi-comment',
                        routerLink: ['/uikit/message']
                    },
                    {
                        label: 'File',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/uikit/file']
                    },
                    {
                        label: 'Chart',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/uikit/charts']
                    },
                    {
                        label: 'Misc',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/uikit/misc']
                    }
                ]
            },
            {
                label: 'Prime Blocks',
                items: [
                    {
                        label: 'Free Blocks',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/blocks']
                    },
                    {
                        label: 'All Blocks',
                        icon: 'pi pi-fw pi-globe',
                        url: ['https://www.primefaces.org/primeblocks-ng'],
                        target: '_blank'
                    }
                ]
            },
            {
                label: 'Utilities',
                items: [
                    {
                        label: 'PrimeIcons',
                        icon: 'pi pi-fw pi-prime',
                        routerLink: ['/utilities/icons']
                    },
                    {
                        label: 'PrimeFlex',
                        icon: 'pi pi-fw pi-desktop',
                        url: ['https://www.primefaces.org/primeflex/'],
                        target: '_blank'
                    }
                ]
            }
        ];
    }
}