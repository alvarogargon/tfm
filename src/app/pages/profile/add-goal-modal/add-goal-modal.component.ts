import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoalService } from '../../../services/goal.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-goal-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-goal-modal.component.html',
  styleUrls: ['./add-goal-modal.component.css']
})
export class AddGoalModalComponent {
  @Output() close = new EventEmitter<void>();
  goalForm: FormGroup;
  goalService = inject(GoalService);

  constructor(private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      name: ['', Validators.required],
      goal_type: [''],
      description: [''],
      target_hours_weekly: [null, Validators.min(0)],
      status: ['active', Validators.required],
      deadline: [''],
      need_reminder: [false]
    });
  }

  async onSubmit() {
    if (this.goalForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    try {
      await this.goalService.createGoal(this.goalForm.value);
      toast.success('Objetivo creado con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al crear objetivo:', error);
      toast.error('Error al crear el objetivo.');
    }
  }
}