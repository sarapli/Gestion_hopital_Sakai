import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Page d'accueil publique
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    data: { title: 'Accueil' }
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    data: { title: 'Accueil' }
  },
  
  // Routes d'authentification (publiques)
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    data: { title: 'Authentification' }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/components/dashboard-main/dashboard-main.component').then(m => m.DashboardMainComponent),
    canActivate: [AuthGuard],
    data: { title: 'Tableau de bord' }
  },
  // Gestion des rendez-vous
  {
    path: 'appointments',
    loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Rendez-vous', role: ['assistant', 'doctor', 'admin'] }
  },
  
  // Gestion des patients
  {
    path: 'patients',
    loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Patients', role: 'doctor' }
  },
  
  // Rapports et statistiques
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [AuthGuard],
    data: { title: 'Rapports' }
  },
  
  // Redirection pour les routes non trouvées
  { path: '**', redirectTo: '' }
];

