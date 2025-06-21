import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http'; // Asegura la importación de HttpInterceptorFn
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Clonar la solicitud y añadir el token si existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Manejar la respuesta y errores
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión de nuevo.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        toast.error('Acceso denegado.');
      }
      return throwError(() => error);
    })
  );
};