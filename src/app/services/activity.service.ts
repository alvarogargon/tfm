import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IActivity } from '../interfaces/iactivity.interface';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private endpoint = 'http://localhost:3000/api/activities';
  private httpClient = inject(HttpClient);

  async getActivities(): Promise<IActivity[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, activities: IActivity[] }>(this.endpoint, { headers }));
      console.log('Respuesta de getActivities:', res); // Añadido para depuración
      return res.activities;
    } catch (error: any) {
      console.error('Error al obtener actividades:', error);
      toast.error(error.message || 'Error al obtener las actividades.');
      throw new Error('Error fetching activities.');
    }
  }

  async getActivityById(id: number): Promise<IActivity> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, activity: IActivity }>(`${this.endpoint}/${id}`, { headers }));
      console.log('Respuesta de getActivityById:', res); // Añadido para depuración
      return res.activity;
    } catch (error: any) {
      console.error('Error al obtener actividad:', error);
      if (error.status === 404) {
        toast.error('Actividad no encontrada o no autorizada.');
      } else if (error.status === 400) {
        toast.error('El ID de la actividad debe ser un número entero.');
      } else {
        toast.error('Error al obtener la actividad.');
      }
      throw new Error('Error fetching activity.');
    }
  }

  async getByRoutineAndCategory(routineId: number, categoryId: number | null): Promise<IActivity[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found. Please log in.');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Construir la URL con parámetros
  let url = `${this.endpoint}/routine/${routineId}`;
  if (categoryId !== null) {
    url += `?category_id=${categoryId}`;
  }

  try {
    const res = await lastValueFrom(
      this.httpClient.get<{ activities: any[] }>(url, { headers })
    );
    
    // Mapear la respuesta para asegurar que tenemos category_color
    return res.activities.map(activity => ({
      ...activity,
      category_color: activity.category_color || null
    }));
  } catch (error: any) {
    console.error('Error al obtener actividades por rutina y categoría:', error);
    toast.error(error.message || 'Error al obtener las actividades filtradas.');
    throw new Error('Error fetching activities by routine and category.');
  }
}


  async createActivity(activity: Partial<IActivity>): Promise<IActivity> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.post<{ message: string, activity: IActivity }>(this.endpoint, activity, { headers }));
      console.log('Respuesta de createActivity:', res); // Añadido para depuración
      return res.activity;
    } catch (error: any) {
      console.error('Error al crear actividad:', error);
      if (error.status === 400) {
        toast.error(error.error?.message || 'El ID de la rutina y el título son obligatorios.');
      } else {
        toast.error('Error al crear la actividad.');
      }
      throw new Error('Error creating activity.');
    }
  }

  async updateActivity(id: number, activity: Partial<IActivity>): Promise<IActivity> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.put<{ message: string, activity: IActivity }>(`${this.endpoint}/${id}`, activity, { headers }));
      console.log('Respuesta de updateActivity:', res); // Añadido para depuración
      return res.activity;
    } catch (error: any) {
      console.error('Error al actualizar actividad:', error);
      if (error.status === 400) {
        toast.error(error.error?.message || 'El ID de la rutina y el título son obligatorios.');
      } else if (error.status === 403) {
        toast.error('No autorizado para actualizar esta actividad.');
      } else {
        toast.error('Error al actualizar la actividad.');
      }
      throw new Error('Error updating activity.');
    }
  }

  async deleteActivity(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      console.log('Enviando solicitud DELETE para activity_id:', id); // Añadido para depuración
      const res = await lastValueFrom(this.httpClient.delete<{ message: string, activity_id: number }>(`${this.endpoint}/${id}`, { headers }));
      console.log('Respuesta de deleteActivity:', res); // Añadido para depuración
    } catch (error: any) {
      console.error('Error al eliminar actividad:', error);
      if (error.status === 404) {
        toast.error('Actividad no encontrada o no autorizada.');
      } else if (error.status === 403) {
        toast.error('No autorizado para eliminar esta actividad.');
      } else if (error.status === 400) {
        toast.error('El ID de la actividad debe ser un número entero.');
      } else {
        toast.error('Error al eliminar la actividad.');
      }
      throw new Error('Error deleting activity.');
    }
  }
}