import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServicio } from '../servicios/auth-servicio';

// Agrega la cabecera `Authorization: Bearer <token>` a cada petición cuando
// hay sesión iniciada. (Hoy Spring genera un token pero todavía no lo valida;
// dejarlo listo significa que el día que lo valide no hay que tocar nada más.)
export const authInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const token = inject(AuthServicio).sesion()?.token;
  if (!token) return siguiente(peticion);
  return siguiente(peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
