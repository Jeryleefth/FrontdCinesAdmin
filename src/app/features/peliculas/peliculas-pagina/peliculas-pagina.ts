import { Component, OnInit, inject, signal } from '@angular/core';
import { Pelicula, PeliculaDatos } from '../../../core/modelos/pelicula';
import { PeliculaServicio } from '../../../core/servicios/pelicula-servicio';
import { Cargando } from '../../../shared/componentes/cargando/cargando';
import { EncabezadoSeccion } from '../../../shared/componentes/encabezado-seccion/encabezado-seccion';
import { PeliculaFormulario } from '../pelicula-formulario/pelicula-formulario';
import { PeliculasTabla } from '../peliculas-tabla/peliculas-tabla';

// Página "inteligente": es la que habla con el servicio y guarda el estado.
// El formulario y la tabla son componentes "tontos": reciben datos con
// input() y avisan lo que pasó con output(). (Mismo reparto que en React:
// PanelAdmin / FormularioPelicula / TablaPeliculas.)
@Component({
  selector: 'app-peliculas-pagina',
  imports: [EncabezadoSeccion, Cargando, PeliculaFormulario, PeliculasTabla],
  templateUrl: './peliculas-pagina.html',
})
export class PeliculasPagina implements OnInit {
  private readonly servicio = inject(PeliculaServicio);

  protected readonly peliculas = signal<Pelicula[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  // Un solo estado decide qué se ve (igual que en React):
  //   null     -> no hay formulario abierto
  //   'nueva'  -> formulario vacío, para crear
  //   Pelicula -> formulario con esos datos, para editar
  protected readonly formulario = signal<Pelicula | 'nueva' | null>(null);
  protected readonly guardando = signal(false);
  protected readonly errorGuardado = signal<string | null>(null);

  // ngOnInit se ejecuta una vez, cuando el componente ya está en pantalla
  // (en React: useEffect(() => {...}, [])).
  ngOnInit() {
    this.cargar();
  }

  protected cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.servicio.listar().subscribe({
      next: (peliculas) => {
        this.peliculas.set(peliculas);
        this.cargando.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }

  protected abrirFormulario(valor: Pelicula | 'nueva') {
    this.errorGuardado.set(null);
    this.formulario.set(valor);
  }

  protected cerrarFormulario() {
    this.errorGuardado.set(null);
    this.formulario.set(null);
  }

  protected guardar(datos: PeliculaDatos) {
    const actual = this.formulario();
    if (!actual) return;

    this.guardando.set(true);
    this.errorGuardado.set(null);

    const peticion =
      actual === 'nueva' ? this.servicio.crear(datos) : this.servicio.actualizar(actual.id, datos);

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
    this.servicio.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: (e: Error) => this.error.set(e.message),
    });
  }
}
