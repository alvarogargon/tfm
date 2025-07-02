import { Component, inject, signal } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { toast } from 'ngx-sonner';
import { UserService } from '../../services/user.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  user = signal<IUser | undefined>(undefined);
  userService = inject(UserService);

  async ngOnInit() {
    await this.loadProfileData();
  }

  async loadProfileData() {
    try {
      const user = await this.userService.getProfile();
      this.user.set(user);
      if (!user || !user.user_id) {
        throw new Error('No se pudo obtener el perfil del usuario.');
      }
    } catch (error) {
          console.error('Error al cargar datos del perfil:', error);
          toast.error('Error al cargar los datos del perfil.');
    }
  }

  getImageSource(): string {
    const currentUser = this.user();
    if (currentUser && currentUser.image) {
      if (currentUser.image.startsWith('http://') || currentUser.image.startsWith('https://')) {
        return currentUser.image;
      } else {
        return `http://localhost:3000${currentUser.image}`;
      }
    }
    return 'https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c668b3120d3d26467b06330c.jpg';
  }
}
