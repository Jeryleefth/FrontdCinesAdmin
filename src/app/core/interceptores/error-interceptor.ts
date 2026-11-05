import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// UN INTERCEPTOR es una función que ve TODAS las peticiones HTTP (y sus
// respuestas) antes de que lleguen a tu código. Es el equivalente del
// envoltorio `solicitar()` de clienteHttp.js en React: aquí se maneja el
// error una sola vez para toda la aplicación.
//
// Spring devuelve los errores como ProblemDetail: { title, detail, status }.
// Los convertimos en un Error normal con un mensaje legible.
export const errorInterceptor: HttpInterceptorFn = (peticion, siguiente) =>
  siguiente(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensaje: string;
      if (error.status === 0) {
        // Status 0 = el navegador no pudo completar la petición: Spring apagado,
        // puerto equivocado o CORS que no permite este origen (http://localhost:4200).
        mensaje =
          'No se pudo conectar con el servidor. Revisa que Spring Boot esté corriendo en el puerto 8081 ' +
          'y que su CORS permita http://localhost:4200.';
      } else {
        mensaje = error.error?.detail ?? error.error?.title ?? `Error ${error.status}`;
      }
      return throwError(() => new Error(mensaje));
    }),
  );
