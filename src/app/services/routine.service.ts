import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IRoutine } from '../interfaces/iroutine.interface';
import { IActivity } from '../interfaces/iactivity.interface';
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
      const res = await lastValueFrom(this.httpClient.get<{ message: string, routines: any[] }>(this.endpoint, { headers }));
      return res.routines.map(routine => this.mapRoutine(routine));
    } catch (error) {
      console.error('Error al obtener rutinas:', error);
      toast.error('Error al obtener las rutinas.');
      throw new Error('Error fetching routines.');
    }
  }

  async getRoutinesByUserId(userId: number): Promise<IRoutine[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, routines: any[] }>(this.endpoint, { headers }));
      return res.routines
        .filter(routine => routine.user_id === userId)
        .map(routine => this.mapRoutine(routine));
    } catch (error) {
      console.error('Error al obtener rutinas del usuario:', error);
      toast.error('Error al obtener las rutinas del usuario.');
      throw new Error('Error fetching user routines.');
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
      const res = await lastValueFrom(this.httpClient.post<{ message: string, routine: any }>(this.endpoint, routine, { headers }));
      return this.mapRoutine(res.routine);
    } catch (error) {
      console.error('Error al crear rutina:', error);
      toast.error('Error al crear la rutina.');
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
      const res = await lastValueFrom(this.httpClient.put<{ message: string, routine: any }>(`${this.endpoint}/${id}`, routine, { headers }));
      return this.mapRoutine(res.routine);
    } catch (error) {
      console.error('Error al actualizar rutina:', error);
      toast.error('Error al actualizar la rutina.');
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
      toast.success('Rutina eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar rutina:', error);
      toast.error('Error al eliminar la rutina.');
      throw new Error('Error deleting routine.');
    }
  }

  private mapRoutine(routine: any): IRoutine {
    return {
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
      activities: routine.activities ? routine.activities.map((activity: any) => ({
        activity_id: activity.activity_id,
        routine_id: activity.routine_id,
        category_id: activity.category ? activity.category.category_id : null,
        title: activity.activity_name || activity.title,
        description: activity.description,
        day_of_week: activity.day_of_week,
        start_time: activity.start_time,
        end_time: activity.end_time,
        location: activity.location,
        datetime_start: activity.datetime_start,
        datetime_end: activity.datetime_end,
        created_at: activity.created_at,
        updated_at: activity.updated_at,
        icon: activity.icon,
        category: activity.category ? {
          name: activity.category.name,
          color: activity.category.color
        } : null
      })) : []
    };
  }
}