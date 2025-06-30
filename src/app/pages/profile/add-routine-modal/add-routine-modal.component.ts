import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoutineService } from '../../../services/routine.service';
import { IRoutinePayload } from '../../../interfaces/iroutine.interface';
import { toast } from 'ngx-sonner';
import { IGuideUser } from '../../../interfaces/iguide-user.interface';

@Component({
  selector: 'app-add-routine-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-routine-modal.component.html',
  styleUrls: ['./add-routine-modal.component.css']
})
export class AddRoutineModalComponent implements OnInit {
  @Input() guideUserRelations: IGuideUser[] = [];
  @Input() selectedUserId: number | null = null;
  @Input() authUserId: number | null = null; // New input for authenticated user's ID
  @Output() close = new EventEmitter<void>();
  routineService = inject(RoutineService);
  formBuilder = inject(FormBuilder);

  routineForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    is_template: [false],
    start_time: [''],
    end_time: [''],
    daily_routine: ['Daily', Validators.required],
    targetUserId: [null]
  });

  ngOnInit() {
    // Set targetUserId based on role and inputs
    if (this.guideUserRelations.length > 0 && this.selectedUserId) {
      // For guide users, use selectedUserId if provided
      this.routineForm.patchValue({ targetUserId: this.selectedUserId });
    } else if (this.authUserId) {
      // For user role, use authenticated user's ID
      this.routineForm.patchValue({ targetUserId: this.authUserId });
    }
  }

  async onSubmit() {
    if (this.routineForm.invalid || this.routineForm.value.targetUserId === null) {
      toast.error('Por favor, completa todos los campos requeridos, incluido el usuario objetivo.');
      return;
    }

    try {
      const routineData: IRoutinePayload = {
        ...this.routineForm.value,
        user_id: this.routineForm.value.targetUserId // Map targetUserId to user_id
      };
      const newRoutine = await this.routineService.createRoutine(routineData);
      toast.success('Rutina creada con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al crear la rutina:', error);
      toast.error('Error al crear la rutina.');
    }
  }

  onCancel() {
    this.close.emit();
  }
}