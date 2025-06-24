import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IActivity } from '../interfaces/iactivity.interface';

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
      return res.activities;
    } catch (error) {
      throw new Error('Error fetching activities.');
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
      return res.activity;
    } catch (error) {
      throw new Error('Error creating activity.');
    }
  }

  async deleteActivity(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      await lastValueFrom(this.httpClient.delete<void>(`${this.endpoint}/${id}`, { headers }));
    } catch (error) {
      throw new Error('Error deleting activity.');
    }
  }
}