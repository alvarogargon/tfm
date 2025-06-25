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

  async getGoals(userId: number | null): Promise<IProfileGoal[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = userId ? `${this.endpoint}?userId=${userId}` : this.endpoint;

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, goals: any[] }>(url, { headers }));
      return res.goals.map(goal => ({
        goal_id: goal.goal_id,
        profile_id: goal.profile_id,
        name: goal.name,
        goal_type: goal.goal_type,
        description: goal.description,
        target_hours_weekly: goal.target_hours_weekly,
        status: goal.status,
        progress: goal.progress,
        deadline: goal.deadline,
        created_at: goal.created_at,
        updated_at: goal.updated_at
      }));
    } catch (error) {
      console.error('Error al obtener objetivos:', error);
      toast.error('Error al obtener los objetivos.');
      throw new Error('Error fetching goals.');
    }
  }

  async createGoal(goalData: Partial<IProfileGoal>): Promise<IProfileGoal> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.post<{ message: string, goal: any }>(this.endpoint, goalData, { headers }));
      return {
        goal_id: res.goal.goal_id,
        profile_id: res.goal.profile_id,
        name: res.goal.name,
        goal_type: res.goal.goal_type,
        description: res.goal.description,
        target_hours_weekly: res.goal.target_hours_weekly,
        status: res.goal.status,
        progress: res.goal.progress,
        deadline: res.goal.deadline,
        created_at: res.goal.created_at,
        updated_at: res.goal.updated_at
      };
    } catch (error) {
      console.error('Error al crear objetivo:', error);
      toast.error('Error al crear el objetivo.');
      throw new Error('Error creating goal.');
    }
  }

  async updateGoal(goalId: number, goalData: Partial<IProfileGoal>): Promise<IProfileGoal> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.put<{ message: string, goal: any }>(`${this.endpoint}/${goalId}`, goalData, { headers }));
      return {
        goal_id: res.goal.goal_id,
        profile_id: res.goal.profile_id,
        name: res.goal.name,
        goal_type: res.goal.goal_type,
        description: res.goal.description,
        target_hours_weekly: res.goal.target_hours_weekly,
        status: res.goal.status,
        progress: res.goal.progress,
        deadline: res.goal.deadline,
        created_at: res.goal.created_at,
        updated_at: res.goal.updated_at
      };
    } catch (error) {
      console.error('Error al actualizar objetivo:', error);
      toast.error('Error al actualizar el objetivo.');
      throw new Error('Error updating goal.');
    }
  }

  async deleteGoal(goalId: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      await lastValueFrom(this.httpClient.delete(`${this.endpoint}/${goalId}`, { headers }));
    } catch (error) {
      console.error('Error al eliminar objetivo:', error);
      toast.error('Error al eliminar el objetivo.');
      throw new Error('Error deleting goal.');
    }
  }
}