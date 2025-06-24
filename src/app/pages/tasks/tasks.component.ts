import { Component, inject } from '@angular/core';
import { GoalService } from '../../services/goal.service';
import { IProfileGoal } from '../../interfaces/iprofile-goal.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  goals: IProfileGoal[] = [];
  goalService = inject(GoalService);

  async ngOnInit() {
    try {
      this.goals = await this.goalService.getGoals();
    } catch (error) {
      console.error('Error al cargar objetivos:', error);
      toast.error('Error al cargar las tareas.');
    }
  }

  async updateProgress(goal: IProfileGoal) {
    const progress = prompt('Ingrese el nuevo progreso (0-100):', String(goal.progress));
    if (progress && !isNaN(Number(progress))) {
      try {
        const updatedGoal = await this.goalService.updateGoal(goal.goal_id, { progress: Number(progress) });
        this.goals = this.goals.map(g => g.goal_id === goal.goal_id ? updatedGoal : g);
        toast.success('Progreso actualizado con éxito.');
      } catch (error) {
        console.error('Error al actualizar progreso:', error);
        toast.error('Error al actualizar el progreso.');
      }
    }
  }
}