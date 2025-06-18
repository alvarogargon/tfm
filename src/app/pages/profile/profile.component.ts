import { Component, inject } from '@angular/core';
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { IUser } from '../../interfaces/iuser.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [EditProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showEditForm = false;
  user?: IUser;
  userService = inject(UserService);

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

  setThemeColors(palette: any) {
    const root = document.documentElement;
    if (palette.primary) root.style.setProperty('--primary-color', palette.primary);
    if (palette.secondary) root.style.setProperty('--secondary-color', palette.secondary);
    if (palette.accent) root.style.setProperty('--accent-color', palette.accent);
    if (palette.background) root.style.setProperty('--background-color', palette.background);
  }
}
