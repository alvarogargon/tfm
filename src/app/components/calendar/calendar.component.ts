import { Component, signal, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { RoutineService } from '../../services/routine.service';
import { ActivityService } from '../../services/activity.service';
import { toast } from 'ngx-sonner';
import { IRoutine } from '../../interfaces/iroutine.interface';
import { IActivity } from '../../interfaces/iactivity.interface';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: []
  });
  currentEvents = signal<EventApi[]>([]);
  routineService = inject(RoutineService);
  activityService = inject(ActivityService);

  constructor(private changeDetector: ChangeDetectorRef) {
    this.loadEvents();
  }

  async loadEvents() {
    try {
      const routines = await this.routineService.getRoutines();
      const activities = await this.activityService.getActivities();
      const events = activities.map(activity => ({
        id: String(activity.activity_id),
        title: activity.title,
        start: activity.datetime_start,
        end: activity.datetime_end,
        allDay: !activity.start_time,
        extendedProps: { routine_id: activity.routine_id }
      }));
      this.calendarOptions.update(options => ({
        ...options,
        events
      }));
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Error al cargar eventos.');
    }
  }

  async handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Ingrese el título de la nueva actividad:');
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
      try {
        const activity: Partial<IActivity> = {
          title,
          datetime_start: selectInfo.startStr,
          datetime_end: selectInfo.endStr,
          routine_id: 1 // Default to first routine; improve this logic with a modal to select routine
        };
        const newActivity = await this.activityService.createActivity(activity);
        calendarApi.addEvent({
          id: String(newActivity.activity_id),
          title: newActivity.title,
          start: newActivity.datetime_start,
          end: newActivity.datetime_end,
          allDay: selectInfo.allDay
        });
        toast.success('Actividad creada.');
      } catch (error) {
        console.error('Error creating activity:', error);
        toast.error('Error al crear la actividad.');
      }
    }
  }

  async handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`¿Seguro que desea eliminar la actividad '${clickInfo.event.title}'?`)) {
      try {
        await this.activityService.deleteActivity(Number(clickInfo.event.id));
        clickInfo.event.remove();
        toast.success('Actividad eliminada.');
      } catch (error) {
        console.error('Error deleting activity:', error);
        toast.error('Error al eliminar la actividad.');
      }
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}