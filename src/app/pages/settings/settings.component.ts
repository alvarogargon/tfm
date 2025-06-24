import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  userService = inject(UserService);
  user?: IUser;

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      availability: [''],
      primaryColor: ['#007bff'],
      secondaryColor: ['#6c757d'],
      accentColor: ['#0056b3'],
      backgroundColor: ['#ffffff']
    });
  }

  async ngOnInit() {
    try {
      this.user = await this.userService.getProfile();
      if (this.user) {
        this.settingsForm.patchValue({
          availability: this.user.availability || '',
          primaryColor: this.user.colorPalette?.primary || '#007bff',
          secondaryColor: this.user.colorPalette?.secondary || '#6c757d',
          accentColor: this.user.colorPalette?.accent || '#0056b3',
          backgroundColor: this.user.colorPalette?.background || '#ffffff'
        });
        if (this.user.colorPalette) {
          this.setThemeColors(this.user.colorPalette);
        }
      }
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      toast.error('Error al cargar la configuración.');
    }
  }

  async onSubmit() {
    if (this.settingsForm.invalid) {
      toast.error('Por favor, completa los campos requeridos correctamente.');
      return;
    }

    const formValue = this.settingsForm.value;
    const formData = new FormData();
    if (formValue.availability && this.user?.role === 'guide') {
      formData.append('availability', formValue.availability);
    }
    formData.append('colorPalette', JSON.stringify({
      primary: formValue.primaryColor,
      secondary: formValue.secondaryColor,
      accent: formValue.accentColor,
      background: formValue.backgroundColor
    }));

    try {
      const updatedUser = await this.userService.updateProfile(formData);
      this.user = updatedUser;
      if (updatedUser.colorPalette) {
        this.setThemeColors(updatedUser.colorPalette);
      }
      toast.success('Configuración actualizada con éxito.');
    } catch (error) {
      console.error('Error al actualizar la configuración:', error);
      toast.error('Error al actualizar la configuración.');
    }
  }

  setThemeColors(palette: { primary?: string; secondary?: string; accent?: string; background?: string }) {
    const root = document.documentElement;
    if (palette?.primary) root.style.setProperty('--primary-color', palette.primary);
    if (palette?.secondary) root.style.setProperty('--secondary-color', palette.secondary);
    if (palette?.accent) root.style.setProperty('--accent-color', palette.accent);
    if (palette?.background) root.style.setProperty('--background-color', palette.background);
  }
}