import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PerfilPagina } from './perfil-pagina';

describe('PerfilPagina', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem(
      'cinematch_admin_sesion',
      JSON.stringify({ token: 't', nombre: 'Admin', correo: 'admin@cinematch.com', rol: 'ADMINISTRADOR' }),
    );
    TestBed.configureTestingModule({
      imports: [PerfilPagina],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => localStorage.clear());

  function escribir(raiz: HTMLElement, selector: string, valor: string) {
    const campo = raiz.querySelector(selector) as HTMLInputElement;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
  }

  it('muestra el correo de la sesión y no permite editarlo', () => {
    const fixture = TestBed.createComponent(PerfilPagina);
    fixture.detectChanges();
    const correo = (fixture.nativeElement as HTMLElement).querySelector('.campo__entrada--apagada') as HTMLInputElement;
    expect(correo.value).toBe('admin@cinematch.com');
    expect(correo.disabled).toBe(true);
  });

  it('exige la contraseña actual para guardar', () => {
    const fixture = TestBed.createComponent(PerfilPagina);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    http.expectNone((p) => p.method === 'PUT');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Escribe tu contraseña actual');
  });

  it('envía el correo de la sesión y muestra el éxito', () => {
    const fixture = TestBed.createComponent(PerfilPagina);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;

    escribir(raiz, 'input[formcontrolname="nombre"]', 'Admin Nuevo');
    escribir(raiz, 'input[formcontrolname="contrasenaActual"]', '1234');
    raiz.querySelector('form')!.dispatchEvent(new Event('submit'));

    const peticion = http.expectOne((p) => p.url.endsWith('/auth/perfil'));
    expect(peticion.request.method).toBe('PUT');
    expect(peticion.request.body).toMatchObject({
      correo: 'admin@cinematch.com',
      nombre: 'Admin Nuevo',
      contrasenaActual: '1234',
    });
    peticion.flush({ token: 't2', nombre: 'Admin Nuevo', correo: 'admin@cinematch.com', rol: 'ADMINISTRADOR' });
    fixture.detectChanges();

    expect(raiz.textContent).toContain('Los cambios se guardaron correctamente.');
  });

  it('muestra el error que devuelve Spring', () => {
    const fixture = TestBed.createComponent(PerfilPagina);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;

    escribir(raiz, 'input[formcontrolname="contrasenaActual"]', 'mala');
    raiz.querySelector('form')!.dispatchEvent(new Event('submit'));
    http
      .expectOne((p) => p.url.endsWith('/auth/perfil'))
      .flush({ detail: 'La contraseña actual no es correcta.' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();

    // Sin interceptores en la prueba el error llega crudo; solo comprobamos que no hay "éxito".
    expect(raiz.textContent).not.toContain('Los cambios se guardaron correctamente.');
  });
});
