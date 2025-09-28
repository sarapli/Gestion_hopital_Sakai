import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    CardModule,
    ToolbarModule,
    ConfirmDialogModule,
    TagModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="patients-container">
      <p-card>
        <ng-template pTemplate="header">
          <div class="header-content">
            <h2>Gestion des patients</h2>
            <p-button 
              label="Nouveau patient" 
              icon="pi pi-plus" 
              styleClass="p-button-raised p-button-success"
              (onClick)="openNewPatientDialog()"
            ></p-button>
          </div>
        </ng-template>

        <!-- Filtres -->
        <div class="filters-section">
          <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-4">
              <label for="search">Recherche</label>
              <input 
                id="search" 
                type="text" 
                pInputText 
                placeholder="Nom, prénom, téléphone..."
                [(ngModel)]="searchTerm"
                (input)="filterPatients()"
              />
            </div>
            <div class="p-field p-col-12 p-md-4">
              <label for="gender">Sexe</label>
              <p-dropdown 
                id="gender"
                [options]="genderOptions"
                [(ngModel)]="selectedGender"
                placeholder="Tous"
                (onChange)="filterPatients()"
              ></p-dropdown>
            </div>
            <div class="p-field p-col-12 p-md-4">
              <label for="ageRange">Tranche d'âge</label>
              <p-dropdown 
                id="ageRange"
                [options]="ageRangeOptions"
                [(ngModel)]="selectedAgeRange"
                placeholder="Toutes"
                (onChange)="filterPatients()"
              ></p-dropdown>
            </div>
          </div>
        </div>

        <!-- Tableau des patients -->
        <p-table 
          [value]="filteredPatients" 
          [paginator]="true" 
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} patients"
          [rowsPerPageOptions]="[5, 10, 25]"
          styleClass="p-datatable-sm"
          [loading]="loading"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Nom complet</th>
              <th>Date de naissance</th>
              <th>Âge</th>
              <th>Sexe</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-patient>
            <tr>
              <td>{{ patient.firstName }} {{ patient.lastName }}</td>
              <td>{{ patient.dateOfBirth | date:'dd/MM/yyyy' }}</td>
              <td>{{ calculateAge(patient.dateOfBirth) }} ans</td>
              <td>
                <p-tag 
                  [value]="getGenderLabel(patient.gender)" 
                  [severity]="getGenderSeverity(patient.gender)"
                ></p-tag>
              </td>
              <td>{{ patient.phone }}</td>
              <td>{{ patient.email || '-' }}</td>
              <td>
                <p-tag 
                  [value]="patient.isActive ? 'Actif' : 'Inactif'" 
                  [severity]="patient.isActive ? 'success' : 'danger'"
                ></p-tag>
              </td>
              <td>
                <p-button 
                  icon="pi pi-eye" 
                  [text]="true" 
                  size="small"
                  pTooltip="Voir le dossier"
                  (onClick)="viewPatient(patient)"
                ></p-button>
                <p-button 
                  icon="pi pi-pencil" 
                  [text]="true" 
                  size="small"
                  pTooltip="Modifier"
                  (onClick)="editPatient(patient)"
                ></p-button>
                <p-button 
                  icon="pi pi-calendar" 
                  [text]="true" 
                  size="small"
                  pTooltip="Nouveau rendez-vous"
                  (onClick)="createAppointment(patient)"
                ></p-button>
                <p-button 
                  icon="pi pi-trash" 
                  [text]="true" 
                  size="small"
                  pTooltip="Supprimer"
                  (onClick)="deletePatient(patient)"
                  styleClass="p-button-danger"
                ></p-button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center">
                <div class="empty-state">
                  <i class="pi pi-users" style="font-size: 3rem; color: #ccc;"></i>
                  <p>Aucun patient trouvé</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Dialog de détails du patient -->
      <p-dialog 
        header="Dossier patient" 
        [(visible)]="patientDialog" 
        [modal]="true" 
        [style]="{width: '800px'}"
        [closable]="true"
      >
        <div *ngIf="selectedPatient" class="patient-details">
          <div class="patient-header">
            <div class="patient-info">
              <h3>{{ selectedPatient.firstName }} {{ selectedPatient.lastName }}</h3>
              <p>{{ calculateAge(selectedPatient.dateOfBirth) }} ans • {{ getGenderLabel(selectedPatient.gender) }}</p>
            </div>
            <p-tag 
              [value]="selectedPatient.isActive ? 'Actif' : 'Inactif'" 
              [severity]="selectedPatient.isActive ? 'success' : 'danger'"
            ></p-tag>
          </div>

          <div class="patient-sections">
            <div class="section">
              <h4>Informations personnelles</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Date de naissance:</label>
                  <span>{{ selectedPatient.dateOfBirth | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="info-item">
                  <label>Téléphone:</label>
                  <span>{{ selectedPatient.phone }}</span>
                </div>
                <div class="info-item">
                  <label>Email:</label>
                  <span>{{ selectedPatient.email || 'Non renseigné' }}</span>
                </div>
                <div class="info-item">
                  <label>Adresse:</label>
                  <span>{{ getFullAddress(selectedPatient.address) }}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h4>Contact d'urgence</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Nom:</label>
                  <span>{{ selectedPatient.emergencyContact.name }}</span>
                </div>
                <div class="info-item">
                  <label>Relation:</label>
                  <span>{{ selectedPatient.emergencyContact.relationship }}</span>
                </div>
                <div class="info-item">
                  <label>Téléphone:</label>
                  <span>{{ selectedPatient.emergencyContact.phone }}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h4>Antécédents médicaux</h4>
              <div class="medical-info">
                <div class="info-item">
                  <label>Allergies:</label>
                  <span>{{ selectedPatient.medicalHistory.allergies.join(', ') || 'Aucune' }}</span>
                </div>
                <div class="info-item">
                  <label>Médicaments:</label>
                  <span>{{ selectedPatient.medicalHistory.medications.join(', ') || 'Aucun' }}</span>
                </div>
                <div class="info-item">
                  <label>Conditions chroniques:</label>
                  <span>{{ selectedPatient.medicalHistory.chronicConditions.join(', ') || 'Aucune' }}</span>
                </div>
                <div class="info-item">
                  <label>Notes:</label>
                  <span>{{ selectedPatient.medicalHistory.notes || 'Aucune note' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <p-button 
            label="Fermer" 
            icon="pi pi-times" 
            (onClick)="patientDialog = false"
            [text]="true"
          ></p-button>
          <p-button 
            label="Modifier" 
            icon="pi pi-pencil" 
            (onClick)="editPatient(selectedPatient!)"
          ></p-button>
          <p-button 
            label="Nouveau rendez-vous" 
            icon="pi pi-calendar" 
            (onClick)="createAppointment(selectedPatient!)"
            styleClass="p-button-success"
          ></p-button>
        </ng-template>
      </p-dialog>

      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
  styles: [`
    .patients-container {
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

    .patient-details {
      padding: 1rem 0;
    }

    .patient-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    .patient-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .patient-info p {
      margin: 0;
      color: #666;
    }

    .patient-sections {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .section h4 {
      margin: 0 0 1rem 0;
      color: #333;
      border-bottom: 2px solid #2196F3;
      padding-bottom: 0.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-item label {
      font-weight: 600;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .info-item span {
      color: #333;
    }

    .medical-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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

      .patient-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  loading = false;
  patientDialog = false;
  selectedPatient: Patient | null = null;

  // Filtres
  searchTerm = '';
  selectedGender: 'male' | 'female' | 'other' | null = null;
  selectedAgeRange: string | null = null;

  genderOptions = [
    { label: 'Homme', value: 'male' },
    { label: 'Femme', value: 'female' },
    { label: 'Autre', value: 'other' }
  ];

  ageRangeOptions = [
    { label: '0-18 ans', value: '0-18' },
    { label: '19-35 ans', value: '19-35' },
    { label: '36-50 ans', value: '36-50' },
    { label: '51-65 ans', value: '51-65' },
    { label: '65+ ans', value: '65+' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    // Simulation de données
    setTimeout(() => {
      this.patients = [
        {
          id: '1',
          firstName: 'Marie',
          lastName: 'Dupont',
          dateOfBirth: new Date('1985-03-15'),
          gender: 'female',
          phone: '+33 1 23 45 67 89',
          email: 'marie.dupont@email.com',
          address: {
            street: '123 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          },
          emergencyContact: {
            name: 'Jean Dupont',
            relationship: 'Époux',
            phone: '+33 1 23 45 67 90'
          },
          medicalHistory: {
            allergies: ['Pénicilline'],
            medications: ['Paracétamol'],
            chronicConditions: ['Hypertension'],
            previousSurgeries: ['Appendicectomie'],
            familyHistory: ['Diabète'],
            notes: 'Patient suivie régulièrement'
          },
          createdAt: new Date('2020-01-15'),
          updatedAt: new Date('2024-01-10'),
          isActive: true
        },
        {
          id: '2',
          firstName: 'Jean',
          lastName: 'Martin',
          dateOfBirth: new Date('1978-07-22'),
          gender: 'male',
          phone: '+33 1 23 45 67 91',
          email: 'jean.martin@email.com',
          address: {
            street: '456 Avenue des Champs',
            city: 'Lyon',
            postalCode: '69001',
            country: 'France'
          },
          emergencyContact: {
            name: 'Sophie Martin',
            relationship: 'Épouse',
            phone: '+33 1 23 45 67 92'
          },
          medicalHistory: {
            allergies: [],
            medications: [],
            chronicConditions: [],
            previousSurgeries: [],
            familyHistory: [],
            notes: 'Patient en bonne santé'
          },
          createdAt: new Date('2021-03-10'),
          updatedAt: new Date('2024-01-05'),
          isActive: true
        }
      ];
      this.filteredPatients = [...this.patients];
      this.loading = false;
    }, 1000);
  }

  filterPatients(): void {
    this.filteredPatients = this.patients.filter(patient => {
      const matchesSearch = !this.searchTerm || 
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.phone.includes(this.searchTerm);
      const matchesGender = !this.selectedGender || patient.gender === this.selectedGender;
      const matchesAge = !this.selectedAgeRange || this.isInAgeRange(patient.dateOfBirth, this.selectedAgeRange);
      
      return matchesSearch && matchesGender && matchesAge;
    });
  }

  isInAgeRange(dateOfBirth: Date, ageRange: string): boolean {
    const age = this.calculateAge(dateOfBirth);
    switch (ageRange) {
      case '0-18': return age >= 0 && age <= 18;
      case '19-35': return age >= 19 && age <= 35;
      case '36-50': return age >= 36 && age <= 50;
      case '51-65': return age >= 51 && age <= 65;
      case '65+': return age >= 65;
      default: return true;
    }
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  openNewPatientDialog(): void {
    // TODO: Implémenter la création de patient
    this.messageService.add({
      severity: 'info',
      summary: 'Fonctionnalité à venir',
      detail: 'Création de patient en cours de développement'
    });
  }

  viewPatient(patient: Patient): void {
    this.selectedPatient = patient;
    this.patientDialog = true;
  }

  editPatient(patient: Patient): void {
    // TODO: Implémenter l'édition de patient
    this.messageService.add({
      severity: 'info',
      summary: 'Fonctionnalité à venir',
      detail: 'Modification de patient en cours de développement'
    });
  }

  createAppointment(patient: Patient): void {
    // TODO: Implémenter la création de rendez-vous pour un patient
    this.messageService.add({
      severity: 'info',
      summary: 'Fonctionnalité à venir',
      detail: `Création de rendez-vous pour ${patient.firstName} ${patient.lastName} en cours de développement`
    });
  }

  deletePatient(patient: Patient): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le patient ${patient.firstName} ${patient.lastName} ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.patients = this.patients.filter(p => p.id !== patient.id);
        this.filterPatients();
        this.messageService.add({
          severity: 'success',
          summary: 'Patient supprimé',
          detail: 'Le patient a été supprimé avec succès'
        });
      }
    });
  }

  getGenderLabel(gender: 'male' | 'female' | 'other'): string {
    const labels = {
      'male': 'Homme',
      'female': 'Femme',
      'other': 'Autre'
    };
    return labels[gender];
  }

  getGenderSeverity(gender: 'male' | 'female' | 'other'): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {
    const severityMap: { [key in 'male' | 'female' | 'other']: "success" | "secondary" | "info" | "warning" | "danger" | "contrast" } = {
      'male': 'info',
      'female': 'success',
      'other': 'warning'
    };
    return severityMap[gender];
  }

  getFullAddress(address: any): string {
    return `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
  }
}
