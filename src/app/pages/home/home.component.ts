import { Component } from '@angular/core';
import { CalltoactionComponent } from '../../components/calltoaction/calltoaction.component';
import { FeaturesComponent } from "../../components/features/features.component";

@Component({
  selector: 'app-home',
  imports: [CalltoactionComponent, FeaturesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
