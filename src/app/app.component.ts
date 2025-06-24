import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Footer2Component } from './shared/footer2/footer2.component';
import { NgxSonnerToaster } from 'ngx-sonner';
import { AddInterestModalComponent } from './pages/profile/add-interest-modal/add-interest-modal.component';
import { AddGoalModalComponent } from './pages/profile/add-goal-modal/add-goal-modal.component';
import { EditGoalModalComponent } from './pages/profile/edit-goal-modal/edit-goal-modal.component';
import { AddRoutineModalComponent } from './pages/profile/add-routine-modal/add-routine-modal.component';
import { AddGuideUserModalComponent } from './pages/profile/add-guide-user-modal/add-guide-user-modal.component';

import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/200.css';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    Footer2Component,
    NgxSonnerToaster,
    AddInterestModalComponent,
    AddGoalModalComponent,
    EditGoalModalComponent,
    AddRoutineModalComponent,
    AddGuideUserModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tfm';
}