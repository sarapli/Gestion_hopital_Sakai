import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Appointment, AppointmentStatus, AppointmentType } from '../../../models/appointment.model';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    DialogModule,
    CardModule,
    ToolbarModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="appointments-container">
      <p-card>
        <ng-template pTemplate="header">
          <div class="header-content">
            <h2>Gestion des rendez-vous</h2>
            <p-button 
              label="Nouveau rendez-vous" 
              icon="pi pi-plus" 
              styleClass="p-button-raised"
              (onClick)="openNewAppointmentDialog()"
            ></p-button>
          </div>
        </ng-template>

        <!-- Filtres -->
        <div class="filters-section">
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-3">
              <label for="search">Recherche</label>
              <input 
                id="search" 
                type="text" 
                pInputText 
                placeholder="Nom du patient..."
                [(ngModel)]="searchTerm"
                (input)="filterAppointments()"
              />
            </div>
            <div class="p-field p-col-12 p-md-3">
              <label for="status">Statut</label>
              <p-dropdown 
                id="status"
                [options]="statusOptions"
                [(ngModel)]="selectedStatus"
                placeholder="Tous les statuts"
                (onChange)="filterAppointments()"
              ></p-dropdown>
            </div>
            <div class="p-field p-col-12 p-md-3">
              <label for="type">Type</label>
              <p-dropdown 
                id="type"
                [options]="typeOptions"
                [(ngModel)]="selectedType"
                placeholder="Tous les types"
                (onChange)="filterAppointments()"
              ></p-dropdown>
            </div>
            <div class="p-field p-col-12 p-md-3">
              <label for="date">Date</label>
              <p-calendar 
                id="date"
                [(ngModel)]="selectedDate"
                placeholder="Toutes les dates"
                (onSelect)="filterAppointments()"
                [showIcon]="true"
              ></p-calendar>
            </div>
          </div>
        </div>

        <!-- Tableau des rendez-vous -->
        <p-table 
          [value]="filteredAppointments" 
          [paginator]="true" 
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} rendez-vous"
          [rowsPerPageOptions]="[5, 10, 25]"
          styleClass="p-datatable-sm"
          [loading]="loading"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Patient</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Médecin</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-appointment>
            <tr>
              <td>{{ appointment.date | date:'dd/MM/yyyy' }}</td>
              <td>{{ appointment.startTime }} - {{ appointment.endTime }}</td>
              <td>{{ appointment.patientName }}</td>
              <td>
                <p-tag 
                  [value]="getTypeLabel(appointment.type)" 
                  [severity]="getTypeSeverity(appointment.type)"
                ></p-tag>
              </td>
              <td>
                <p-tag 
                  [value]="getStatusLabel(appointment.status)" 
                  [severity]="getStatusSeverity(appointment.status)"
                ></p-tag>
              </td>
              <td>{{ appointment.doctorName }}</td>
              <td>
                <p-button 
                  icon="pi pi-eye" 
                  [text]="true" 
                  size="small"
                  pTooltip="Voir les détails"
                  (onClick)="viewAppointment(appointment)"
                ></p-button>
                <p-button 
                  icon="pi pi-pencil" 
                  [text]="true" 
                  size="small"
                  pTooltip="Modifier"
                  (onClick)="editAppointment(appointment)"
                ></p-button>
                <p-button 
                  icon="pi pi-trash" 
                  [text]="true" 
                  size="small"
                  pTooltip="Supprimer"
                  (onClick)="deleteAppointment(appointment)"
                  styleClass="p-button-danger"
                ></p-button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center">
                <div class="empty-state">
                  <i class="pi pi-calendar" style="font-size: 3rem; color: #ccc;"></i>
                  <p>Aucun rendez-vous trouvé</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Dialog de détails -->
      <p-dialog 
        header="Détails du rendez-vous" 
        [(visible)]="appointmentDialog" 
        [modal]="true" 
        [style]="{width: '600px'}"
        [closable]="true"
      >
        <div *ngIf="selectedAppointment" class="appointment-details">
          <div class="detail-row">
            <label>Patient:</label>
            <span>{{ selectedAppointment.patientName }}</span>
          </div>
          <div class="detail-row">
            <label>Date et heure:</label>
            <span>{{ selectedAppointment.date | date:'dd/MM/yyyy' }} à {{ selectedAppointment.startTime }}</span>
          </div>
          <div class="detail-row">
            <label>Type:</label>
            <p-tag 
              [value]="getTypeLabel(selectedAppointment.type)" 
              [severity]="getTypeSeverity(selectedAppointment.type)"
            ></p-tag>
          </div>
          <div class="detail-row">
            <label>Statut:</label>
            <p-tag 
              [value]="getStatusLabel(selectedAppointment.status)" 
              [severity]="getStatusSeverity(selectedAppointment.status)"
            ></p-tag>
          </div>
          <div class="detail-row">
            <label>Médecin:</label>
            <span>{{ selectedAppointment.doctorName }}</span>
          </div>
          <div class="detail-row">
            <label>Motif:</label>
            <span>{{ selectedAppointment.reason }}</span>
          </div>
          <div class="detail-row" *ngIf="selectedAppointment.notes">
            <label>Notes:</label>
            <span>{{ selectedAppointment.notes }}</span>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <p-button 
            label="Fermer" 
            icon="pi pi-times" 
            (onClick)="appointmentDialog = false"
            [text]="true"
          ></p-button>
          <p-button 
            label="Modifier" 
            icon="pi pi-pencil" 
            (onClick)="editAppointment(selectedAppointment!)"
          ></p-button>
        </ng-template>
      </p-dialog>

      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
  styles: [`
    .appointments-container {
      padding: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }

    .filters-section {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
    }

    .empty-state p {
      margin-top: 1rem;
      color: #666;
    }

    .appointment-details {
      padding: 1rem 0;
    }

    .detail-row {
      display: flex;
      margin-bottom: 1rem;
      align-items: center;
    }

    .detail-row label {
      font-weight: 600;
      min-width: 120px;
      margin-right: 1rem;
    }

    .detail-row span {
      flex: 1;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .filters-section .p-formgrid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppointmentsListComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  loading = false;
  appointmentDialog = false;
  selectedAppointment: Appointment | null = null;

  // Filtres
  searchTerm = '';
  selectedStatus: AppointmentStatus | null = null;
  selectedType: AppointmentType | null = null;
  selectedDate: Date | null = null;

  statusOptions = [
    { label: 'Programmé', value: 'scheduled' },
    { label: 'Confirmé', value: 'confirmed' },
    { label: 'En cours', value: 'in-progress' },
    { label: 'Terminé', value: 'completed' },
    { label: 'Annulé', value: 'cancelled' },
    { label: 'Absent', value: 'no-show' }
  ];

  typeOptions = [
    { label: 'Consultation', value: 'consultation' },
    { label: 'Suivi', value: 'follow-up' },
    { label: 'Urgence', value: 'emergency' },
    { label: 'Contrôle', value: 'checkup' },
    { label: 'Chirurgie', value: 'surgery' },
    { label: 'Vaccination', value: 'vaccination' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    // Simulation de données
    setTimeout(() => {
      this.appointments = [
        {
          id: '1',
          patientId: 'p1',
          doctorId: 'd1',
          date: new Date('2024-01-15'),
          startTime: '09:00',
          endTime: '09:30',
          duration: 30,
          type: 'consultation',
          status: 'confirmed',
          reason: 'Douleur abdominale',
          patientName: 'Marie Dupont',
          doctorName: 'Dr. Martin',
          notes: 'Patient anxieux',
          followUpRequired: false,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
          createdBy: 'd1'
        },
        {
          id: '2',
          patientId: 'p2',
          doctorId: 'd1',
          date: new Date('2024-01-15'),
          startTime: '10:00',
          endTime: '10:30',
          duration: 30,
          type: 'follow-up',
          status: 'scheduled',
          reason: 'Contrôle post-opératoire',
          patientName: 'Jean Martin',
          doctorName: 'Dr. Martin',
          followUpRequired: true,
          followUpDate: new Date('2024-02-15'),
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
          createdBy: 'd1'
        },
        {
          id: '3',
          patientId: 'p3',
          doctorId: 'd2',
          date: new Date('2024-01-15'),
          startTime: '14:00',
          endTime: '15:00',
          duration: 60,
          type: 'emergency',
          status: 'in-progress',
          reason: 'Urgence cardiaque',
          patientName: 'Sophie Bernard',
          doctorName: 'Dr. Durand',
          followUpRequired: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          createdBy: 'd2'
        }
      ];
      this.filteredAppointments = [...this.appointments];
      this.loading = false;
    }, 1000);
  }

  filterAppointments(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesSearch = !this.searchTerm || 
        (appointment.patientName && appointment.patientName.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesStatus = !this.selectedStatus || appointment.status === this.selectedStatus;
      const matchesType = !this.selectedType || appointment.type === this.selectedType;
      const matchesDate = !this.selectedDate || 
        appointment.date.toDateString() === this.selectedDate.toDateString();
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }

  openNewAppointmentDialog(): void {
    // TODO: Implémenter la création de rendez-vous
    this.messageService.add({
      severity: 'info',
      summary: 'Fonctionnalité à venir',
      detail: 'Création de rendez-vous en cours de développement'
    });
  }

  viewAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.appointmentDialog = true;
  }

  editAppointment(appointment: Appointment): void {
    // TODO: Implémenter l'édition de rendez-vous
    this.messageService.add({
      severity: 'info',
      summary: 'Fonctionnalité à venir',
      detail: 'Modification de rendez-vous en cours de développement'
    });
  }

  deleteAppointment(appointment: Appointment): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le rendez-vous de ${appointment.patientName || 'ce patient'} ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.appointments = this.appointments.filter(a => a.id !== appointment.id);
        this.filterAppointments();
        this.messageService.add({
          severity: 'success',
          summary: 'Rendez-vous supprimé',
          detail: 'Le rendez-vous a été supprimé avec succès'
        });
      }
    });
  }

  getTypeLabel(type: AppointmentType): string {
    const labels: { [key in AppointmentType]: string } = {
      'consultation': 'Consultation',
      'follow-up': 'Suivi',
      'emergency': 'Urgence',
      'surgery': 'Chirurgie',
      'checkup': 'Contrôle',
      'vaccination': 'Vaccination'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: AppointmentStatus): string {
    const labels: { [key in AppointmentStatus]: string } = {
      'scheduled': 'Programmé',
      'confirmed': 'Confirmé',
      'in-progress': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé',
      'no-show': 'Absent'
    };
    return labels[status] || status;
  }

  getTypeSeverity(type: AppointmentType): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {
    const severityMap: { [key in AppointmentType]: "success" | "secondary" | "info" | "warning" | "danger" | "contrast" } = {
      'consultation': 'info',
      'follow-up': 'success',
      'emergency': 'danger',
      'surgery': 'warning',
      'checkup': 'info',
      'vaccination': 'success'
    };
    return severityMap[type] || 'info';
  }

  getStatusSeverity(status: AppointmentStatus): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {
    const severityMap: { [key in AppointmentStatus]: "success" | "secondary" | "info" | "warning" | "danger" | "contrast" } = {
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
