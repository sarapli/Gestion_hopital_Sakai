import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Card3dComponent, Button3dComponent } from '../../../shared/components';

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    TagModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    Card3dComponent,
    Button3dComponent
  ],
  template: `
    <div class="dashboard-container">
      <!-- En-tête du tableau de bord -->
      <div class="dashboard-header">
        <h1>Tableau de bord médical</h1>
        <p>Bienvenue, {{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
      </div>

      <!-- Statistiques rapides -->
      <div class="stats-grid">
        <app-card-3d 
          header="Rendez-vous du jour"
          icon="pi pi-calendar"
          variant="info"
          class="stat-card"
        >
          <div class="stat-content">
            <div class="stat-number">{{ todayAppointments }}</div>
            <div class="stat-label">Consultations prévues</div>
            <div class="stat-trend">
              <i class="pi pi-arrow-up"></i>
              <span>+12% vs hier</span>
            </div>
          </div>
        </app-card-3d>

        <app-card-3d 
          header="Patients"
          icon="pi pi-users"
          variant="success"
          class="stat-card"
        >
          <div class="stat-content">
            <div class="stat-number">{{ totalPatients }}</div>
            <div class="stat-label">Patients enregistrés</div>
            <div class="stat-trend">
              <i class="pi pi-arrow-up"></i>
              <span>+5% ce mois</span>
            </div>
          </div>
        </app-card-3d>

        <app-card-3d 
          header="En attente"
          icon="pi pi-clock"
          variant="warning"
          class="stat-card"
        >
          <div class="stat-content">
            <div class="stat-number">{{ pendingAppointments }}</div>
            <div class="stat-label">Rendez-vous en attente</div>
            <div class="stat-trend">
              <i class="pi pi-arrow-down"></i>
              <span>-3% vs hier</span>
            </div>
          </div>
        </app-card-3d>

        <app-card-3d 
          header="Consultations terminées"
          icon="pi pi-check-circle"
          variant="danger"
          class="stat-card"
        >
          <div class="stat-content">
            <div class="stat-number">{{ completedAppointments }}</div>
            <div class="stat-label">Rendez-vous terminés</div>
            <div class="stat-trend">
              <i class="pi pi-arrow-up"></i>
              <span>+8% vs mois dernier</span>
            </div>
          </div>
        </app-card-3d>
      </div>

      <!-- Graphiques et tableaux -->
      <div class="dashboard-content">
        <!-- Graphique des rendez-vous par mois -->
        <div class="chart-section">
          <p-card>
            <ng-template pTemplate="header">
              <h3>Rendez-vous par mois</h3>
            </ng-template>
            <p-chart 
              type="line" 
              [data]="appointmentsChartData" 
              [options]="chartOptions"
              height="300px"
            ></p-chart>
          </p-card>
        </div>

        <!-- Rendez-vous du jour -->
        <div class="appointments-section">
          <p-card>
            <ng-template pTemplate="header">
              <div class="section-header">
                <h3>Rendez-vous d'aujourd'hui</h3>
                <p-button 
                  label="Voir tout" 
                  icon="pi pi-arrow-right" 
                  [text]="true"
                  routerLink="/appointments"
                ></p-button>
              </div>
            </ng-template>
            <p-table 
              [value]="todayAppointmentsList" 
              [paginator]="false"
              [rows]="5"
              styleClass="p-datatable-sm"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Heure</th>
                  <th>Patient</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-appointment>
                <tr>
                  <td>{{ appointment.startTime }}</td>
                  <td>{{ appointment.patientName }}</td>
                  <td>
                    <p-tag 
                      [value]="appointment.type" 
                      [severity]="getTypeSeverity(appointment.type)"
                    ></p-tag>
                  </td>
                  <td>
                    <p-tag 
                      [value]="appointment.status" 
                      [severity]="getStatusSeverity(appointment.status)"
                    ></p-tag>
                  </td>
                  <td>
                    <p-button 
                      icon="pi pi-eye" 
                      [text]="true" 
                      size="small"
                      pTooltip="Voir les détails"
                    ></p-button>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="quick-actions">
        <p-card>
          <ng-template pTemplate="header">
            <h3>Actions rapides</h3>
          </ng-template>
          <div class="actions-grid">
            <p-button 
              label="Nouveau rendez-vous" 
              icon="pi pi-plus" 
              styleClass="p-button-raised"
              routerLink="/appointments/new"
            ></p-button>
            <p-button 
              label="Nouveau patient" 
              icon="pi pi-user-plus" 
              styleClass="p-button-raised p-button-success"
              routerLink="/patients/new"
            ></p-button>
            <p-button 
              label="Voir calendrier" 
              icon="pi pi-calendar" 
              styleClass="p-button-raised p-button-info"
              routerLink="/appointments/calendar"
            ></p-button>
            <p-button 
              label="Rapports" 
              icon="pi pi-chart-bar" 
              styleClass="p-button-raised p-button-warning"
              routerLink="/reports"
            ></p-button>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      position: relative;
    }

    .dashboard-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    .dashboard-header {
      margin-bottom: 2rem;
      text-align: center;
      position: relative;
      z-index: 10;
    }

    .dashboard-header h1 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      animation: slideInDown 0.8s ease-out;
    }

    .dashboard-header p {
      color: #7f8c8d;
      font-size: 1.1rem;
      animation: slideInUp 0.8s ease-out 0.2s both;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
      position: relative;
      z-index: 10;
    }

    .stat-card {
      animation: slideInUp 0.6s ease-out;
      animation-fill-mode: both;
    }

    .stat-card:nth-child(1) { animation-delay: 0.1s; }
    .stat-card:nth-child(2) { animation-delay: 0.2s; }
    .stat-card:nth-child(3) { animation-delay: 0.3s; }
    .stat-card:nth-child(4) { animation-delay: 0.4s; }

    .stat-content {
      text-align: center;
      padding: 1.5rem;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: countUp 1s ease-out;
    }

    .stat-label {
      color: #6b7280;
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 20px;
      color: #667eea;
    }

    .stat-trend i {
      font-size: 0.75rem;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      position: relative;
      z-index: 10;
    }

    .chart-section, .table-section {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      animation: slideInUp 0.8s ease-out 0.5s both;
    }

    .chart-section:hover, .table-section:hover {
      transform: translateY(-4px);
      box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.15),
        0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-header h3::before {
      content: '';
      width: 4px;
      height: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }

    .quick-actions {
      margin-top: 2rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes countUp {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      
      .dashboard-content {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .stat-number {
        font-size: 2.5rem;
      }
      
      .chart-section, .table-section {
        padding: 1.5rem;
      }
    }
  `]
})
export class DashboardMainComponent implements OnInit {
  currentUser: User | null = null;
  
