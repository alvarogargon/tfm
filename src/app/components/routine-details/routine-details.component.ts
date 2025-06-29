import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineService } from '../../services/routine.service';
import { ActivityService } from '../../services/activity.service';
import { CategoryService } from '../../services/category.service'; // Nuevo servicio
import { IRoutine } from '../../interfaces/iroutine.interface';
import { IActivity } from '../../interfaces/iactivity.interface';
import { ICategory } from '../../interfaces/icategory.interface'; // Nueva interfaz
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
  categoryService = inject(CategoryService); // Nuevo servicio inyectado
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  routine = signal<IRoutine | null>(null);
  showEditActivityModal = signal(false);
  showDeleteActivityModal = signal(false);
  showAddActivityModal = signal(false);
  selectedActivity = signal<IActivity | null>(null);
  
  // Nuevas señales para manejar categorías y actividades
  categories = signal<ICategory[]>([]);
  selectedCategoryId = signal<number | null>(null);
  activities = signal<IActivity[]>([]);
  
  // Señal computada para obtener la categoría seleccionada
  selectedCategory = computed(() => {
    if (this.selectedCategoryId() === null) return null;
    return this.categories().find(c => c.category_id === this.selectedCategoryId()) || null;
  });

  async ngOnInit() {
    const routineId = Number(this.route.snapshot.paramMap.get('id'));
    await this.loadRoutine(routineId);
    await this.loadCategories(); // Cargar categorías al inicializar
    await this.loadActivities(); // Cargar actividades al inicializar
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

  // Nuevo método para cargar categorías
  async loadCategories() {
    try {
      const categories = await this.categoryService.getCategories();
      this.categories.set(categories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar las categorías.');
    }
  }

  // Nuevo método para cargar actividades (con filtro opcional)
  async loadActivities() {
    const routineId = this.routine()?.routine_id;
    if (!routineId) return;

    try {
      const activities = await this.activityService.getByRoutineAndCategory(
        routineId, 
        this.selectedCategoryId()
      );
      this.activities.set(activities);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      toast.error('Error al cargar las actividades.');
    }
  }

  // Nuevo método para manejar cambio de categoría
  onCategoryChange() {
    this.loadActivities();
  }

  openEditActivityModal(activity: IActivity) {
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
      validRoutineId = routineFromSignal || currentRoutineId;
      
      if (!validRoutineId || validRoutineId <= 0) {
        console.error('No se pudo determinar un routine_id válido');
        toast.error('Error: No se pudo identificar la rutina de la actividad.');
        return;
      }
    }
    
    // Crear actividad corregida con routine_id válido
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
    // Limpiar estado
    this.showEditActivityModal.set(false);
    this.showDeleteActivityModal.set(false);
    this.showAddActivityModal.set(false);
    this.selectedActivity.set(null);
    
    // Recargar actividades
    await this.loadActivities();
    
    // Recargar rutina si es necesario
    const routineId = Number(this.route.snapshot.paramMap.get('id'));
    if (routineId && routineId > 0) {
      await this.loadRoutine(routineId);
    }
  }
}