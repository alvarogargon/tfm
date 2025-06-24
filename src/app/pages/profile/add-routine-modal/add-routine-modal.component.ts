import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoutineService } from '../../../services/routine.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-routine-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-routine-modal.component.html',
  styleUrls: ['./add-routine-modal.component.css']
})
export class AddRoutineModalComponent {
  @Output() close = new EventEmitter<void>();
  routineForm: FormGroup;
  routineService = inject(RoutineService);

  constructor(private fb: FormBuilder) {
    this.routineForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      is_template: [false],
      daily_routine: ['Daily', Validators.required],
      start_time: [''],
      end_time: ['']
    });
  }

  async onSubmit() {
    if (this.routineForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    try {
      await this.routineService.createRoutine(this.routineForm.value);
      toast.success('Rutina creada con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al crear rutina:', error);
      toast.error('Error al crear la rutina.');
    }
  }
}