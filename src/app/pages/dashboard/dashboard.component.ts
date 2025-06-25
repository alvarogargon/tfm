import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { GoalService } from '../../services/goal.service';
import { RoutineService } from '../../services/routine.service';
import { ActivityService } from '../../services/activity.service';
import { signal } from '@angular/core';
import { IProfileGoal } from '../../interfaces/iprofile-goal.interface';
import { IRoutine } from '../../interfaces/iroutine.interface';
import { IActivity } from '../../interfaces/iactivity.interface';

declare var VANTA: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private vantaEffect: any;
  private goalService = inject(GoalService);
  private routineService = inject(RoutineService);
  private activityService = inject(ActivityService);

  goals = signal<IProfileGoal[]>([]);
  routines = signal<IRoutine[]>([]);
  activities = signal<IActivity[]>([]);
  completedGoalsCount = signal(0);
  activeRoutinesCount = signal(0);
  weeklyActivityHours = signal(0);

  async ngAfterViewInit() {
    this.vantaEffect = VANTA.FOG({
      el: '#vanta-bg-dashboard',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      highlightColor: 0xdbedff,
      midtoneColor: 0x3434dc,
      lowlightColor: 0x4646a2,
      baseColor: 0xffffff,
      blurFactor: 0.20,
      speed: 0.10,
      zoom: 0.10
    });
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      const goals = await this.goalService.getGoals();
      const routines = await this.routineService.getRoutines();
      const activities = await this.activityService.getActivities();

      this.goals.set(goals);
      this.routines.set(routines);
      this.activities.set(activities);

      this.completedGoalsCount.set(goals.filter(goal => goal.status === 'completed').length);
      this.activeRoutinesCount.set(routines.filter(routine => !routine.is_template).length);

      const totalHours = activities.reduce((sum, activity) => {
        if (activity.datetime_start && activity.datetime_end) {
          const start = new Date(activity.datetime_start);
          const end = new Date(activity.datetime_end);
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return sum + hours;
        }
        return sum;
      }, 0);
      this.weeklyActivityHours.set(Math.round(totalHours));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
}