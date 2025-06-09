import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  router = inject(Router);
  auth = inject(AuthService);

  isDashboard(): boolean {
    return this.router.url.startsWith('/dashboard');
  }

  isProfile(): boolean {
    return this.router.url.startsWith('/profile');
  }

}
