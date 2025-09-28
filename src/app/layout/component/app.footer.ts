import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './app.footer.html'
})
export class AppFooterComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}