  // Statistiques
  todayAppointments = 8;
  totalPatients = 1247;
  pendingAppointments = 12;
  completedAppointments = 156;

  // Données du graphique
  appointmentsChartData: any;
  chartOptions: any;

  // Rendez-vous du jour
  todayAppointmentsList = [
    { startTime: '09:00', patientName: 'Marie Dupont', type: 'consultation', status: 'confirmed' },
    { startTime: '10:30', patientName: 'Jean Martin', type: 'follow-up', status: 'confirmed' },
    { startTime: '14:00', patientName: 'Sophie Bernard', type: 'checkup', status: 'scheduled' },
    { startTime: '15:30', patientName: 'Pierre Durand', type: 'consultation', status: 'confirmed' },
    { startTime: '16:00', patientName: 'Anne Moreau', type: 'emergency', status: 'in-progress' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.initializeChart();
  }

  private initializeChart(): void {
    this.appointmentsChartData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Rendez-vous',
          data: [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: '#2196F3',
          tension: 0.4
        },
        {
          label: 'Patients',
          data: [28, 48, 40, 19, 86, 27],
          fill: false,
          borderColor: '#4CAF50',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  getTypeSeverity(type: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {
    const severityMap: { [key: string]: "success" | "secondary" | "info" | "warning" | "danger" | "contrast" } = {
      'consultation': 'info',
      'follow-up': 'success',
      'emergency': 'danger',
      'checkup': 'warning',
      'surgery': 'secondary'
    };
    return severityMap[type] || 'info';
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {
    const severityMap: { [key: string]: "success" | "secondary" | "info" | "warning" | "danger" | "contrast" } = {
      'scheduled': 'info',
      'confirmed': 'success',
      'in-progress': 'warning',
      'completed': 'success',
      'cancelled': 'danger',
      'no-show': 'secondary'
    };
    return severityMap[status] || 'info';
  }
}
