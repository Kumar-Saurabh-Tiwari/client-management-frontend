import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './components/home/home';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ClientDashboard } from './components/client-dashboard/client-dashboard';
import { ClientDetail } from './components/client-detail/client-detail';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { AuthInterceptor } from './core/auth.interceptor';

@NgModule({
  declarations: [
    App,
    Home,
    Header,
    Footer,
    ClientDashboard,
    ClientDetail,
    Login,
    Register
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
