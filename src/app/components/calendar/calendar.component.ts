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

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <full-calendar [options]="calendarOptions"></full-calendar>
  `,
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  private routineService = inject(RoutineService);
  private activityService = inject(ActivityService);
  private categoryService = inject(CategoryService);

  calendarOptions: CalendarOptions = {
    locale: 'es',
    timeZone: 'local',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    editable: true,
    selectable: true,
    eventDrop: this.handleEventMove.bind(this),
  };

  async ngOnInit() {
    await this.loadRoutines();
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

  private transformRoutinesToEvents(routines: IRoutine[]): EventInput[] {
    const events: EventInput[] = [];
    
    routines.forEach(routine => {
      routine.activities.forEach(activity => {
        // Solo incluir eventos con fechas válidas
        if (activity.datetime_start) {
          events.push({
            id: activity.activity_id.toString(),
            title: activity.title,
            start: activity.datetime_start,
            end: activity.datetime_end || undefined,
            allDay: !activity.start_time,
            extendedProps: {
              routine_id: activity.routine_id
            }
          });
        }
      });
    });

    return events;
  }

  handleEventClick(arg: any) {
    toast.info(`Evento clicado: ${arg.event.title}`);
  }

  async handleEventMove(arg: any) {
    const activityId = parseInt(arg.event.id);
    const newStart = arg.event.start;
    const oldStart = arg.oldEvent.start;

    try {
      const activity = await this.activityService.getActivityById(activityId);

      if(!activity) {
        toast.error('Actividad no encontrada.');
        arg.revert();
        return;
      }

      const timeDifference = newStart.getTime() - oldStart.getTime();
      const daysDifference = Math.round(timeDifference / (1000 * 60 * 60 * 24));

      if (!activity.datetime_start) {
        toast.error('La actividad no tiene fecha de inicio válida.');
        arg.revert();
        return;
      }

      const originalStart = new Date(activity.datetime_start);
      const newStartDate = new Date(originalStart.getTime() + timeDifference);

      if (activity.datetime_end) {
        const originalEnd= new Date(activity.datetime_end);
        const newEnd = new Date(originalEnd.getTime() + timeDifference);
      }
      


    } catch (error) {
      console.error('Error al mover la actividad:', error);
      toast.error('Error al mover la actividad.');
      arg.revert();
    }
  }
}