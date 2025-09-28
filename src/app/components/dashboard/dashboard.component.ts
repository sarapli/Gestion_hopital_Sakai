import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend: string;
  trendValue: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statCards: StatCard[] = [];
  chartData: any;
  chartOptions: any;

  constructor() { }

  ngOnInit(): void {
    this.initializeStatCards();
    this.initializeChart();
  }

  initializeStatCards(): void {
    this.statCards = [
      {
        title: 'Utilisateurs totaux',
        value: '1,234',
        icon: 'pi pi-users',
        color: '#007bff',
        trend: 'up',
        trendValue: '+12%'
      },
      {
        title: 'Commandes ce mois',
        value: '456',
        icon: 'pi pi-shopping-cart',
        color: '#28a745',
        trend: 'up',
        trendValue: '+8%'
      },
      {
        title: 'Revenus',
        value: '€12,345',
        icon: 'pi pi-euro',
        color: '#ffc107',
        trend: 'up',
        trendValue: '+15%'
      },
      {
        title: 'Produits vendus',
        value: '789',
        icon: 'pi pi-box',
        color: '#dc3545',
        trend: 'down',
        trendValue: '-3%'
      }
    ];
  }

  initializeChart(): void {
    this.chartData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Ventes',
          data: [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: '#007bff',
          tension: 0.4
        },
        {
          label: 'Utilisateurs',
          data: [28, 48, 40, 19, 86, 27],
          fill: false,
          borderColor: '#28a745',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }
}
