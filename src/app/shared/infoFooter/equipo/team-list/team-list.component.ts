import { Component, inject } from '@angular/core';
import { ITeam } from '../../../../interfaces/iteam.interface';
import { TeamService } from '../../../../services/team.service';
import { TeamCardComponent } from '../team-card/team-card.component';

@Component({
  selector: 'app-team-list',
  imports: [TeamCardComponent],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css'
})
export class TeamListComponent {
  arrTeams: ITeam[] = [];
  teamsService = inject(TeamService);

  ngOnInit() {
    this.arrTeams = this.teamsService.getAll();
  }


}
