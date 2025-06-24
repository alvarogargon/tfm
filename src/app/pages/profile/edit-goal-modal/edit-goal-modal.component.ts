import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoalService } from '../../../services/goal.service';
import { IProfileGoal } from '../../../interfaces/iprofile-goal.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-edit-goal-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-goal-modal.component.html',
  styleUrls: ['./edit-goal-modal.component.css']
})
export class EditGoalModalComponent implements OnInit {
  @Input() goal!: IProfileGoal;
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
      progress: [0, [Validators.min(0), Validators.max(100)]],
      deadline: ['']
    });
  }

  ngOnInit() {
    this.goalForm.patchValue({
      name: this.goal.name,
      goal_type: this.goal.goal_type,
      description: this.goal.description,
      target_hours_weekly: this.goal.target_hours_weekly,
      status: this.goal.status,
      progress: this.goal.progress,
      deadline: this.goal.deadline
    });
  }

  async onSubmit() {
    if (this.goalForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    try {
      await this.goalService.updateGoal(this.goal.goal_id, this.goalForm.value);
      toast.success('Objetivo actualizado con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al actualizar objetivo:', error);
      toast.error('Error al actualizar el objetivo.');
    }
  }
}