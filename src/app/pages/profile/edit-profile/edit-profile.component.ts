import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../../interfaces/iuser.interface';
import { UserService } from '../../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  editProfileForm: FormGroup;
  user?: IUser;
  userService = inject(UserService);

  constructor(private fb: FormBuilder) {
    this.editProfileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      numTel: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      gender: ['Otro', Validators.required],
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
        this.editProfileForm.patchValue({
          username: this.user.username,
          email: this.user.email,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          age: this.user.age,
          numTel: this.user.numTel,
          gender: this.user.gender,
          availability: this.user.availability || '',
          primaryColor: this.user.colorPalette?.primary || '#007bff',
          secondaryColor: this.user.colorPalette?.secondary || '#6c757d',
          accentColor: this.user.colorPalette?.accent || '#0056b3',
          backgroundColor: this.user.colorPalette?.background || '#ffffff'
        });
        if (this.user.colorPalette) {
          this.setThemeColors(this.user.colorPalette);
        }
        // Deshabilitar el campo availability para usuarios no guías
        if (this.user.role !== 'guide') {
          this.editProfileForm.get('availability')?.disable();
        }
      }
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      toast.error('Error al cargar el perfil.');
    }
  }

  closeModal() {
    this.close.emit();
  }

  setThemeColors(palette: { primary?: string; secondary?: string; accent?: string; background?: string }) {
    const root = document.documentElement;
    if (palette?.primary) root.style.setProperty('--primary-color', palette.primary);
    if (palette?.secondary) root.style.setProperty('--secondary-color', palette.secondary);
    if (palette?.accent) root.style.setProperty('--accent-color', palette.accent);
    if (palette?.background) root.style.setProperty('--background-color', palette.background);
  }

  async onSubmit() {
    if (this.editProfileForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    const formValue = this.editProfileForm.value;
    const formData = new FormData();
    formData.append('username', formValue.username);
    formData.append('email', formValue.email);
    formData.append('first_name', formValue.firstName);
    formData.append('last_name', formValue.lastName);
    formData.append('age', formValue.age.toString());
    formData.append('num_tel', formValue.numTel);
    formData.append('gender', formValue.gender);
    if (formValue.availability && this.user?.role === 'guide') {
      formData.append('availability', formValue.availability);
    }
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
      this.closeModal();
      toast.success('Perfil actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil.');
    }
  }
}