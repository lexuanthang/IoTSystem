import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminDashboardClient } from 'src/app/shared/app-client';

@NgModule({
  declarations: [DashboardComponent], // Khai báo DashboardComponent
  imports: [
    CommonModule,
    RouterModule.forChild([
          {
            path: '',
            component: DashboardComponent,
          },
        ]),
  ],
  exports: [DashboardComponent],
  providers: [AdminDashboardClient]
})
export class DashboardModule { }
