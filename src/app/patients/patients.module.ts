import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsListComponent } from './components/patients-list/patients-list.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    PatientsListComponent
  ]
})
export class PatientsModule { }