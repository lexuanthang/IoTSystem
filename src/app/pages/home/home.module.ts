import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardClient } from 'src/app/shared/app-client';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
  providers: [AdminDashboardClient]
})
export class HomeModule {}
