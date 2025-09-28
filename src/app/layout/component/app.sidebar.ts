import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMenuComponent } from './app.menu';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, AppMenuComponent],
    templateUrl: './app.sidebar.html'
})
export class AppSidebarComponent implements OnInit {
    constructor(public layoutService: LayoutService) {}

    ngOnInit(): void {}
}