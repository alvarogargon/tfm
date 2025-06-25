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

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

  async ngOnInit() {
    await this.loadRoutines();
  }

  async loadRoutines() {
    try {
      const routines = await this.routineService.getRoutines();
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
            start: activity.datetime_start, // Aseguramos que es string y no null
            end: activity.datetime_end || undefined, // Convertimos null a undefined
            allDay: !activity.start_time, // Si no hay hora específica, es un evento de todo el día
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
    // Aquí puedes añadir navegación o lógica adicional
  }
}