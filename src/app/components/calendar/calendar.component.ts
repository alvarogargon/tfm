import { Component, signal, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { RoutineService } from '../../services/routine.service';
import { ActivityService } from '../../services/activity.service';
import { toast } from 'ngx-sonner';
import { IActivity } from '../../interfaces/iactivity.interface';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true,
})
export class CalendarComponent {
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    dayMaxEvents: true,
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

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}