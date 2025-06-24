import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../../services/activity.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-activity-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-activity-modal.component.html',
  styleUrls: ['./add-activity-modal.component.css']
})
export class AddActivityModalComponent {
  @Input() routineId!: number;
  @Output() close = new EventEmitter<void>();
  activityForm: FormGroup;
  activityService = inject(ActivityService);

  constructor(private fb: FormBuilder) {
    this.activityForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      datetime_start: ['', Validators.required],
      datetime_end: ['', Validators.required],
      day_of_week: [''],
      location: [''],
      icon: ['']
    });
  }

  async onSubmit() {
    if (this.activityForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    try {
      const activity = { ...this.activityForm.value, routine_id: this.routineId };
      await this.activityService.createActivity(activity);
      toast.success('Actividad creada con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al crear actividad:', error);
      toast.error('Error al crear la actividad.');
    }
  }
}