import { Component, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cine } from '../../../core/modelos/cine';
import { Funcion, FuncionDatos, TIPOS_FUNCION, TipoFuncion } from '../../../core/modelos/funcion';
import { Pelicula } from '../../../core/modelos/pelicula';
import { MINUTOS_PREVIO_FUNCION, calcularHoraFin } from '../../../shared/utilidades/horario';

@Component({
  selector: 'app-funcion-formulario',
  imports: [ReactiveFormsModule],
  templateUrl: './funcion-formulario.html',
  styleUrl: './funcion-formulario.css',
})
export class FuncionFormulario {
  private readonly fb = inject(FormBuilder);

  funcionInicial = input<Funcion | null>(null);
  peliculas = input.required<Pelicula[]>();
  cines = input.required<Cine[]>();
  guardando = input(false);
  error = input<string | null>(null);
  guardar = output<FuncionDatos>();
  cancelar = output<void>();

  protected readonly tiposFuncion = TIPOS_FUNCION;
  protected readonly minutosPrevios = MINUTOS_PREVIO_FUNCION;

  protected readonly formulario = this.fb.nonNullable.group({
    peliculaId: ['', Validators.required],
    tipoFuncion: ['Doblada' as TipoFuncion],
    cineId: ['', Validators.required],
    salaId: ['', Validators.required],
    fecha: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    // Spring rechaza precios <= 0 ("El precio debe ser mayor a 0."), así que lo validamos aquí también.
    precio: [null as number | null, [Validators.required, Validators.min(1)]],
    formato: ['', Validators.required],
  });

  constructor() {
    const controles = this.formulario.controls;

    // CAMPOS EN CASCADA. En React esto eran manejadores a mano (cambiarCine,
    // cambiarSala…). Aquí nos suscribimos a los cambios de cada campo:
    // `valueChanges` es un flujo que emite cada vez que el usuario cambia el valor.

    // Cambiar de cine invalida la sala elegida (era de OTRO cine).
    controles.cineId.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.formulario.patchValue({ salaId: '', formato: '' }, { emitEvent: false });
      this.sincronizarSala();
    });

    // El formato (2D/3D/VIP) no se escribe: es el tipo de la sala elegida.
    controles.salaId.valueChanges.pipe(takeUntilDestroyed()).subscribe((salaId) => {
      const sala = this.salasDisponibles().find((s) => s.id === salaId);
      controles.formato.setValue(sala?.tipo ?? '', { emitEvent: false });
    });

    // La hora de fin = inicio + duración de la película + anuncios.
    controles.peliculaId.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.recalcularHoraFin());
    controles.horaInicio.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.recalcularHoraFin());

    // Al abrir "nueva" o al editar otra función se recargan los valores.
    // `emitEvent: false` evita que esa carga dispare las cascadas de arriba
    // (borrarían la sala que acabamos de poner).
    effect(() => {
      const funcion = this.funcionInicial();
      this.formulario.reset(
        {
          peliculaId: funcion?.peliculaId ?? '',
          tipoFuncion: funcion?.tipoFuncion ?? 'Doblada',
          cineId: funcion?.cine.id ?? '',
          salaId: funcion?.sala.id ?? '',
          fecha: funcion?.fecha ?? '',
          horaInicio: funcion?.horaInicio ?? '',
          horaFin: funcion?.horaFin ?? '',
          precio: funcion?.precio ?? null,
          formato: funcion?.formato ?? '',
        },
        { emitEvent: false },
      );
      this.sincronizarSala();
    });
  }

  /**
   * La sala solo se puede elegir cuando ya hay un cine. Se deshabilita el
   * CONTROL del formulario (no el atributo HTML): con formularios reactivos,
   * Angular es quien manda sobre el estado habilitado/deshabilitado del campo.
   */
  private sincronizarSala() {
    const { cineId, salaId } = this.formulario.controls;
    if (cineId.value) salaId.enable({ emitEvent: false });
    else salaId.disable({ emitEvent: false });
  }

  /** Salas del cine elegido (vacío hasta que se elige un cine). */
  protected salasDisponibles() {
    const cineId = this.formulario.controls.cineId.value;
    return this.cines().find((cine) => cine.id === cineId)?.salas ?? [];
  }

  protected peliculaSeleccionada() {
    const peliculaId = this.formulario.controls.peliculaId.value;
    return this.peliculas().find((pelicula) => pelicula.id === peliculaId);
  }

  private recalcularHoraFin() {
    const horaFin = calcularHoraFin(
      this.formulario.controls.horaInicio.value,
      this.peliculaSeleccionada()?.duracion ?? 0,
    );
    this.formulario.controls.horaFin.setValue(horaFin, { emitEvent: false });
  }

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
    this.guardar.emit({ ...valores, precio: Number(valores.precio) });
  }
}
