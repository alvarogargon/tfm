import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoutineService } from '../../../services/routine.service';
import { IRoutine, IRoutinePayload } from '../../../interfaces/iroutine.interface';
import { toast } from 'ngx-sonner';
import { IGuideUser } from '../../../interfaces/iguide-user.interface';

@Component({
  selector: 'app-edit-routine-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-routine-modal.component.html',
  styleUrls: ['./edit-routine-modal.component.css']
})
export class EditRoutineModalComponent implements OnInit {
  @Input() routine!: IRoutine;
  @Input() guideUserRelations: IGuideUser[] = [];
  @Input() selectedUserId!: number | null;
  @Output() close = new EventEmitter<void>();
  routineService = inject(RoutineService);
  formBuilder = inject(FormBuilder);

  routineForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    is_template: [false],
    start_time: [''],
    end_time: [''],
    daily_routine: ['Daily', Validators.required]
  });

  ngOnInit() {
    this.routineForm.patchValue({
      name: this.routine.name,
      description: this.routine.description,
      is_template: this.routine.is_template,
      start_time: this.routine.start_time,
      end_time: this.routine.end_time,
      daily_routine: this.routine.daily_routine
    });
  }

  async onSubmit() {
    if (this.routineForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
      const routineData: IRoutinePayload = {
        targetUserId: this.selectedUserId ?? this.routine.user_id,
        ...this.routineForm.value
      };
      const updatedRoutine = await this.routineService.updateRoutine(this.routine.routine_id, routineData);
      toast.success('Rutina actualizada con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al actualizar la rutina:', error);
      toast.error('Error al actualizar la rutina.');
    }
  }

  onCancel() {
    this.close.emit();
  }
}