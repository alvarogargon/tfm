import { Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { RoutineService } from '../../services/routine.service';
import { ActivityService } from '../../services/activity.service';
import { IProfileGoal } from '../../interfaces/iprofile-goal.interface';
import { IRoutine } from '../../interfaces/iroutine.interface';
import { IActivity } from '../../interfaces/iactivity.interface';
import { ChartComponent } from '../../chart/chart.component';
declare var VANTA: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private router = inject(Router);
  private goalService = inject(GoalService);
  private routineService = inject(RoutineService);
  private activityService = inject(ActivityService);

  goals = signal<IProfileGoal[]>([]);
  routines = signal<IRoutine[]>([]);
  activities = signal<IActivity[]>([]);

  chartLabels = ['Completados', 'Pendientes'];

  get chartData() {
    const completed = this.completedGoalsCount();
    const total = this.goals().length;
    const pending = total - completed;
    return [completed, pending];
  }

  completedGoalsCount = computed(() =>
    this.goals().filter(g => g.status === 'completed').length
  );

  activeRoutinesCount = computed(() =>
    this.routines().filter(r => !this.isExpired(r.end_time)).length
  );

  activitiesCount = computed(() => this.activities().length);

  async ngOnInit() {
    await this.loadData();
  }

  private async loadData() {
    try {
      const [goals, routines, activities] = await Promise.all([
        this.goalService.getGoals(null),      // usuario autenticado
        this.routineService.getRoutines(null),
        this.activityService.getActivities()
      ]);

      this.goals.set(goals);
      this.routines.set(routines);
      this.activities.set(activities);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    }
  }

  private isExpired(endTime: string | null): boolean {
    if (!endTime) return false;
    const endDate = new Date(endTime);
    const now = new Date();
    return endDate.getTime() < now.getTime();
  }

  // Método para navegar al perfil al pulsar el botón
  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
