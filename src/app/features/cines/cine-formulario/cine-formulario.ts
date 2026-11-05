import { Component, effect, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CADENAS, Cine, CineDatos, Sala, TIPOS_SALA, TipoSala } from '../../../core/modelos/cine';

// Un VALIDADOR propio: devuelve null si todo está bien o un objeto con el error.
// (Ojo: `Validators.minLength(1)` NO sirve aquí, porque Angular considera que una
// lista vacía "no tiene valor" y la da por válida.)
const alMenosUnaSala: ValidatorFn = (control) =>
  Array.isArray(control.value) && control.value.length > 0 ? null : { sinSalas: true };

// Cada sala del formulario es un grupo de controles. Esta función crea uno
// (vacío, o con los datos de una sala que ya existe).
function crearSalaGrupo(fb: NonNullableFormBuilder, sala?: Sala) {
  return fb.group({
    id: fb.control<string | null>(sala?.id ?? null),
    nombre: fb.control(sala?.nombre ?? '', Validators.required),
    capacidad: fb.control<number | null>(sala?.capacidad ?? null, [Validators.required, Validators.min(1)]),
    tipo: fb.control<TipoSala>(sala?.tipo ?? '2D'),
  });
}

@Component({
  selector: 'app-cine-formulario',
  imports: [ReactiveFormsModule],
  templateUrl: './cine-formulario.html',
  styleUrl: './cine-formulario.css',
})
export class CineFormulario {
  private readonly fb: NonNullableFormBuilder = inject(FormBuilder).nonNullable;

  cineInicial = input<Cine | null>(null);
  guardando = input(false);
  error = input<string | null>(null);
  guardar = output<CineDatos>();
  cancelar = output<void>();

  protected readonly cadenas = CADENAS;
  protected readonly tiposSala = TIPOS_SALA;
  protected readonly intentoEnvio = signal(false);

  // FormArray: una lista de controles que puede crecer y encogerse.
  // En React las salas eran un array dentro del estado y había que copiarlo
  // a mano en cada cambio (cambiarSala, agregarSala, quitarSala). Aquí el
  // FormArray ya trae push() y removeAt().
  protected readonly formulario = this.fb.group({
    cadena: ['', Validators.required],
    nombre: ['', Validators.required],
    direccion: ['', Validators.required],
    ciudad: ['Ibagué', Validators.required],
    salas: this.fb.array([] as ReturnType<typeof crearSalaGrupo>[], alMenosUnaSala),
  });

  protected get salas() {
    return this.formulario.controls.salas;
  }

  constructor() {
    // Al abrir "nuevo" o al editar otro cine, se recargan los valores.
    effect(() => {
      const cine = this.cineInicial();
      this.salas.clear();
      cine?.salas.forEach((sala) => this.salas.push(crearSalaGrupo(this.fb, sala)));
      this.formulario.reset({
        cadena: cine?.cadena ?? '',
        nombre: cine?.nombre ?? '',
        direccion: cine?.direccion ?? '',
        ciudad: cine?.ciudad ?? 'Ibagué',
      });
      this.intentoEnvio.set(false);
    });
  }

  protected invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && control.touched;
  }

  protected agregarSala() {
    this.salas.push(crearSalaGrupo(this.fb));
  }

  protected quitarSala(indice: number) {
    this.salas.removeAt(indice);
  }

  protected enviar() {
    this.intentoEnvio.set(true);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const valores = this.formulario.getRawValue();
    this.guardar.emit({
      cadena: valores.cadena,
      nombre: valores.nombre,
      direccion: valores.direccion,
      ciudad: valores.ciudad,
      // Las salas NUEVAS no llevan `id` (lo asigna Spring); las que ya existían lo conservan.
      salas: valores.salas.map((sala) => ({
        ...(sala.id ? { id: sala.id } : {}),
        nombre: sala.nombre,
        capacidad: Number(sala.capacidad),
        tipo: sala.tipo,
      })),
    });
  }
}
