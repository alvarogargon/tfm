import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/iuser.interface';
import { IProfileInterest } from '../interfaces/iprofile-interest.interface';
import { toast } from 'ngx-sonner';
import { IProfileGuide } from '../interfaces/iprofile-guide.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'http://localhost:3000/api/users';
  private httpClient = inject(HttpClient);

  async getProfile(): Promise<IUser> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, profile: any }>(`${this.endpoint}/profile`, { headers }));
      return {
        user_id: res.profile.userId,
        username: res.profile.username,
        email: res.profile.email,
        firstName: res.profile.firstName,
        lastName: res.profile.lastName,
        age: res.profile.age,
        numTel: res.profile.numTel,
        gender: res.profile.gender,
        image: res.profile.image,
        role: res.profile.role,
        colorPalette: res.profile.colorPalette,
        availability: res.profile.availability
      };
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      toast.error('Error al obtener el perfil.');
      throw new Error('Error fetching profile.');
    }
  }

  async updateProfile(data: FormData | any): Promise<IUser> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.httpClient.put<{ message: string, profile: any }>(`${this.endpoint}/profile`, data, { headers }));
      return {
        user_id: res.profile.userId,
        username: res.profile.username,
        email: res.profile.email,
        firstName: res.profile.firstName,
        lastName: res.profile.lastName,
        age: res.profile.age,
        numTel: res.profile.numTel,
        gender: res.profile.gender,
        image: res.profile.image,
        role: res.profile.role,
        colorPalette: res.profile.colorPalette,
        availability: res.profile.availability
      };
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil.');
      throw new Error('Error updating profile.');
    }
  }

  async getInterests(userId: number | null): Promise<IProfileInterest[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = userId ? `${this.endpoint}/interests/${userId}` : `${this.endpoint}/interests`;

    try {
      const res = await lastValueFrom(this.httpClient.get<{ message: string, interests: any[] }>(url, { headers }));
      return res.interests.map(interest => ({
        interest_id: interest.interest_id,
        profile_id: interest.profile_id || null,
        interest_name: interest.interest_name,
        priority: interest.priority || 'medium',
        created_at: interest.created_at
      }));
    } catch (error) {
      console.error('Error al obtener intereses:', error);
      toast.error('Error al obtener los intereses.');
      throw new Error('Error fetching interests.');
    }
  }

  async addInterest(interest: { interest_name: string, priority: 'low' | 'medium' | 'high' }, userId?: number): Promise<IProfileInterest> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = userId ? { ...interest, userId } : interest;

    try {
      const res = await lastValueFrom(this.httpClient.post<{ message: string, interest: any }>(`${this.endpoint}/interests`, body, { headers }));
      return {
        interest_id: res.interest.interest_id,
        profile_id: res.interest.profile_id,
        interest_name: res.interest.interest_name,
        priority: res.interest.priority || 'medium',
        created_at: res.interest.created_at
      };
    } catch (error) {
      console.error('Error al añadir interés:', error);
      toast.error('Error al añadir el interés.');
      throw new Error('Error adding interest.');
    }
  }

  async updateAvailability(availability: string): Promise<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return lastValueFrom(
      this.httpClient.put<{ message: string, availability: any }>(
        `${this.endpoint}/availability`,
        { availability },
        { headers }
      )
    );
  }

  async getGuide(userId: number | null){
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.endpoint}/guide/${userId}`;

    try{
      const res = await lastValueFrom(this.httpClient.get<{ message: String, guides: IProfileGuide[]}>(url, {headers}));
      console.log('Guias obtenidos:', res.guides)

      return res.guides

    }catch(error){
      console.error('Error al obtener guias:', error);
      toast.error('Error al obtener los guias.');
      throw new Error('Error fetching guides.');
    }
  }
}