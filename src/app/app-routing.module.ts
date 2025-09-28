import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  // Redirige par défaut vers l'authentification
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Module d'auth en lazy-loading (login, register, forgot-password, etc.)
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // Dashboard (accessible après connexion)
  { path: 'dashboard', component: DashboardComponent },

  // Redirection pour routes inconnues
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
