import { Injectable, signal } from '@angular/core';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    layoutMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    config = signal<AppConfig>({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        layoutMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-blue',
        scale: 14
    });

    state = signal<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    });

    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.update(state => ({ ...state, overlayMenuActive: !state.overlayMenuActive }));
        }

        if (this.isDesktop()) {
            this.state.update(state => ({ ...state, staticMenuDesktopInactive: !state.staticMenuDesktopInactive }));
        } else {
            this.state.update(state => ({ ...state, staticMenuMobileActive: !state.staticMenuMobileActive }));
        }
    }

    isOverlay() {
        return this.config().menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigClick() {
        this.state.update(state => ({ ...state, configSidebarVisible: !state.configSidebarVisible }));
    }

    isSidebarVisible() {
        return this.isDesktop() ? !this.state().staticMenuDesktopInactive : this.state().staticMenuMobileActive;
    }
}