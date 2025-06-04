import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Footer2Component } from './shared/footer2/footer2.component';
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/200.css";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, Footer2Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tfm';
}
