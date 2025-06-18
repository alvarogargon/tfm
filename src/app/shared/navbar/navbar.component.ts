import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  router = inject(Router);
  auth = inject(AuthService);
  userService = inject(UserService);
  user?: IUser;

  async ngOnInit() {
    try {
      this.user = await this.userService.getProfile();
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  isDashboard(): boolean {
    return this.router.url.startsWith('/dashboard');
  }

  isProfile(): boolean {
    return this.router.url.startsWith('/profile');
  }

}
