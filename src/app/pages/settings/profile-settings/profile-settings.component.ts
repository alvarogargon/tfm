import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces/iuser.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-profile-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent {
  settingsProfileForm: FormGroup;
  user?: IUser;
  userService = inject(UserService);

  constructor(private fb: FormBuilder) {
    this.settingsProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      numTel: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      gender: ['Otro', Validators.required],
      availability: [''],
    })
  }

  async ngOnInit() {
    try {
      this.user = await this.userService.getProfile();
      if (this.user) {
        this.settingsProfileForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          numTel: this.user.numTel,
          gender: this.user.gender,
          availability: this.user.availability || ''
        });
      }
      if (this.user.role !== 'guide') {
        this.settingsProfileForm.get('availability')?.disable();
      }
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      toast.error('Error al cargar el perfil.');
    }
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.settingsProfileForm.get(controlName)?.hasError(errorName) && this.settingsProfileForm.get(controlName)?.touched
  }

  async onSubmit() {
    if (this.settingsProfileForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    const formValue = this.settingsProfileForm.value;
    const formData = new FormData();
    formData.append('first_name', formValue.firstName);
    formData.append('last_name', formValue.lastName);
    formData.append('num_tel', formValue.numTel);
    formData.append('gender', formValue.gender);
    if (formValue.availability && this.user?.role === 'guide') {
      formData.append('availability', formValue.availability);
    }

    try {
      const updatedUser = await this.userService.updateProfile(formData);
      this.user = updatedUser;

      if (this.user?.role === 'guide' && formValue.availability) {
        await this.userService.updateAvailability(formValue.availability);
      }

      toast.success('Perfil actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil.');
    }
  }

  phoneValidator(control: AbstractControl) {
    const digits = (control.value || '').replace(/\D/g, '');
    return /^\d{9}$/.test(digits) ? null : { pattern: true };
  }

}
