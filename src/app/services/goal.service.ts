import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IProfileGoal } from '../interfaces/iprofile-goal.interface';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private endpoint = 'http://localhost:3000/api/profile-goals';
  private httpClient = inject(HttpClient);

  async getGoals(): Promise<IProfileGoal[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, goals: IProfileGoal[] }>(this.endpoint, { headers }));
      return res.goals;
    } catch (error) {
      console.error('Error al obtener objetivos:', error);
      toast.error('Error al obtener los objetivos.');
      throw new Error('Error fetching goals.');
    }
  }

  async getGoalsByUserId(userId: number): Promise<IProfileGoal[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, goals: IProfileGoal[] }>(`${this.endpoint}/${userId}`, { headers }));
      return res.goals;
    } catch (error) {
      console.error('Error al obtener objetivos del usuario:', error);
      toast.error('Error al obtener los objetivos del usuario.');
      throw new Error('Error fetching user goals.');
    }
  }

  async createGoal(goal: Partial<IProfileGoal>): Promise<IProfileGoal> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.post<{ message: string, goal: IProfileGoal }>(this.endpoint, goal, { headers }));
      return res.goal;
    } catch (error) {
      console.error('Error al crear objetivo:', error);
      toast.error('Error al crear el objetivo.');
      throw new Error('Error creating goal.');
    }
  }

  async updateGoal(id: number, goal: Partial<IProfileGoal>): Promise<IProfileGoal> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.put<{ message: string, goal: IProfileGoal }>(`${this.endpoint}/${id}`, goal, { headers }));
      return res.goal;
    } catch (error) {
      console.error('Error al actualizar objetivo:', error);
      toast.error('Error al actualizar el objetivo.');
      throw new Error('Error updating goal.');
    }
  }

  async deleteGoal(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      await lastValueFrom(this.httpClient.delete<void>(`${this.endpoint}/${id}`, { headers }));
      toast.success('Objetivo eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar objetivo:', error);
      toast.error('Error al eliminar el objetivo.');
      throw new Error('Error deleting goal.');
    }
  }
}