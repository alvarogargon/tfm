import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IGuideUser } from '../interfaces/iguide-user.interface';

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
      const res = await lastValueFrom(this.httpClient.get<{ message: string, relations: IGuideUser[] }>(this.endpoint, { headers }));
      return res.relations;
    } catch (error) {
      throw new Error('Error fetching guide-user relations.');
    }
  }

  async createGuideUserRelation(relation: { guide_id: number, user_id: number }): Promise<IGuideUser> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(this.httpClient.post<{ message: string, relation: IGuideUser }>(this.endpoint, relation, { headers }));
      return res.relation;
    } catch (error) {
      throw new Error('Error creating guide-user relation.');
    }
  }

  async deleteGuideUserRelation(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      await lastValueFrom(this.httpClient.delete<void>(`${this.endpoint}/${id}`, { headers }));
    } catch (error) {
      throw new Error('Error deleting guide-user relation.');
    }
  }
}