import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../../interfaces/iuser.interface';
import { UserService } from '../../../services/user.service';
import { toast } from 'ngx-sonner';

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
          first_name: this.user.firstName,
          last_name: this.user.lastName
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
      first_name: [this.user?.firstName || 'Nombre'],
      last_name: [this.user?.lastName || 'Apellidos']
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

  async onSubmit() {
    if (this.editProfileForm.invalid) return;

    const formValue = this.editProfileForm.value;

    const payload: any = {
      first_name: formValue.first_name,
      last_name: formValue.last_name
    };

    try {
      const updatedUser = await this.userService.updateProfile(payload);
      this.user = updatedUser;
      this.closeModal();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile.')
    }
  }
  
}
