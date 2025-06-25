import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IGuideUser } from '../interfaces/iguide-user.interface';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class GuideUserService {
  private endpoint = 'http://localhost:3000/api/guide-user';
  private httpClient = inject(HttpClient);

  async getGuideUserRelations(): Promise<IGuideUser[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, relations: any[] }>(this.endpoint, { headers }));
      return res.relations.map(relation => ({
        guide_user_id: relation.guide_user_id,
        guide_id: relation.guide.user_id,
        user_id: relation.user.user_id,
        created_at: relation.created_at,
        user: {
          user_id: relation.user.user_id,
          username: relation.user.username,
          firstName: relation.user.first_name,
          lastName: relation.user.last_name,
          role: relation.user.role
        }
      }));
    } catch (error) {
      console.error('Error al obtener relaciones guía-usuario:', error);
      toast.error('Error al obtener las relaciones guía-usuario.');
      throw new Error('Error fetching guide-user relations.');
    }
  }

  async createGuideUserRelation(guideId: number, userId: number): Promise<IGuideUser> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { guide_id: guideId, user_id: userId };

    try {
      const res = await lastValueFrom(this.httpClient.post<{ message: string, relation: any }>(this.endpoint, body, { headers }));
      return {
        guide_user_id: res.relation.guide_user_id,
        guide_id: res.relation.guide.user_id,
        user_id: res.relation.user.user_id,
        created_at: res.relation.created_at,
        user: {
          user_id: res.relation.user.user_id,
          username: res.relation.user.username,
          firstName: res.relation.user.first_name,
          lastName: res.relation.user.last_name,
          role: res.relation.user.role
        }
      };
    } catch (error) {
      console.error('Error al crear relación guía-usuario:', error);
      toast.error('Error al crear la relación guía-usuario.');
      throw new Error('Error creating guide-user relation.');
    }
  }

  async deleteGuideUserRelation(guideUserId: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      await lastValueFrom(this.httpClient.delete<void>(`${this.endpoint}/${guideUserId}`, { headers }));
      toast.success('Relación eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar relación guía-usuario:', error);
      toast.error('Error al eliminar la relación.');
      throw new Error('Error deleting guide-user relation.');
    }
  }
}