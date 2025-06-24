import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutineService } from '../../services/routine.service';
import { ActivityService } from '../../services/activity.service';
import { IRoutine } from '../../interfaces/iroutine.interface';
import { IActivity } from '../../interfaces/iactivity.interface';
import { toast } from 'ngx-sonner';
import { AddActivityModalComponent } from '../profile/add-activity-modal/add-activity-modal.component';

@Component({
  selector: 'app-routine-detail',
  standalone: true,
  imports: [AddActivityModalComponent],
  templateUrl: './routine-detail.component.html',
  styleUrls: ['./routine-detail.component.css']
})
export class RoutineDetailComponent {
  routine: IRoutine | null = null;
  activities: IActivity[] = [];
  showAddActivityModal = false;
  route = inject(ActivatedRoute);
  routineService = inject(RoutineService);
  activityService = inject(ActivityService);

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    try {
      this.routine = await this.routineService.getRoutine(id);
      this.activities = await this.activityService.getActivities();
      this.activities = this.activities.filter(a => a.routine_id === id);
    } catch (error) {
      console.error('Error al cargar rutina:', error);
      toast.error('Error al cargar la rutina.');
    }
  }

  openAddActivityModal() {
    this.showAddActivityModal = true;
  }

  async deleteActivity(activityId: number) {
    try {
      await this.activityService.deleteActivity(activityId);
      this.activities = this.activities.filter(a => a.activity_id !== activityId);
      toast.success('Actividad eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      toast.error('Error al eliminar la actividad.');
    }
  }

  onActivityAdded() {
    this.showAddActivityModal = false;
    this.ngOnInit(); // Recargar actividades
  }
}