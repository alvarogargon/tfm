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

  async getRoutines(userId: number | null): Promise<IRoutine[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = userId ? `${this.endpoint}?userId=${userId}` : this.endpoint;

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, routines: any[] }>(url, { headers }));
      return res.routines.map(routine => ({
        routine_id: routine.routine_id,
        user_id: routine.user_id,
        name: routine.name,
        description: routine.description,
        is_template: routine.is_template,
        created_at: routine.created_at,
        updated_at: routine.updated_at,
        start_time: routine.start_time,
        end_time: routine.end_time,
        daily_routine: routine.daily_routine,
        activities: routine.activities || []
      }));
    } catch (error) {
      console.error('Error al obtener rutinas:', error);
      toast.error('Error al obtener las rutinas.');
      throw new Error('Error fetching routines.');
    }
  }

  async createRoutine(routineData: Partial<IRoutine>): Promise<IRoutine> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.post<{ message: string, routine: any }>(this.endpoint, routineData, { headers }));
      return {
        routine_id: res.routine.routine_id,
        user_id: res.routine.user_id,
        name: res.routine.name,
        description: res.routine.description,
        is_template: res.routine.is_template,
        created_at: res.routine.created_at,
        updated_at: res.routine.updated_at,
        start_time: res.routine.start_time,
        end_time: res.routine.end_time,
        daily_routine: res.routine.daily_routine,
        activities: res.routine.activities || []
      };
    } catch (error) {
      console.error('Error al crear rutina:', error);
      toast.error('Error al crear la rutina.');
      throw new Error('Error creating routine.');
    }
  }
}