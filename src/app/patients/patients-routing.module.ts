import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsListComponent } from './components/patients-list/patients-list.component';

const routes: Routes = [
  { path: '', component: PatientsListComponent },
  { path: 'new', component: PatientsListComponent } // TODO: Créer le composant de création
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
