import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IProfileGoal } from '../interfaces/iprofile-goal.interface';

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
      throw new Error('Error fetching goals.');
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
    } catch (error) {
      throw new Error('Error deleting goal.');
    }
  }
}