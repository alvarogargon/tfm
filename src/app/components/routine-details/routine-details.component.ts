import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-routine-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  
  // Almacena todas las actividades sin filtrar
  allActivities = signal<IActivity[]>([]);
  
  // Almacena las categorías únicas de esta rutina
  routineCategories = signal<{name: string; color: string}[]>([]);
  
  // Almacena el nombre de la categoría seleccionada para filtrar
  selectedCategoryName = signal<string | null>(null);
  
  // Señal computada para las actividades filtradas
  filteredActivities = computed(() => {
    if (!this.selectedCategoryName()) {
      return this.allActivities();
    }
    return this.allActivities().filter(activity => 
      activity.category_name === this.selectedCategoryName()
    );
  });

  // Señal computada para la categoría seleccionada
  selectedCategory = computed(() => {
    if (!this.selectedCategoryName()) return null;
    return this.routineCategories().find(c => c.name === this.selectedCategoryName()) || null;
  });

  async ngOnInit() {
    const routineId = Number(this.route.snapshot.paramMap.get('id'));
    await this.loadRoutine(routineId);
    await this.loadActivities();
  }

  async loadRoutine(routineId: number) {
    try {
      const routine = await this.routineService.getRoutineById(routineId);
      this.routine.set(routine);
    } catch (error) {
      console.error('Error al cargar rutina:', error);
      toast.error('Error al cargar los detalles de la rutina.');
    }
  }

  async loadActivities() {
    const routineId = this.routine()?.routine_id;
    if (!routineId) return;

    try {
      // Cargar todas las actividades sin filtro
      const activities = await this.activityService.getByRoutineAndCategory(
        routineId, 
        null
      );
      
      this.allActivities.set(activities);
      this.extractUniqueCategories(activities);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      toast.error('Error al cargar las actividades.');
    }
  }

  private extractUniqueCategories(activities: IActivity[]) {
    const categoryMap = new Map<string, string>();
    
    activities.forEach(activity => {
      if (activity.category_name && activity.category_color) {
        categoryMap.set(activity.category_name, activity.category_color);
      }
    });
    
    const uniqueCategories = Array.from(categoryMap, ([name, color]) => ({
      name,
      color
    }));
    
    this.routineCategories.set(uniqueCategories);
  }

  onCategoryChange() {
    // Solo actualizamos la señal de categoría seleccionada
    // Las actividades filtradas se actualizan automáticamente a través de filteredActivities
  }

  openEditActivityModal(activity: IActivity) {
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

    const currentRoutineId = Number(this.route.snapshot.paramMap.get('id'));
    const routineFromSignal = this.routine()?.routine_id;

    let validRoutineId = activity.routine_id;
    
    if (!validRoutineId || validRoutineId <= 0) {
      validRoutineId = routineFromSignal || currentRoutineId;
      
      if (!validRoutineId || validRoutineId <= 0) {
        console.error('No se pudo determinar un routine_id válido');
        toast.error('Error: No se pudo identificar la rutina de la actividad.');
        return;
      }
    }
    
    const correctedActivity: IActivity = {
      ...activity,
      routine_id: validRoutineId,
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

    this.selectedActivity.set(correctedActivity);
    this.showEditActivityModal.set(true);
  }

  openDeleteActivityModal(activity: IActivity) {
    if (!activity || !activity.activity_id) {
      console.error('Actividad inválida para eliminar:', activity);
      toast.error('Error: Actividad no válida.');
      return;
    }

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
    this.showEditActivityModal.set(false);
    this.showDeleteActivityModal.set(false);
    this.showAddActivityModal.set(false);
    this.selectedActivity.set(null);
    
    // Recargar actividades después de cualquier cambio
    await this.loadActivities();
  }
}