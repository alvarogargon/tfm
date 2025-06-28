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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  async ngOnInit() {
    try {
      this.user = await this.userService.getProfile();
      if (this.user) {
        this.editProfileForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName
        });
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

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.editProfileForm.get(controlName)?.hasError(errorName) && this.editProfileForm.get(controlName)?.touched
  }

  async onSubmit() {
    if (this.editProfileForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    const formValue = this.editProfileForm.value;
    const formData = new FormData();
    formData.append('first_name', formValue.firstName);
    formData.append('last_name', formValue.lastName);

    try {
      const updatedUser = await this.userService.updateProfile(formData);
      this.user = updatedUser;
      this.closeModal();
      toast.success('Perfil actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil.');
    }
  }
}