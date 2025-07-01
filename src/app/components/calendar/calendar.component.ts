import { Component, inject } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { RoutineService } from '../../services/routine.service';
import { IRoutine } from '../../interfaces/iroutine.interface';
import { IActivity } from '../../interfaces/iactivity.interface';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ActivityService } from '../../services/activity.service';
import { CategoryService } from '../../services/category.service';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms';
import { ICategory } from '../../interfaces/icategory.interface';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  private routineService = inject(RoutineService);
  private activityService = inject(ActivityService);
  private categoryService = inject(CategoryService);

  selectedActivity: IActivity | null = null;
  showActivityInfoModal: boolean = false;
  isAllDay: boolean = false;
  selectedDateStr: string = '';
  selectedDate: Date | null = null;
  isSubmitting: boolean = false;
  isDeleting: boolean = false;
  showDeleteConfirmModal: boolean = false;
  showAddActivityForm: boolean = false;

  availableRoutines: IRoutine[] = [];
  availableCategories: ICategory[] = [];

  newActivity: any = {
    title: '',
    description: '',
    routine_id: null,
    category_id: null,
    location: '',
    start_time: '',
    end_time: '',
    icon: '',
    day_of_week: null,
    datetime_start: '',
    datetime_end: '',
  };

  calendarOptions: CalendarOptions = {
    locale: 'es',
    timeZone: 'local',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    editable: true,
    selectable: true,
    eventDrop: this.handleEventMove.bind(this),
    dateClick: this.dateClicked.bind(this),
  };

  async ngOnInit() {
    await this.loadRoutines();
    await this.loadRoutinesForm();
    await this.loadCategories();
  }

  async loadRoutines() {
    try {
      const routines = await this.routineService.getRoutines(null); // Pasar null para usuario autenticado
      const events = this.transformRoutinesToEvents(routines);
      this.calendarOptions = { ...this.calendarOptions, events };
    } catch (error) {
      console.error('Error al cargar rutinas:', error);
      toast.error('Error al cargar las rutinas en el calendario.');
    }
  }

  async loadRoutinesForm() {
    try {
      this.availableRoutines = await this.routineService.getRoutines(null);
    } catch (error) {
      console.error('Error al cargar rutinas:', error);
      toast.error('Error al cargar las rutinas.');
    }
  }

  async loadCategories() {
    try {
      this.availableCategories = await this.categoryService.getCategories();
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar las categorías.');
    }
  }

  closeModal() {
    this.showActivityInfoModal = false;
    this.resetForm();
  }

  closeInfoModal() {
    this.showActivityInfoModal = false;
    this.selectedActivity = null;
  }

  resetForm() {
    this.newActivity = {
      title: '',
      description: '',
      routine_id: null,
      category_id: null,
      location: '',
      start_time: '',
      end_time: '',
      icon: '',
      day_of_week: null,
      datetime_start: '',
      datetime_end: '',
    };
    this.isAllDay = false;
    this.selectedDateStr = '';
  }

  private transformRoutinesToEvents(routines: IRoutine[]): EventInput[] {
    const events: EventInput[] = [];

    routines.forEach((routine) => {
      routine.activities.forEach((activity) => {
        // Solo incluir eventos con fechas válidas
        if (activity.datetime_start) {
          events.push({
            id: activity.activity_id.toString(),
            title: activity.title,
            start: activity.datetime_start,
            end: activity.datetime_end || undefined,
            allDay: !activity.start_time,
            extendedProps: {
              routine_id: activity.routine_id,
            },
          });
        }
      });
    });

    return events;
  }

  ateClicked(arg: any) {
    toast.info(`Fecha clicada: ${arg.dateStr}`);

    // Configurar la fecha seleccionada
    this.selectedDate = arg.date;
    this.selectedDateStr = arg.dateStr;

    // Asegurar que el objeto newActivity está inicializado
    this.resetForm();

    // Mostrar el formulario
    this.showAddActivityForm = true;
  }

  async handleEventClick(arg: any) {
    const activityId = parseInt(arg.event.id);
    try {
      this.selectedActivity = await this.activityService.getActivityById(
        activityId
      );
      this.showActivityInfoModal = true;
    } catch (error) {
      console.error('Error al obtener la actividad:', error);
      toast.error('Error al obtener la actividad.');
    }
  }

  async handleEventMove(arg: any) {
    const activityId = parseInt(arg.event.id);
    const newStart = arg.event.start;
    const oldStart = arg.oldEvent.start;

    try {
      const activity = await this.activityService.getActivityById(activityId);

      if (!activity) {
        toast.error('Actividad no encontrada.');
        arg.revert();
        return;
      }

      const timeDifference = newStart.getTime() - oldStart.getTime();
      const daysDifference = Math.round(timeDifference / (1000 * 60 * 60 * 24));

      const updatedActivity = { ...activity };

      if (!activity.datetime_start) {
        toast.error('La actividad no tiene fecha de inicio válida.');
        arg.revert();
        return;
      }

      const originalStart = new Date(activity.datetime_start);
      const newStartDate = new Date(originalStart.getTime() + timeDifference);
      updatedActivity.datetime_start = newStartDate.toISOString();

      if (activity.datetime_end) {
        const originalEnd = new Date(activity.datetime_end);
        const newEnd = new Date(originalEnd.getTime() + timeDifference);
        updatedActivity.datetime_end = newEnd.toISOString();
      }

      await this.activityService.updateActivity(activityId, updatedActivity);

      toast.success(`Actividad movida ${daysDifference} día(s) con éxito.`);

      await this.loadRoutines();
    } catch (error) {
      console.error('Error al mover la actividad:', error);
      toast.error('Error al mover la actividad.');
      arg.revert();
    }
  }

  async submitActivity() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    try {
      // Preparar los datos de la actividad
      const activityData = { ...this.newActivity };

      // Configurar las fechas y horas
      if (this.selectedDateStr) {
        if (this.isAllDay) {
          // Para eventos de todo el día
          activityData.datetime_start = this.selectedDateStr;
          activityData.datetime_end = this.selectedDateStr;
          activityData.start_time = null;
          activityData.end_time = null;
        } else {
          // Para eventos con hora específica
          if (activityData.start_time) {
            activityData.datetime_start = `${this.selectedDateStr}T${activityData.start_time}:00`;
          } else {
            activityData.datetime_start = `${this.selectedDateStr}T00:00:00`;
          }

          if (activityData.end_time) {
            activityData.datetime_end = `${this.selectedDateStr}T${activityData.end_time}:00`;
          } else {
            activityData.datetime_end = null;
          }
        }
      }
      await this.activityService.createActivity(activityData);

      toast.success('Actividad creada exitosamente');

      await this.loadRoutines();

      this.closeModal();
    } catch (error) {
      console.error('Error al crear la actividad:', error);
      toast.error('Error al crear la actividad.');
    } finally {
      this.isSubmitting = false;
    }
  }

  dateClicked(arg: any) {
    toast.info(`Fecha seleccionada: ${arg.dateStr}`);

    this.selectedDate = arg.date;
    this.selectedDateStr = arg.dateStr;

    this.resetForm();

    this.showAddActivityForm = true;
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'No especificada';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Fecha inválida';
    }
  }

  formatTime(timeString: string | null): string {
    if (!timeString) return 'No especificada';

    try {
      if (timeString.includes(':') && timeString.length <= 8) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      const date = new Date(timeString);
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Hora inválida';
    }
  }

  getRoutineName(): string {
    if (!this.selectedActivity) return 'No especificada';

    const routine = this.availableRoutines.find(
      (r) => r.routine_id === this.selectedActivity!.routine_id
    );
    return routine ? routine.name : 'Rutina no encontrada';
  }

  getCategoryName(): string {
    if (!this.selectedActivity?.category_id) return 'Sin categoría';

    const category = this.availableCategories.find(
      (c) => c.category_id === this.selectedActivity!.category_id
    );
    return category ? category.name : 'Categoría no encontrada';
  }

  async deleteActivity() {
    if (!this.selectedActivity || this.isDeleting) return;

    this.showDeleteConfirmModal = true;
  }

  confirmDeleteActivity() {
    if (!this.selectedActivity) return;

    this.showDeleteConfirmModal = false;
    this.executeDelete();
  }

  cancelDeleteActivity() {
    this.showDeleteConfirmModal = false;
  }

  private async executeDelete() {
    if (!this.selectedActivity) return;

    this.isDeleting = true;

    try {
      await this.activityService.deleteActivity(
        this.selectedActivity.activity_id
      );

      toast.success('Actividad eliminada exitosamente');

      await this.loadRoutines();

      this.closeInfoModal();
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      toast.error('Error al eliminar la actividad');
    } finally {
      this.isDeleting = false;
    }
  }

  checkModalClick(event: Event) {}

  async handleEventDrop(arg: any) {
    const activityId = parseInt(arg.event.id);
    const newStartDate = arg.event.start;
    const oldStartDate = arg.oldEvent.start;

    try {
      const activity = await this.activityService.getActivityById(activityId);

      if (!activity) {
        toast.error('No se pudo encontrar la actividad');
        arg.revert(); // Revertir el cambio
        return;
      }

      const timeDiff = newStartDate.getTime() - oldStartDate.getTime();
      const daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));

      const updatedActivity = { ...activity };

      if (!activity.datetime_start) {
        toast.error('La actividad no tiene fecha de inicio válida');
        arg.revert();
        return;
      }

      const originalStart = new Date(activity.datetime_start);
      const newStart = new Date(originalStart.getTime() + timeDiff);
      updatedActivity.datetime_start = newStart.toISOString();

      if (activity.datetime_end) {
        const originalEnd = new Date(activity.datetime_end);
        const newEnd = new Date(originalEnd.getTime() + timeDiff);
        updatedActivity.datetime_end = newEnd.toISOString();
      }

      await this.activityService.updateActivity(activityId, updatedActivity);

      toast.success(`Actividad movida ${daysDiff} día(s)`);

      await this.loadRoutines();
    } catch (error) {
      console.error('Error al actualizar la actividad:', error);
      toast.error('Error al mover la actividad');
      arg.revert();
    }
  }
}
