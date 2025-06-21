import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { Error404Component } from './pages/error404/error404.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "home" },
    { path: "home", component: HomeComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "dashboard", component: DashboardComponent, canActivate: [loginGuard], children: 
        [
            { path: "", pathMatch: "full", redirectTo: "usuario"},
            { path: "profile", component: ProfileComponent},
            // { path: "empleado/new", component: EmpleadosFormComponent},
            // { path: "empleado/:idEmployee", component: EmpleadosViewComponent},
            // { path: "empleado/update/:idEmployee", component: EmpleadosFormComponent}
        ]
    },




    { path: "profile", component: ProfileComponent },
    { path: "**", component: Error404Component}
];
