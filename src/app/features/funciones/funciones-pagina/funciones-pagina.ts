import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Cine } from '../../../core/modelos/cine';
import { Funcion, FuncionDatos } from '../../../core/modelos/funcion';
import { Pelicula } from '../../../core/modelos/pelicula';
import { CineServicio } from '../../../core/servicios/cine-servicio';
import { FuncionServicio } from '../../../core/servicios/funcion-servicio';
import { PeliculaServicio } from '../../../core/servicios/pelicula-servicio';
import { Cargando } from '../../../shared/componentes/cargando/cargando';
import { EncabezadoSeccion } from '../../../shared/componentes/encabezado-seccion/encabezado-seccion';
import { FuncionFormulario } from '../funcion-formulario/funcion-formulario';
import { FuncionesTabla } from '../funciones-tabla/funciones-tabla';

@Component({
  selector: 'app-funciones-pagina',
  imports: [EncabezadoSeccion, Cargando, FuncionFormulario, FuncionesTabla],
  templateUrl: './funciones-pagina.html',
})
export class FuncionesPagina implements OnInit {
  private readonly funcionServicio = inject(FuncionServicio);
  private readonly peliculaServicio = inject(PeliculaServicio);
  private readonly cineServicio = inject(CineServicio);

  protected readonly funciones = signal<Funcion[]>([]);
  protected readonly peliculas = signal<Pelicula[]>([]);
  protected readonly cines = signal<Cine[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly formulario = signal<Funcion | 'nueva' | null>(null);
  protected readonly guardando = signal(false);
  protected readonly errorGuardado = signal<string | null>(null);

  // `computed` deriva un valor de otras signals y se recalcula SOLO cuando
  // cambian (en React: useMemo).
  protected readonly peliculasPorId = computed(
    () => new Map(this.peliculas().map((pelicula) => [pelicula.id, pelicula])),
  );
  protected readonly faltanDatos = computed(() => this.peliculas().length === 0 || this.cines().length === 0);

  ngOnInit() {
    this.cargar();
  }

  protected cargar() {
    this.cargando.set(true);
    this.error.set(null);

    // Una función necesita las películas y los cines (para los <select> y para
    // mostrar títulos). `forkJoin` lanza las 3 peticiones a la vez y espera a
    // que terminen todas.
    forkJoin({
      funciones: this.funcionServicio.listar(),
      peliculas: this.peliculaServicio.listar(),
      cines: this.cineServicio.listar(),
    }).subscribe({
      next: ({ funciones, peliculas, cines }) => {
        this.funciones.set(funciones);
        this.peliculas.set(peliculas);
        this.cines.set(cines);
        this.cargando.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }

  protected abrirFormulario(valor: Funcion | 'nueva') {
    this.errorGuardado.set(null);
    this.formulario.set(valor);
  }

  protected cerrarFormulario() {
    this.errorGuardado.set(null);
    this.formulario.set(null);
  }

  protected guardar(datos: FuncionDatos) {
    const actual = this.formulario();
    if (!actual) return;

    this.guardando.set(true);
    this.errorGuardado.set(null);

    const peticion =
      actual === 'nueva'
        ? this.funcionServicio.crear(datos)
        : this.funcionServicio.actualizar(actual.id, datos);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarFormulario();
        this.cargar();
      },
      error: (e: Error) => {
        this.guardando.set(false);
        this.errorGuardado.set(e.message);
      },
    });
  }

  protected eliminar(id: string) {
    this.error.set(null);
    this.funcionServicio.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: (e: Error) => this.error.set(e.message),
    });
  }
}
