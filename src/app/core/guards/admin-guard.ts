import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServicio } from '../servicios/auth-servicio';

// UN GUARD decide si se puede entrar a una ruta. Es el equivalente de
// <RutaProtegida /> en React: si no hay sesión de administrador, manda a
// /ingresar y le avisa a dónde quería ir (`desde`) para volver ahí después.
export const adminGuard: CanActivateFn = (_ruta, estado) => {
  const auth = inject(AuthServicio);
  const router = inject(Router);

  if (auth.estaAutenticado()) return true;
  return router.createUrlTree(['/ingresar'], { queryParams: { desde: estado.url } });
};
