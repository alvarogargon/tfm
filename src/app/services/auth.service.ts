import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserLogin, IUserRegister } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';

interface User {
  userId: number;
  userName?: string; 
  email: string;
  role: string;
}

interface LoginResponse {
  message: string; 
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = 'http://localhost:3000/api/auth';
  private httpClient = inject(HttpClient);
  currentUser?: User;

  async login(credentials: IUserLogin): Promise<LoginResponse> {
    const res = await lastValueFrom(this.httpClient.post<LoginResponse>(`${this.endpoint}/login`, credentials));
    this.currentUser = res.user;
    localStorage.setItem('user', JSON.stringify(res.user));
    return res;
  }

  async register(credentials: IUserRegister): Promise<RegisterResponse> {
    const res = await lastValueFrom(this.httpClient.post<RegisterResponse>(`${this.endpoint}/register`, credentials));
    this.currentUser = res.user;
    localStorage.setItem('user', JSON.stringify(res.user));
    return res;
  }

  getCurrentUserId(): number | undefined {
    return this.currentUser?.userId;
  }
}
