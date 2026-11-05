import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pelicula, PeliculaDatos } from '../../../core/modelos/pelicula';

// Clasificación por edades del Comité de Clasificación de Películas de
// Colombia (la que aparece en la boletería), no la escala MPAA (PG-13, R…).
const CLASIFICACIONES_COLOMBIA = [
  { valor: 'T', texto: 'T — Todo público' },
  { valor: '+7', texto: '7 — Mayores de 7 años' },
  { valor: '+12', texto: '12 — Mayores de 12 años' },
  { valor: '+15', texto: '15 — Mayores de 15 años' },
  { valor: '+18', texto: '18 — Exclusivo para mayores de 18 años' },
];

const VALORES_VACIOS = {
  titulo: '',
  sinopsis: '',
  duracion: null as number | null,
  genero: '',
  clasificacion: '',
  idioma: '',
  fechaEstreno: '',
  rutaImagen: '',
};

@Component({
  selector: 'app-pelicula-formulario',
  imports: [ReactiveFormsModule],
  templateUrl: './pelicula-formulario.html',
})
export class PeliculaFormulario {
  private readonly fb = inject(FormBuilder);

  // Entradas (props en React) y salidas (callbacks en React).
  peliculaInicial = input<Pelicula | null>(null);
  guardando = input(false);
  error = input<string | null>(null);
  guardar = output<PeliculaDatos>();
  cancelar = output<void>();

  protected readonly clasificaciones = CLASIFICACIONES_COLOMBIA;

  // Un campo por control, cada uno con sus validaciones. Reemplaza al
  // `useState` + `manejarCambio` de React: no hace falta un manejador de
  // cambios, el formulario ya sabe qué valor tiene cada campo.
  protected readonly formulario = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    sinopsis: ['', Validators.required],
    duracion: [null as number | null, [Validators.required, Validators.min(1)]],
    genero: ['', Validators.required],
    clasificacion: ['', Validators.required],
    idioma: ['', Validators.required],
    fechaEstreno: ['', Validators.required],
    rutaImagen: ['', [Validators.required, Validators.pattern(/^https?:\/\/\S+$/)]],
  });

  constructor() {
    // Cada vez que cambia `peliculaInicial` (se abre "nueva" o se edita otra
    // película) se recargan los valores del formulario. Es lo que en React
    // se resolvía con `key` para recrear el componente.
    effect(() => {
      const pelicula = this.peliculaInicial();
      this.formulario.reset(
        pelicula
          ? {
              titulo: pelicula.titulo,
              sinopsis: pelicula.sinopsis,
              duracion: pelicula.duracion,
              genero: pelicula.genero,
              clasificacion: pelicula.clasificacion,
              idioma: pelicula.idioma,
              fechaEstreno: pelicula.fechaEstreno,
              rutaImagen: pelicula.rutaImagen,
            }
          : VALORES_VACIOS,
      );
    });
  }

  /** ¿Mostrar el error de este campo? (es inválido y ya lo tocaron) */
  protected invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && control.touched;
  }

  protected enviar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const valores = this.formulario.getRawValue();
    this.guardar.emit({ ...valores, duracion: Number(valores.duracion) });
  }
}
