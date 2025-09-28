import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarModule } from 'primeng/avatar';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule, ButtonModule, SidebarModule, MenuModule, OverlayPanelModule, AvatarModule],
    templateUrl: './app.topbar.html'
})
export class AppTopbarComponent implements OnInit {
    currentUser: User | null = null;
    userMenuItems = [
        {
            label: 'Profil',
            icon: 'pi pi-user',
            command: () => this.viewProfile()
        },
        {
            label: 'Paramètres',
            icon: 'pi pi-cog',
            command: () => this.openSettings()
        },
        {
            separator: true
        },
        {
            label: 'Déconnexion',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
        }
    ];

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.currentUser();
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onConfigClick() {
        this.layoutService.onConfigClick();
    }

    viewProfile(): void {
        // TODO: Implémenter la vue du profil
        console.log('Voir le profil');
    }

    openSettings(): void {
        // TODO: Implémenter les paramètres
        console.log('Ouvrir les paramètres');
    }

    async logout(): Promise<void> {
        try {
            await this.authService.signOut();
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }

    getUserInitials(user: User | null): string {
        if (!user) return 'U';
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }

    getRoleLabel(role: string): string {
        const roleLabels: { [key: string]: string } = {
            'doctor': 'Médecin',
            'assistant': 'Assistant(e)',
            'admin': 'Administrateur'
        };
        return roleLabels[role] || role;
    }
}