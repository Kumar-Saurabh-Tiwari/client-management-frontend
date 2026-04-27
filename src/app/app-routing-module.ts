import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDashboard } from './components/client-dashboard/client-dashboard';
import { ClientDetail } from './components/client-detail/client-detail';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'clients'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'clients',
    component: ClientDashboard,
    canActivate: [AuthGuard]
  },
  {
    path: 'client-details/:id',
    component: ClientDetail,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'clients'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
