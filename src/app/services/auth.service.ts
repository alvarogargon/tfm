import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserLogin, IUserRegister } from '../interfaces/iuser.interface';
import { lastValueFrom, Subject } from 'rxjs';

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
  private loginStatusSubject = new Subject<void>();
  loginStatus$ = this.loginStatusSubject.asObservable();

  async login(credentials: IUserLogin): Promise<LoginResponse> {
    try {
      const res = await lastValueFrom(this.httpClient.post<LoginResponse>(`${this.endpoint}/login`, credentials));
      this.currentUser = res.user;
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.setItem('token', res.token); 
      this.loginStatusSubject.next();
      return res;
    } catch (error: any) {
      if (error.status === 401) {
        throw new Error('Usuario y/o contraseña incorrectos.');
      }
      throw new Error('Error al iniciar sesión.');
    }
  } 

  async register(credentials: IUserRegister): Promise<RegisterResponse> {
    try {
      const res = await lastValueFrom(this.httpClient.post<RegisterResponse>(`${this.endpoint}/register`, credentials));
      this.currentUser = res.user;
      localStorage.setItem('user', JSON.stringify(res.user));
      return res;
    } catch (error: any) {
      if (error.status === 409) {
        throw new Error('El email introducido ya está registrado.');
      }
      throw new Error('Error en el registro.')
    }
  }

  getCurrentUserId(): number | undefined {
    return this.currentUser?.userId;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
