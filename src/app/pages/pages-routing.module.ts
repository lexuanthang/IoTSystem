import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { DashboardComponent } from './dashboards/dashboard.component'

const routes: Routes = [
  { path: '', redirectTo: 'home' },
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./dashboards/dashboard.module').then((m) => m.DashboardModule)},
  { path: 'home', canActivate: [AuthGuard], loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)},
  { path: 'changepassword', canActivate: [AuthGuard], loadChildren: () => import('./changepass/changepass.module').then((m) => m.ChangePassModule),},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
