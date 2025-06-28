import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { Error404Component } from './pages/error404/error404.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { RoutineDetailsComponent } from './components/routine-details/routine-details.component';
import { authGuard } from './guards/auth.guard';
import { NuestraMisionComponent } from './shared/infoFooter/nuestra-mision/nuestra-mision.component';
import { EquipoComponent } from './shared/infoFooter/equipo/equipo.component';
import { PoliticaPrivacidadComponent } from './shared/infoFooter/politica-privacidad/politica-privacidad.component';
import { CookiesComponent } from './shared/infoFooter/cookies/cookies.component';
import { AvisoLegalComponent } from './shared/infoFooter/aviso-legal/aviso-legal.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'nuestra-mision', component: NuestraMisionComponent },
  { path: 'equipo', component: EquipoComponent},
  { path: 'politica-de-privacidad', component: PoliticaPrivacidadComponent},
  { path: 'politica-de-cookies', component: CookiesComponent},
  { path: 'aviso-legal', component: AvisoLegalComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard/calendar', component: CalendarPageComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'routines/:id', component: RoutineDetailsComponent, canActivate: [authGuard] },
  { path: '**', component: Error404Component }
];