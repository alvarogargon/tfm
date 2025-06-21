import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Paso por el interceptor')
  // logica del interceptor
  // añadir aquí la cabecera a la peticion, clonando la peticion de salida
  const cloneRequest = req.clone({
    setHeaders: {
        'Content-type': 'application/json',
        'Authorization': localStorage.getItem('token') || ""
      }
  })
  return next(cloneRequest);
};
