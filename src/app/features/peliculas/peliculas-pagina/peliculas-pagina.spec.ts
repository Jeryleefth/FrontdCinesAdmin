import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Pelicula } from '../../../core/modelos/pelicula';
import { PeliculasPagina } from './peliculas-pagina';

const PELICULA: Pelicula = {
  id: 'p1',
  titulo: 'Interestelar',
  sinopsis: 'Viaje espacial.',
  duracion: 169,
  genero: 'Ciencia ficción',
  clasificacion: '+12',
  idioma: 'Inglés',
  fechaEstreno: '2014-11-06',
  rutaImagen: 'https://ejemplo.com/poster.jpg',
};

describe('PeliculasPagina', () => {
  let http: HttpTestingController;

  function crear() {
    const fixture = TestBed.createComponent(PeliculasPagina);
    fixture.detectChanges();
    http.expectOne((p) => p.url.endsWith('/peliculas') && p.method === 'GET').flush([PELICULA]);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PeliculasPagina],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  it('lista las películas que devuelve la API', () => {
    const fixture = crear();
    const filas = (fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr');
    expect(filas.length).toBe(1);
    expect(filas[0].textContent).toContain('Interestelar');
    expect(filas[0].textContent).toContain('06/11/2014');
  });

  it('abre el formulario al pulsar "Agregar película"', () => {
    const fixture = crear();
    const raiz = fixture.nativeElement as HTMLElement;
    expect(raiz.querySelector('form')).toBeNull();

    (raiz.querySelector('.boton--principal') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(raiz.querySelector('form')).not.toBeNull();
  });

  it('no envía nada si el formulario es inválido', () => {
    const fixture = crear();
    const raiz = fixture.nativeElement as HTMLElement;
    (raiz.querySelector('.boton--principal') as HTMLButtonElement).click();
    fixture.detectChanges();

    (raiz.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    http.expectNone((p) => p.method === 'POST');
    expect(raiz.querySelector('.formulario__error')).not.toBeNull();
  });
});
