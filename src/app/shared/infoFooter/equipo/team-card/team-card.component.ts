import { Component, Input } from '@angular/core';
import { ITeam } from '../../../../interfaces/iteam.interface';

@Component({
  selector: 'app-team-card',
  imports: [],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.css'
})
export class TeamCardComponent {
  @Input() miTeam!: ITeam;

}
