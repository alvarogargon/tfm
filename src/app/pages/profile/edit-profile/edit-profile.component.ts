import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../../interfaces/iuser.interface';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  @Output() close = new EventEmitter<void>();
  editProfileForm: FormGroup;
  user?: IUser;
  userService = inject(UserService);

  async ngOnInit() {
    try {
      this.user = await this.userService.getProfile();
      if (this.user) {
        this.editProfileForm.patchValue({
          username: this.user.username,
          first_name: this.user.firstName
        });
      }
      if (this.user?.colorPalette) {
        this.setThemeColors(this.user.colorPalette);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  constructor(private fb: FormBuilder) {
    this.editProfileForm = this.fb.group({
      username: [this.user?.username || 'Nombre de usuario'],
      first_name: [this.user?.firstName || 'Nombre']
    });
  }

  closeModal() {
    this.close.emit();
  }

  setThemeColors(palette: any) {
    const root = document.documentElement;
    if (palette.primary) root.style.setProperty('--primary-color', palette.primary);
    if (palette.secondary) root.style.setProperty('--secondary-color', palette.secondary);
    if (palette.accent) root.style.setProperty('--accent-color', palette.accent);
    if (palette.background) root.style.setProperty('--background-color', palette.background);
  }
}
