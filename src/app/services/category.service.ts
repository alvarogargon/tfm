import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ICategory } from '../interfaces/icategory.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/categories';
  private token = localStorage.getItem('auth_token') || '';

  async getCategories(): Promise<ICategory[]> {
    try {
      const response = await lastValueFrom(
        this.http.get<{ message: string; categories: ICategory[] }>(this.baseUrl, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
      );
      return response.categories;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(category: { name: string; color?: string; icon?: string; description?: string }): Promise<ICategory> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ message: string; category: ICategory }>(this.baseUrl, category, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
      );
      return response.category;
    } catch (error: any) {
      if (error.status === 400) {
        throw new Error(error.error.message || 'Datos inválidos');
      } else if (error.status === 403) {
        throw new Error('Solo los guías pueden crear categorías');
      } else if (error.status === 409) {
        throw new Error('La categoría ya existe');
      }
      throw error;
    }
  }
}