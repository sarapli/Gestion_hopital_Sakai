import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsListComponent } from './components/appointments-list/appointments-list.component';

const routes: Routes = [
  { path: '', component: AppointmentsListComponent },
  { path: 'calendar', component: AppointmentsListComponent }, // TODO: Créer le composant calendrier
  { path: 'new', component: AppointmentsListComponent } // TODO: Créer le composant de création
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
