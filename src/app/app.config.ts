import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptores/auth-interceptor';
import { errorInterceptor } from './core/interceptores/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // El orden importa: primero se agrega el token, y el de errores ve la respuesta.
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
