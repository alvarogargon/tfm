// routine-details.component.ts
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
    
    // Validaciones básicas
    if (!activity) {
      console.error('No se proporcionó una actividad válida');
      toast.error('Error: Actividad no válida.');
      return;
    }

    if (!activity.activity_id || activity.activity_id <= 0) {
      console.error('Actividad con activity_id inválido:', activity);
      toast.error('Error: ID de actividad inválido.');
      return;
    }

    // Obtener routine_id actual de la URL como fallback
    const currentRoutineId = Number(this.route.snapshot.paramMap.get('id'));
    const routineFromSignal = this.routine()?.routine_id;

    // Determinar routine_id válido
    let validRoutineId = activity.routine_id;
    
    if (!validRoutineId || validRoutineId <= 0) {
      console.warn('routine_id inválido en actividad, usando fallbacks...');
      
      // Prioridad de fallbacks:
      // 1. routine_id del signal de la rutina actual
      // 2. routine_id de la URL
      validRoutineId = routineFromSignal || currentRoutineId;
      
      if (!validRoutineId || validRoutineId <= 0) {
        console.error('No se pudo determinar un routine_id válido');
        toast.error('Error: No se pudo identificar la rutina de la actividad.');
        return;
      }
      
      console.log(`Usando routine_id de fallback: ${validRoutineId}`);
    }

    // Crear actividad corregida con routine_id válido
    const correctedActivity: IActivity = {
      ...activity,
      routine_id: validRoutineId,
      // Asegurar que otros campos tengan valores por defecto válidos
      category_id: activity.category_id || null,
      title: activity.title || 'Sin título',
      description: activity.description || '',
      day_of_week: activity.day_of_week || null,
      start_time: activity.start_time || null,
      end_time: activity.end_time || null,
      location: activity.location || null,
      datetime_start: activity.datetime_start || null,
      datetime_end: activity.datetime_end || null,
      created_at: activity.created_at || '',
      updated_at: activity.updated_at || '',
      icon: activity.icon || null
    };

    console.log('Actividad corregida para modal:', correctedActivity);

    // Verificar que la rutina coincida (si es posible)
    if (routineFromSignal && correctedActivity.routine_id !== routineFromSignal) {
      console.warn('La actividad puede no pertenecer a la rutina actual:', {
        activityRoutineId: correctedActivity.routine_id,
        currentRoutineId: routineFromSignal
      });
      // No bloqueamos aquí, pero advertimos
    }

    this.selectedActivity.set(correctedActivity);
    this.showEditActivityModal.set(true);
    
    console.log('Modal de edición configurado exitosamente');
  }

  openDeleteActivityModal(activity: IActivity) {
    console.log('Abriendo modal de eliminación para actividad:', activity);
    
    if (!activity || !activity.activity_id) {
      console.error('Actividad inválida para eliminar:', activity);
      toast.error('Error: Actividad no válida.');
      return;
    }

    // Aplicar la misma lógica de corrección para delete
    const currentRoutineId = Number(this.route.snapshot.paramMap.get('id'));
    const routineFromSignal = this.routine()?.routine_id;
    
    const correctedActivity: IActivity = {
      ...activity,
      routine_id: activity.routine_id || routineFromSignal || currentRoutineId
    };

    this.selectedActivity.set(correctedActivity);
    this.showDeleteActivityModal.set(true);
  }

  openAddActivityModal() {
    const currentRoutine = this.routine();
    if (!currentRoutine || !currentRoutine.routine_id) {
      console.error('No hay rutina cargada para añadir actividad');
      toast.error('Error: No se pudo identificar la rutina actual.');
      return;
    }
    
    this.showAddActivityModal.set(true);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  async onModalClosed() {
    console.log('Modal cerrado, limpiando estado...');
    
    // Limpiar estado
    this.showEditActivityModal.set(false);
    this.showDeleteActivityModal.set(false);
    this.showAddActivityModal.set(false);
    this.selectedActivity.set(null);
    
    // Recargar rutina
    const routineId = Number(this.route.snapshot.paramMap.get('id'));
    if (routineId && routineId > 0) {
      await this.loadRoutine(routineId);
    } else {
      console.error('ID de rutina inválido al cerrar modal');
      toast.error('Error al recargar la rutina.');
    }
  }
}