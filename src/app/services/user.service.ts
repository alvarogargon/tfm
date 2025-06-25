import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/iuser.interface';
import { IProfileInterest } from '../interfaces/iprofile-interest.interface';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'http://localhost:3000/api/users';
  private httpClient = inject(HttpClient);

  async getProfile(): Promise<IUser> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token. Por favor, inicia sesión.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, profile: any }>(`${this.endpoint}/profile`, { headers }));
      return {
        user_id: res.profile.user_id,
        username: res.profile.username,
        email: res.profile.email,
        firstName: res.profile.first_name,
        lastName: res.profile.last_name,
        age: res.profile.age,
        numTel: res.profile.num_tel,
        gender: res.profile.gender,
        image: res.profile.image,
        role: res.profile.role,
        availability: res.profile.availability,
        colorPalette: res.profile.colorPalette,
        created_at: res.profile.created_at,
        updated_at: res.profile.updated_at
      };
    } catch (error: any) {
      console.error('Error al obtener perfil:', error);
      toast.error('Error al obtener el perfil.');
      throw new Error('Error al obtener el perfil de usuario.');
    }
  }

  async updateProfile(formData: FormData): Promise<IUser> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token. Por favor, inicia sesión.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.put<{ message: string, profile: any }>(`${this.endpoint}/profile`, formData, { headers }));
      return {
        user_id: res.profile.user_id,
        username: res.profile.username,
        email: res.profile.email,
        firstName: res.profile.first_name,
        lastName: res.profile.last_name,
        age: res.profile.age,
        numTel: res.profile.num_tel,
        gender: res.profile.gender,
        image: res.profile.image,
        role: res.profile.role,
        availability: res.profile.availability,
        colorPalette: res.profile.colorPalette,
        created_at: res.profile.created_at,
        updated_at: res.profile.updated_at
      };
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar el perfil.');
      throw new Error('Error al actualizar el perfil de usuario.');
    }
  }

  async getInterests(): Promise<IProfileInterest[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token. Por favor, inicia sesión.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, interests: IProfileInterest[] }>(`${this.endpoint}/interests`, { headers }));
      return res.interests;
    } catch (error: any) {
      console.error('Error al obtener intereses:', error);
      toast.error('Error al obtener los intereses.');
      throw new Error('Error al obtener los intereses.');
    }
  }

  async getInterestsByUserId(userId: number): Promise<IProfileInterest[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token. Por favor, inicia sesión.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, interests: IProfileInterest[] }>(`${this.endpoint}/interests/${userId}`, { headers }));
      return res.interests;
    } catch (error: any) {
      console.error('Error al obtener intereses del usuario:', error);
      toast.error('Error al obtener los intereses del usuario.');
      throw new Error('Error al obtener los intereses del usuario.');
    }
  }

  async addInterest(interest: { interest_name: string, priority: 'low' | 'medium' | 'high' }): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token. Por favor, inicia sesión.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      await lastValueFrom(this.httpClient.post<{ message: string }>(`${this.endpoint}/interests`, interest, { headers }));
      toast.success('Interés añadido con éxito.');
    } catch (error: any) {
      console.error('Error al añadir interés:', error);
      toast.error('Error al añadir el interés.');
      throw new Error('Error al añadir el interés.');
    }
  }
}