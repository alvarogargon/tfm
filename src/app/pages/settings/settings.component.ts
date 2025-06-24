import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { toast } from 'ngx-sonner';
import { IUser } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settingsForm: FormGroup;
  userService = inject(UserService);

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      availability: [''],
      primary_color: ['#4682B4'],
      secondary_color: ['#708090'],
      accent_color: ['#FFD700']
    });
  }

  async ngOnInit() {
    try {
      const user = await this.userService.getProfile();
      if (user.availability) {
        this.settingsForm.patchValue({ availability: user.availability });
      }
      if (user.colorPalette) {
        this.settingsForm.patchValue({
          primary_color: user.colorPalette.primary,
          secondary_color: user.colorPalette.secondary,
          accent_color: user.colorPalette.accent
        });
      }
    } catch (error) {
      console.error('Error al cargar ajustes:', error);
      toast.error('Error al cargar los ajustes.');
    }
  }

  async onSubmit() {
    if (this.settingsForm.invalid) return;
    try {
      const payload = {
        availability: this.settingsForm.value.availability,
        colorPalette: {
          primary: this.settingsForm.value.primary_color,
          secondary: this.settingsForm.value.secondary_color,
          accent: this.settingsForm.value.accent_color
        }
      };
      const updatedUser = await this.userService.updateProfile(payload);
      this.updateThemeColors(updatedUser.colorPalette);
      toast.success('Ajustes guardados con éxito.');
    } catch (error) {
      console.error('Error al guardar ajustes:', error);
      toast.error('Error al guardar los ajustes.');
    }
  }

  updateThemeColors(palette: IUser['colorPalette']) {
    const root = document.documentElement;
    if (palette.primary) root.style.setProperty('--primary-color', palette.primary);
    if (palette.secondary) root.style.setProperty('--secondary-color', palette.secondary);
    if (palette.accent) root.style.setProperty('--accent-color', palette.accent);
    if (palette.background) root.style.setProperty('--background-color', palette.background);
  }
}