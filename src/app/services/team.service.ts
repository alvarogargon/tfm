import { Injectable } from '@angular/core';
import { ITeam } from '../interfaces/iteam.interface';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private arrTeams: ITeam[] = [
    {
      id: 1,
      name: 'Luis Llerena',
      description: 'Frontend Developer, especializado en Angular.',
      avatar: 'teamImages/luis.png',
      category: 'frontend'
    },
      {
      id: 2,
      name: 'Pablo Álvarez ',
      description: 'Frontend Developer, especializado en Bootstrap.',
      avatar: 'teamImages/pablo.png',
      category: 'frontend'
    },
      {
      id: 3,
      name: 'Álvaro Carrasco',
      description: 'Frontend Developer, especializado en UI/IX.',
      avatar: 'teamImages/alvaroC.png',
      category: 'frontend'
    },
      {
      id: 4,
      name: 'Alberto Romera',
      description: 'Frontend Developer, especializado en componentes.',
      avatar: 'teamImages/alberto.png',
      category: 'frontend'
    },
      {
      id: 5,
      name: 'Álvaro García',
      description: 'Frontend Developer, especializado en responsive.',
      avatar: 'teamImages/alvaroG.png',
      category: 'frontend'
    },
      {
      id: 6,
      name: 'Pau Miquel',
      description: 'Backend Developer, especializado en seguridad.',
      avatar: 'teamImages/pau.png',
      category: 'backend'
    },
      {
      id: 7,
      name: 'Raquel Morgado',
      description: 'Backend Developer, especializado en microservicios.',
      avatar: 'teamImages/raquel.png',
      category: 'backend'
    },
      {
      id: 8,
      name: 'Óscar González',
      description: 'Backend Developer, especializado en testing.',
      avatar: 'teamImages/oscar.png',
      category: 'backend'
    },
      {
      id: 9,
      name: 'Flávia Das Graças',
      description: 'Backend Developer.',
      avatar: 'teamImages/flavia.png',
      category: 'backend'
    },
      {
      id: 10,
      name: 'Lucas Percivale',
      description: 'API Developer, especializado en Node.js.',
      avatar: 'teamImages/lucas.png',
      category: 'apibdd'
    },
      {
      id: 11,
      name: 'Jesus Plata',
      description: 'Coordinador del equipo.',
      avatar: 'teamImages/jesus.png',
      category: 'coordinator'
    },
    {
      id: 12,
      name: 'Jesus Plata',
      description: 'Especialista en API/BDD.',
      avatar: 'teamImages/jesus.png',
      category: 'apibdd'
    }

  ];
  getAll():ITeam[] {
    return this.arrTeams;
  }

}
