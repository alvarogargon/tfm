import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserLogin, IUserRegister } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';

interface LoginResponse {
  message: string; 
  token: string;
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

interface RegisterResponse {
  message: string;
  user: {
    userId: number;
    username: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = 'http://localhost:3000/api/auth';
  private httpClient = inject(HttpClient);

  login(credentials: IUserLogin): Promise<LoginResponse> {
    return lastValueFrom(this.httpClient.post<LoginResponse>(`${this.endpoint}/login`, credentials));
  }

  register(credentials: IUserRegister): Promise<RegisterResponse> {
    return lastValueFrom(this.httpClient.post<RegisterResponse>(`${this.endpoint}/register`, credentials));
  }
}
