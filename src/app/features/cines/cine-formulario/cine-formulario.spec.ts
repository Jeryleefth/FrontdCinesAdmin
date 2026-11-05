import { TestBed } from '@angular/core/testing';
import { Cine, CineDatos } from '../../../core/modelos/cine';
import { CineFormulario } from './cine-formulario';

const CINE: Cine = {
  id: 'c1',
  cadena: 'Cinemark',
  nombre: 'Cinemark Multicentro',
  direccion: 'C.C. Multicentro',
  ciudad: 'Ibagué',
  salas: [{ id: 's1', nombre: 'Sala 1', capacidad: 80, tipo: '2D' }],
};

describe('CineFormulario', () => {
  function crear(cine: Cine | null) {
    const fixture = TestBed.createComponent(CineFormulario);
    fixture.componentRef.setInput('cineInicial', cine);
    fixture.detectChanges();
    return fixture;
  }

  it('carga las salas del cine que se edita', () => {
    const fixture = crear(CINE);
    const raiz = fixture.nativeElement as HTMLElement;
    expect(raiz.querySelectorAll('.sala').length).toBe(1);
    expect((raiz.querySelector('.sala__nombre') as HTMLInputElement).value).toBe('Sala 1');
  });

  it('agrega y quita salas', () => {
    const fixture = crear(null);
    const raiz = fixture.nativeElement as HTMLElement;
    expect(raiz.querySelectorAll('.sala').length).toBe(0);

    (raiz.querySelector('.salas__encabezado button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(raiz.querySelectorAll('.sala').length).toBe(1);

    (raiz.querySelector('.sala .boton--peligro') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(raiz.querySelectorAll('.sala').length).toBe(0);
  });

  it('no deja guardar un cine sin salas aunque los demás campos estén completos', () => {
    const fixture = crear(null);
    const raiz = fixture.nativeElement as HTMLElement;
    const emitidos: CineDatos[] = [];
    fixture.componentInstance.guardar.subscribe((d) => emitidos.push(d));

    // Todos los campos del cine llenos: lo ÚNICO que falta son las salas.
    fixture.componentInstance['formulario'].patchValue({
      cadena: 'Cinemark',
      nombre: 'Cinemark Multicentro',
      direccion: 'C.C. Multicentro',
    });
    raiz.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(emitidos.length).toBe(0);
    expect(raiz.textContent).toContain('Agrega al menos una sala');
  });

  it('al editar conserva el id de la sala y convierte la capacidad a número', () => {
    const fixture = crear(CINE);
    const emitidos: CineDatos[] = [];
    fixture.componentInstance.guardar.subscribe((d) => emitidos.push(d));

    (fixture.nativeElement as HTMLElement).querySelector('form')!.dispatchEvent(new Event('submit'));

    expect(emitidos.length).toBe(1);
    expect(emitidos[0].salas[0]).toEqual({ id: 's1', nombre: 'Sala 1', capacidad: 80, tipo: '2D' });
  });
});
