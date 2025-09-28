import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsListComponent } from './components/appointments-list/appointments-list.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    AppointmentsListComponent
  ]
})
export class AppointmentsModule { }
