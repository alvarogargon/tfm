import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'http://localhost:3000/api/users';
  private httpClient = inject(HttpClient);

  async getProfile(): Promise<IUser> {
    const token = localStorage.getItem('token');
    if(!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, profile: IUser }>(`${this.endpoint}/profile`, { headers }));
      return res.profile;
    } catch (error: any) {
      if (error.status === 401) {
        throw new Error('Unauthorized access. Please log in.');
      } else if (error.status === 404) {
        throw new Error('User profile not found.');
      } else {
        throw new Error('Error fetching user profile.');
      }
    }
  }

}
