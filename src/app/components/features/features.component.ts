import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-features',
  imports: [RouterLink],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css',
  standalone: true,
})
export class FeaturesComponent {}