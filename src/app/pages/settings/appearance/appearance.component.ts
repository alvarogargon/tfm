import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../../interfaces/iuser.interface';
import { UserService } from '../../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-appearance',
  imports: [ReactiveFormsModule],
  templateUrl: './appearance.component.html',
  styleUrl: './appearance.component.css'
})
export class AppearanceComponent {
  editAppearanceForm: FormGroup;
  user?: IUser;
  userService = inject(UserService);

  constructor(private fb: FormBuilder) {
    this.editAppearanceForm = this.fb.group({
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
        this.editAppearanceForm.patchValue({
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
      toast.error('Error al cargar el perfil.');
    }
  }

  setThemeColors(palette: { primary?: string; secondary?: string; accent?: string; background?: string }) {
    const root = document.documentElement;
    if (palette?.primary) root.style.setProperty('--primary-color', palette.primary);
    if (palette?.secondary) root.style.setProperty('--secondary-color', palette.secondary);
    if (palette?.accent) root.style.setProperty('--accent-color', palette.accent);
    if (palette?.background) root.style.setProperty('--background-color', palette.background);
  }

  async onSubmit() {
    if (this.editAppearanceForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    const formValue = this.editAppearanceForm.value;
    const formData = new FormData();
    formData.append('color_palette', JSON.stringify({
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
      toast.success('Perfil actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil.');
    }
  }

  async resetToDefault() {
    const defaultColors = {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#0056b3',
      background: '#ffffff'
    };

    this.editAppearanceForm.patchValue({
      primaryColor: defaultColors.primary,
      secondaryColor: defaultColors.secondary,
      accentColor: defaultColors.accent,
      backgroundColor: defaultColors.background
    });

    this.setThemeColors(defaultColors);

    const formData = new FormData();
    formData.append('color_palette', JSON.stringify(defaultColors));

    try {
      const updatedUser = await this.userService.updateProfile(formData);
      this.user = updatedUser;
      toast.success('Tema restablecido a los valores por defecto.');
    } catch (error) {
      console.error('Error al restablecer el tema:', error);
      toast.error('Error al restablecer el tema.');
    }
  }
}

