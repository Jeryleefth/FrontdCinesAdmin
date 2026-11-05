import { TestBed } from '@angular/core/testing';
import { Cine } from '../../../core/modelos/cine';
import { FuncionDatos } from '../../../core/modelos/funcion';
import { Pelicula } from '../../../core/modelos/pelicula';
import { FuncionFormulario } from './funcion-formulario';

const PELICULAS: Pelicula[] = [
  {
    id: 'p1',
    titulo: 'Interestelar',
    sinopsis: 'x',
    duracion: 120,
    genero: 'x',
    clasificacion: 'T',
    idioma: 'x',
    fechaEstreno: '2024-01-01',
    rutaImagen: 'https://x.co/a.jpg',
  },
];

const CINES: Cine[] = [
  {
    id: 'c1',
    cadena: 'Cinemark',
    nombre: 'Cinemark Multicentro',
    direccion: 'x',
    ciudad: 'Ibagué',
    salas: [
      { id: 's1', nombre: 'Sala 1', capacidad: 80, tipo: '2D' },
      { id: 's2', nombre: 'Sala VIP', capacidad: 30, tipo: 'VIP' },
    ],
  },
];

describe('FuncionFormulario', () => {
  function crear() {
    const fixture = TestBed.createComponent(FuncionFormulario);
    fixture.componentRef.setInput('peliculas', PELICULAS);
    fixture.componentRef.setInput('cines', CINES);
    fixture.detectChanges();
    return fixture;
  }

  function elegir(fixture: ReturnType<typeof crear>, id: string, valor: string, evento = 'change') {
    const campo = (fixture.nativeElement as HTMLElement).querySelector('#' + id) as HTMLInputElement;
    campo.value = valor;
    campo.dispatchEvent(new Event(evento));
    fixture.detectChanges();
  }

  const texto = (fixture: ReturnType<typeof crear>, id: string) =>
    ((fixture.nativeElement as HTMLElement).querySelector('#' + id) as HTMLInputElement).value;

  it('la sala depende del cine elegido', () => {
    const fixture = crear();
    const salas = () => (fixture.nativeElement as HTMLElement).querySelectorAll('#salaId option:not([disabled])');
    expect(salas().length).toBe(0);

    elegir(fixture, 'cineId', 'c1');
    expect(salas().length).toBe(2);
  });

  it('la sala está deshabilitada hasta elegir un cine', () => {
    const fixture = crear();
    const sala = () => (fixture.nativeElement as HTMLElement).querySelector('#salaId') as HTMLSelectElement;
    expect(sala().disabled).toBe(true);

    elegir(fixture, 'cineId', 'c1');
    expect(sala().disabled).toBe(false);
  });

  it('el formato sale de la sala elegida', () => {
    const fixture = crear();
    elegir(fixture, 'cineId', 'c1');
    elegir(fixture, 'salaId', 's2');
    expect((fixture.nativeElement as HTMLElement).querySelector('.formato')?.textContent).toContain('VIP');
  });

  it('calcula la hora de fin con la duración de la película', () => {
    const fixture = crear();
    elegir(fixture, 'peliculaId', 'p1');
    elegir(fixture, 'horaInicio', '14:00', 'input');
    expect(texto(fixture, 'horaFin')).toBe('16:15');
  });

  it('cambiar de cine borra la sala elegida', () => {
    const fixture = crear();
    elegir(fixture, 'cineId', 'c1');
    elegir(fixture, 'salaId', 's1');
    elegir(fixture, 'cineId', 'c1');
    expect(fixture.componentInstance['formulario'].controls.salaId.value).toBe('');
  });

  it('emite los datos con el precio como número', () => {
    const fixture = crear();
    const emitidos: FuncionDatos[] = [];
    fixture.componentInstance.guardar.subscribe((d) => emitidos.push(d));

    elegir(fixture, 'peliculaId', 'p1');
    elegir(fixture, 'cineId', 'c1');
    elegir(fixture, 'salaId', 's1');
    elegir(fixture, 'fecha', '2026-12-01', 'input');
    elegir(fixture, 'horaInicio', '14:00', 'input');
    elegir(fixture, 'precio', '16500', 'input');
    (fixture.nativeElement as HTMLElement).querySelector('form')!.dispatchEvent(new Event('submit'));

    expect(emitidos.length).toBe(1);
    expect(emitidos[0]).toMatchObject({
      peliculaId: 'p1',
      cineId: 'c1',
      salaId: 's1',
      formato: '2D',
      horaFin: '16:15',
      precio: 16500,
    });
  });
});
