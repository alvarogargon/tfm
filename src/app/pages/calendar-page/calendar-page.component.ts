import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CalendarComponent],
  template: `
    <section class="container-xl pt-5">
      <app-calendar></app-calendar>
    </section>
  `,
  styleUrls: ['./calendar-page.component.css']
})
export class CalendarPageComponent {}