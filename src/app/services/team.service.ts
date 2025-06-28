import { Injectable } from '@angular/core';
import { ITeam } from '../interfaces/iteam.interface';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private arrTeams: ITeam[] = [
    {
      id: 1,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },
    {
      id: 2,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },
    {
      id: 3,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },
    {
      id: 4,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },
    {
      id: 5,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },
    {
      id: 6,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },
    {
      id: 7,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },
    {
      id: 8,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },
    {
      id: 9,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },
    {
      id: 10,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },
    {
      id: 11,
      name: 'Álvaro García',
      description: 'ssdsadsad',
      avatar: 'sdsadsadsadsadsadsad',
    },

  ];
  getAll():ITeam[] {
    return this.arrTeams;
  }

}
