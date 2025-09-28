import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppTopbarComponent } from './component/app.topbar';
import { AppSidebarComponent } from './component/app.sidebar';
import { AppFooterComponent } from './component/app.footer';
import { AppMenuComponent } from './component/app.menu';
import { AppConfigComponent } from './component/app.configurator';
import { LayoutService } from './service/layout.service';
import { ParticlesComponent } from '../shared/components';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        AppTopbarComponent,
        AppSidebarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppConfigComponent,
        ParticlesComponent
    ],
    templateUrl: './app.layout.html'
})
export class AppLayoutComponent implements OnInit {
    constructor(public layoutService: LayoutService) {}

    ngOnInit(): void {
        // Initialization logic
    }
}

