import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser.interface';
import { Subscription } from 'rxjs';

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
  private loginSub?: Subscription;

  async ngOnInit() {
    await this.loadProfile();
    this.loginSub = this.auth.loginStatus$.subscribe(() => {
      this.loadProfile();
    });
  }

  async loadProfile() {
    try {
      this.user = await this.userService.getProfile();
      if (this.user?.colorPalette) {
        this.setThemeColors(this.user.colorPalette);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  ngOnDestroy() {
    this.loginSub?.unsubscribe();
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

  // --- NUEVA FUNCIÓN PARA LA IMAGEN DE PERFIL EN NAVBAR ---
  getImageSource(): string {
    // Si el usuario no existe o no tiene una imagen, retorna la imagen por defecto
    if (!this.user || !this.user.image) {
      return 'https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg';
    }

    const imageUrl = this.user.image;

    // Si la URL de la imagen ya empieza con http:// o https://, es una URL absoluta (ej. de Cloudinary)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    } else {
      // Si no es una URL absoluta, asumimos que es una ruta relativa de tu servidor local
      // y la prefijamos con 'http://localhost:3000'
      return `http://localhost:3000${imageUrl}`;
    }
  }

  constructor() {
    document.addEventListener('click', () => {
      this.showMenu = false;
    })
  }

}
