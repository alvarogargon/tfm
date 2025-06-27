import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ICategory } from '../interfaces/icategory.interface';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/categories';

  async getCategories(): Promise<ICategory[]> {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      throw new Error('No token found. Please log in.');
    }
    try {
      const response = await lastValueFrom(
        this.http.get<{ message: string; categories: ICategory[] }>(this.baseUrl, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      console.log('Respuesta de categorías:', response);
      return response.categories;
    } catch (error: any) {
      console.error('Error al obtener categorías:', error);
      if (error.status === 403) {
        toast.error('No autorizado para acceder a las categorías.');
      } else {
        toast.error('Error al obtener las categorías.');
      }
      throw error;
    }
  }

  async createCategory(category: { name: string; color?: string; icon?: string; description?: string }): Promise<ICategory> {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      throw new Error('No token found. Please log in.');
    }
    try {
      const response = await lastValueFrom(
        this.http.post<{ message: string; category: ICategory }>(this.baseUrl, category, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      return response.category;
    } catch (error: any) {
      console.error('Error al crear categoría:', error);
      if (error.status === 400) {
        toast.error(error.error?.message || 'Datos inválidos');
      } else if (error.status === 403) {
        toast.error('Solo los guías pueden crear categorías');
      } else if (error.status === 409) {
        toast.error('La categoría ya existe');
      } else {
        toast.error('Error al crear la categoría.');
      }
      throw error;
    }
  }
}