import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IRoutine, IRoutinePayload, IReceivedRoutine } from '../interfaces/iroutine.interface';
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

    const url = userId ? `${this.endpoint}/user/${userId}` : this.endpoint;

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
        activities: (routine.activities || []).map((activity: any) => ({
          activity_id: activity.activity_id,
          // Asegurar que routine_id se mapee correctamente
          routine_id: activity.routine_id || routine.routine_id, // Fallback al routine_id padre
          category_id: activity.category_id || null,
          title: activity.activity_name || activity.title || 'Sin título',
          description: activity.description || '',
          day_of_week: activity.day_of_week || null,
          start_time: activity.start_time || null,
          end_time: activity.end_time || null,
          location: activity.location || null,
          datetime_start: activity.datetime_start || null,
          datetime_end: activity.datetime_end || null,
          created_at: activity.created_at || null,
          updated_at: activity.updated_at || null,
          icon: activity.icon || null,
          category: activity.category || null
        }))
      }));
    } catch (error) {
      console.error('Error al obtener rutinas:', error);
      toast.error('Error al obtener las rutinas.');
      throw new Error('Error fetching routines.');
    }
  }

  async getRoutineById(id: number): Promise<IRoutine> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, routine: any }>(`${this.endpoint}/${id}`, { headers }));

      const mappedRoutine = {
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
        activities: (res.routine.activities || []).map((activity: any) => {
          
          const mappedActivity = {
            activity_id: activity.activity_id,
            // Múltiples fallbacks para routine_id
            routine_id: activity.routine_id || res.routine.routine_id || id,
            category_id: activity.category_id || null,
            title: activity.activity_name || activity.title || 'Sin título',
            description: activity.description || '',
            day_of_week: activity.day_of_week || null,
            start_time: activity.start_time || null,
            end_time: activity.end_time || null,
            location: activity.location || null,
            datetime_start: activity.datetime_start || null,
            datetime_end: activity.datetime_end || null,
            created_at: activity.created_at || null,
            updated_at: activity.updated_at || null,
            icon: activity.icon || null,
            category: activity.category || null
          };
          
          return mappedActivity;
        })
      };

      return mappedRoutine;
    } catch (error: any) {
      console.error('Error al obtener rutina:', error);
      if (error.status === 404) {
        toast.error('Rutina no encontrada o no autorizada.');
      } else if (error.status === 400) {
        toast.error('El ID de la rutina debe ser un número entero.');
      } else {
        toast.error('Error al obtener la rutina.');
      }
      throw new Error('Error fetching routine.');
    }
  }

  async createRoutine(routineData: IRoutinePayload): Promise<IRoutine> {
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

  async updateRoutine(routineId: number, routineData: IRoutinePayload): Promise<IRoutine> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.put<{ message: string, routine: any }>(
        `${this.endpoint}/${routineId}`,
        routineData,
        { headers }
      ));
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
      console.error('Error al actualizar rutina:', error);
      toast.error('Error al actualizar la rutina.');
      throw new Error('Error updating routine.');
    }
  }

  async deleteRoutine(routineId: number): Promise<number> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.delete<{ message: string, routine_id: number }>(
        `${this.endpoint}/${routineId}`,
        { headers }
      ));
      return res.routine_id;
    } catch (error) {
      console.error('Error al eliminar rutina:', error);
      toast.error('Error al eliminar la rutina.');
      throw new Error('Error deleting routine.');
    }
  }
// Obtener rutinas públicas
  async getPublicRoutines(): Promise<IRoutine[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(
        this.httpClient.get<{ message: string, routines: any[] }>(
          `${this.endpoint}/public/templates`, 
          { headers }
        )
      );

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
        shared_by: routine.shared_by,
        activities: (routine.activities || []).map((activity: any) => ({
          activity_id: activity.activity_id,
          routine_id: activity.routine_id || routine.routine_id,
          category_id: activity.category_id || null,
          title: activity.activity_name || activity.title || 'Sin título',
          description: activity.description || '',
          day_of_week: activity.day_of_week || null,
          start_time: activity.start_time || null,
          end_time: activity.end_time || null,
          location: activity.location || null,
          datetime_start: activity.datetime_start || null,
          datetime_end: activity.datetime_end || null,
          created_at: activity.created_at || null,
          updated_at: activity.updated_at || null,
          icon: activity.icon || null,
          category: activity.category || null
        }))
      }));
    } catch (error) {
      console.error('Error al obtener rutinas públicas:', error);
      toast.error('Error al obtener rutinas públicas.');
      throw new Error('Error fetching public routines.');
    }
  }

  async getReceivedRoutinesByUser(): Promise<IReceivedRoutine[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(
        this.httpClient.get<{ message: string, received: IReceivedRoutine[] }>(
          `${this.endpoint}/shared/received`,
          { headers }
        )
      );

      return res.received;
    } catch (error) {
      console.error('Error al obtener rutinas compartidas recibidas:', error);
      toast.error('Error al obtener las rutinas compartidas recibidas.');
      throw new Error('Error fetching received routines.');
    }
  }

  // Crear rutina desde plantilla
  async createRoutineFromTemplate(
    templateId: number, 
    startTime: string, 
    endTime: string, 
    dailyRoutine: string
  ): Promise<IRoutine> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      templateId,
      start_time: startTime,
      end_time: endTime,
      daily_routine: dailyRoutine
    };

    try {
      const res = await lastValueFrom(
        this.httpClient.post<{ message: string, routine: any }>(
          `${this.endpoint}/create-from-template`, 
          body, 
          { headers }
        )
      );
      
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
        activities: (res.routine.activities || []).map((activity: any) => ({
          activity_id: activity.activity_id,
          routine_id: activity.routine_id || res.routine.routine_id,
          category_id: activity.category_id || null,
          title: activity.activity_name || activity.title || 'Sin título',
          description: activity.description || '',
          day_of_week: activity.day_of_week || null,
          start_time: activity.start_time || null,
          end_time: activity.end_time || null,
          location: activity.location || null,
          datetime_start: activity.datetime_start || null,
          datetime_end: activity.datetime_end || null,
          created_at: activity.created_at || null,
          updated_at: activity.updated_at || null,
          icon: activity.icon || null,
          category: activity.category || null
        }))
      };
    } catch (error) {
      console.error('Error al crear rutina desde plantilla:', error);
      toast.error('Error al crear rutina desde plantilla.');
      throw new Error('Error creating routine from template.');
    }
  }
  
}