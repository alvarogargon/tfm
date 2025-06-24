import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';
import { IProfileInterest } from '../interfaces/iprofile-interest.interface';
import { lastValueFrom } from 'rxjs';

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
      const res = await lastValueFrom(this.httpClient.get<{ message: string, profile: IUser }>(`${this.endpoint}/profile`, { headers }));
      return res.profile;
    } catch (error: any) {
      if (error.status === 401) {
        throw new Error('Acceso no autorizado. Por favor, inicia sesión.');
      } else if (error.status === 404) {
        throw new Error('Perfil de usuario no encontrado.');
      } else {
        throw new Error('Error al obtener el perfil de usuario.');
      }
    }
  }

  async updateProfile(data: Partial<IUser>): Promise<IUser> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token. Por favor, inicia sesión.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res = await lastValueFrom(
        this.httpClient.put<{ message: string, profile: IUser }>(
          `${this.endpoint}/profile`,
          data,
          { headers }
        ) 
      );
      return res.profile;
    } catch (error: any) {
      if (error.status === 400) {
        throw new Error('Datos inválidos. Por favor, verifica tu entrada.');
      } else if (error.status === 401) {
        throw new Error('Acceso no autorizado. Por favor, inicia sesión.');
      } else {
        throw new Error('Error al actualizar el perfil de usuario.');
      }
    }
  }

  async updateProfileImage(formData: FormData): Promise<IUser> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token. Por favor, inicia sesión.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.put<{ message: string, profile: IUser }>(
          `${this.endpoint}/profile`,
          formData,
          { headers }
        )
      );
      return res.profile;
    } catch (error: any) {
      throw new Error('Error al actualizar la imagen de perfil.');
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
      throw new Error('Error al obtener los intereses.');
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
    } catch (error: any) {
      throw new Error('Error al añadir el interés.');
    }
  }
}