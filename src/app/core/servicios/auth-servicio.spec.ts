import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthServicio } from './auth-servicio';

describe('AuthServicio', () => {
  let auth: AuthServicio;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    auth = TestBed.inject(AuthServicio);
    http = TestBed.inject(HttpTestingController);
  });

  it('empieza sin sesión', () => {
    expect(auth.estaAutenticado()).toBe(false);
  });

  it('guarda la sesión al iniciar sesión como administrador', () => {
    auth.iniciarSesion('admin@cinematch.com', '1234').subscribe();

    const peticion = http.expectOne((p) => p.url.endsWith('/auth/login'));
    expect(peticion.request.method).toBe('POST');
    peticion.flush({ token: 't', nombre: 'Admin', correo: 'admin@cinematch.com', rol: 'ADMINISTRADOR' });

    expect(auth.estaAutenticado()).toBe(true);
    expect(auth.sesion()?.nombre).toBe('Admin');
  });

  it('un cliente NO queda como autenticado en el panel', () => {
    auth.iniciarSesion('cliente@correo.com', '1234').subscribe();
    http
      .expectOne((p) => p.url.endsWith('/auth/login'))
      .flush({ token: 't', nombre: 'Cliente', correo: 'cliente@correo.com', rol: 'CLIENTE' });

    expect(auth.estaAutenticado()).toBe(false);
  });

  it('cerrarSesion borra la sesión', () => {
    auth.iniciarSesion('admin@cinematch.com', '1234').subscribe();
    http
      .expectOne((p) => p.url.endsWith('/auth/login'))
      .flush({ token: 't', nombre: 'Admin', correo: 'admin@cinematch.com', rol: 'ADMINISTRADOR' });

    auth.cerrarSesion();

    expect(auth.sesion()).toBeNull();
  });
});
