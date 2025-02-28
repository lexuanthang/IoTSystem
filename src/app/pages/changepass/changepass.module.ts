import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangePassComponent } from './changepass.component';
import { NgbDatepickerModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminReportClient } from 'src/app/shared/app-client';


@NgModule({
  declarations: [ChangePassComponent],
  imports: [
    CommonModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChangePassComponent,
      },
    ]),
  ],
  providers: [AdminReportClient]
})
export class ChangePassModule {}
