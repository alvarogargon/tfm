import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoutineService } from '../../services/routine.service';
import { ActivityService } from '../../services/activity.service';
import { IRoutine } from '../../interfaces/iroutine.interface';
import { IActivity } from '../../interfaces/iactivity.interface';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { toast } from 'ngx-sonner';
import { EditActivityModalComponent } from '../../pages/profile/edit-activity-modal/edit-activity-modal.component';
import { DeleteActivityModalComponent } from '../../pages/profile/delete-activity-modal/delete-activity-modal.component';
import { AddActivityModalComponent } from '../../pages/profile/add-activity-modal/add-activity-modal.component';

@Component({
  selector: 'app-routine-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DateFormatPipe,
    EditActivityModalComponent,
    DeleteActivityModalComponent,
    AddActivityModalComponent
  ],
  templateUrl: './routine-details.component.html',
  styleUrls: ['./routine-details.component.css']
})
export class RoutineDetailsComponent {
  routineService = inject(RoutineService);
  activityService = inject(ActivityService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  routine = signal<IRoutine | null>(null);
  showEditActivityModal = signal(false);
  showDeleteActivityModal = signal(false);
  showAddActivityModal = signal(false);
  selectedActivity = signal<IActivity | null>(null);

  async ngOnInit() {
    const routineId = Number(this.route.snapshot.paramMap.get('id'));
    await this.loadRoutine(routineId);
  }

  async loadRoutine(routineId: number) {
    try {
      const routine = await this.routineService.getRoutineById(routineId);
      console.log('Rutina cargada:', routine);
      this.routine.set(routine);
    } catch (error) {
      console.error('Error al cargar rutina:', error);
      toast.error('Error al cargar los detalles de la rutina.');
    }
  }

  openEditActivityModal(activity: IActivity) {
    console.log('Abriendo modal de edición para actividad:', activity);
    this.selectedActivity.set(activity);
    this.showEditActivityModal.set(true);
  }

  openDeleteActivityModal(activity: IActivity) {
    console.log('Abriendo modal de eliminación para actividad:', activity);
    this.selectedActivity.set(activity);
    this.showDeleteActivityModal.set(true);
  }

  openAddActivityModal() {
    this.showAddActivityModal.set(true);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  async onModalClosed() {
    this.showEditActivityModal.set(false);
    this.showDeleteActivityModal.set(false);
    this.showAddActivityModal.set(false);
    this.selectedActivity.set(null);
    const routineId = Number(this.route.snapshot.paramMap.get('id'));
    await this.loadRoutine(routineId);
  }
}