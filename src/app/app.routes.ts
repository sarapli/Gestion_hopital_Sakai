import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Redirection par défaut vers la page d'accueil
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Page d'accueil publique
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  
  // Routes d'authentification (publiques)
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  
  // Routes protégées par authentification
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
    canActivate: [AuthGuard],
    data: { title: 'Rendez-vous' }
  },
  
  // Gestion des patients
  {
    path: 'patients',
    loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule),
    canActivate: [AuthGuard],
    data: { title: 'Patients' }
  },
  
  
  // Redirection pour les routes non trouvées
  { path: '**', redirectTo: '/home' }
];

