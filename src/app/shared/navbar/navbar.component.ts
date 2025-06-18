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
  showMenu = false;

  async ngOnInit() {
    try {
      this.user = await this.userService.getProfile();
      if (this.user?.colorPalette) {
        this.setThemeColors(this.user.colorPalette);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  toggleMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  goToProfile(event: MouseEvent) {
    event.preventDefault();
    this.showMenu = false;
    this.router.navigate(['/profile']);
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    this.showMenu = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  setThemeColors(palette: any) {
    const root = document.documentElement;
    if (palette.primary) root.style.setProperty('--primary-color', palette.primary);
    if (palette.secondary) root.style.setProperty('--secondary-color', palette.secondary);
    if (palette.accent) root.style.setProperty('--accent-color', palette.accent);
    if (palette.background) root.style.setProperty('--background-color', palette.background);
  }

  constructor() {
    document.addEventListener('click', () => {
      this.showMenu = false;
    })
  }

}
