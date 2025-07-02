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

  // Availability data
  selectedDays: string[] = [];
  
  daysOfWeek = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  timeOptions = [
    { value: '08:00', label: '08:00' },
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' },
    { value: '22:00', label: '22:00' }
  ];

  constructor(private fb: FormBuilder) {
    this.settingsProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      numTel: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      gender: ['Otro', Validators.required],
      startTime: ['09:00'],
      endTime: ['17:00'],
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
        });

        // Parse existing availability if it exists
        if (this.user.availability) {
          this.parseAvailability(this.user.availability);
        }
      }
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      toast.error('Error al cargar el perfil.');
    }
  }

  // Parse existing availability string into days and time
  parseAvailability(availability: string) {
    try {
      // Assuming availability is stored as JSON string like:
      // '{"days":["monday","tuesday"],"startTime":"09:00","endTime":"17:00"}'
      const parsed = JSON.parse(availability);
      if (parsed.days) {
        this.selectedDays = parsed.days;
      }
      if (parsed.startTime && parsed.endTime) {
        this.settingsProfileForm.patchValue({
          startTime: parsed.startTime,
          endTime: parsed.endTime
        });
      }
    } catch (error) {
      // If it's not JSON, treat as simple text
      console.warn('Could not parse availability as JSON, treating as text');
    }
  }

  // Handle day selection
  onDayChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const day = target.value;
    
    if (target.checked) {
      if (!this.selectedDays.includes(day)) {
        this.selectedDays.push(day);
      }
    } else {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    }
  }

  // Get text representation of selected days
  getSelectedDaysText(): string {
    const dayLabels = this.selectedDays.map(day => 
      this.daysOfWeek.find(d => d.value === day)?.label
    ).filter(Boolean);
    return dayLabels.join(', ');
  }

  // Get text representation of time range
  getTimeRangeText(): string {
    const startTime = this.settingsProfileForm.get('startTime')?.value;
    const endTime = this.settingsProfileForm.get('endTime')?.value;
    
    const startLabel = this.timeOptions.find(t => t.value === startTime)?.label;
    const endLabel = this.timeOptions.find(t => t.value === endTime)?.label;
    
    return `${startLabel} - ${endLabel}`;
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.settingsProfileForm.get(controlName)?.hasError(errorName) && this.settingsProfileForm.get(controlName)?.touched
  }

  async onSubmit() {
    if (this.settingsProfileForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    // Validate guide availability
    if (this.user?.role === 'guide' && this.selectedDays.length === 0) {
      toast.error('Por favor, selecciona al menos un día de disponibilidad.');
      return;
    }

    const formValue = this.settingsProfileForm.value;
    const formData = new FormData();
    formData.append('first_name', formValue.firstName);
    formData.append('last_name', formValue.lastName);
    formData.append('num_tel', formValue.numTel);
    formData.append('gender', formValue.gender);
    
    // Handle availability for guides
    if (this.user?.role === 'guide') {
      const availability = {
        days: this.selectedDays,
        startTime: formValue.startTime,
        endTime: formValue.endTime
      };
      formData.append('availability', JSON.stringify(availability));
    }

    try {
      const updatedUser = await this.userService.updateProfile(formData);
      this.user = updatedUser;

      if (this.user?.role === 'guide') {
        const availabilityString = JSON.stringify({
          days: this.selectedDays,
          startTime: formValue.startTime,
          endTime: formValue.endTime
        });
        await this.userService.updateAvailability(availabilityString);
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

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const formData = new FormData();
      formData.append('image', input.files[0]);

      try {
        const updatedUser = await this.userService.updateProfile(formData);
        this.user = updatedUser;
        toast.success('Imagen de perfil actualizada con éxito.');
      } catch (error) {
        console.error('Error al actualizar la imagen de perfil:', error);
        toast.error('Error al actualizar la imagen de perfil.');
      }

      input.value = '';
    }
  }

  getImageSource(): string {
    const currentUser = this.user;
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
