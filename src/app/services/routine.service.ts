import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IRoutine } from '../interfaces/iroutine.interface';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  private endpoint = 'http://localhost:3000/api/routines';
  private httpClient = inject(HttpClient);

  async getRoutines(): Promise<IRoutine[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, routines: IRoutine[] }>(this.endpoint, { headers }));
      return res.routines;
    } catch (error) {
      throw new Error('Error fetching routines.');
    }
  }

  async getRoutine(id: number): Promise<IRoutine> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, routine: IRoutine }>(`${this.endpoint}/${id}`, { headers }));
      return res.routine;
    } catch (error) {
      throw new Error('Error fetching routine.');
    }
  }

  async createRoutine(routine: Partial<IRoutine>): Promise<IRoutine> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.post<{ message: string, routine: IRoutine }>(this.endpoint, routine, { headers }));
      return res.routine;
    } catch (error) {
      throw new Error('Error creating routine.');
    }
  }

  async updateRoutine(id: number, routine: Partial<IRoutine>): Promise<IRoutine> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.put<{ message: string, routine: IRoutine }>(`${this.endpoint}/${id}`, routine, { headers }));
      return res.routine;
    } catch (error) {
      throw new Error('Error updating routine.');
    }
  }

  async deleteRoutine(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      await lastValueFrom(this.httpClient.delete<void>(`${this.endpoint}/${id}`, { headers }));
    } catch (error) {
      throw new Error('Error deleting routine.');
    }
  }
}