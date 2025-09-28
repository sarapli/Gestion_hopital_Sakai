import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-config',
    standalone: true,
    imports: [CommonModule, SidebarModule, ButtonModule, InputSwitchModule, FormsModule],
    templateUrl: './app.configurator.html'
})
export class AppConfigComponent implements OnInit {
    constructor(public layoutService: LayoutService) {}

    ngOnInit(): void {}

    onConfigClick() {
        this.layoutService.onConfigClick();
    }
}