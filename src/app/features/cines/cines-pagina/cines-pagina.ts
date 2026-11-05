import { Component, OnInit, inject, signal } from '@angular/core';
import { Cine, CineDatos } from '../../../core/modelos/cine';
import { CineServicio } from '../../../core/servicios/cine-servicio';
import { Cargando } from '../../../shared/componentes/cargando/cargando';
import { EncabezadoSeccion } from '../../../shared/componentes/encabezado-seccion/encabezado-seccion';
import { CineFormulario } from '../cine-formulario/cine-formulario';
import { CinesTabla } from '../cines-tabla/cines-tabla';

// Misma estructura que PeliculasPagina: si entendiste esa, esta es igual.
@Component({
  selector: 'app-cines-pagina',
  imports: [EncabezadoSeccion, Cargando, CineFormulario, CinesTabla],
  templateUrl: './cines-pagina.html',
})
export class CinesPagina implements OnInit {
  private readonly servicio = inject(CineServicio);

  protected readonly cines = signal<Cine[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly formulario = signal<Cine | 'nueva' | null>(null);
  protected readonly guardando = signal(false);
  protected readonly errorGuardado = signal<string | null>(null);

  ngOnInit() {
    this.cargar();
  }

  protected cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.servicio.listar().subscribe({
      next: (cines) => {
        this.cines.set(cines);
        this.cargando.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }

  protected abrirFormulario(valor: Cine | 'nueva') {
    this.errorGuardado.set(null);
    this.formulario.set(valor);
  }

  protected cerrarFormulario() {
    this.errorGuardado.set(null);
    this.formulario.set(null);
  }

  protected guardar(datos: CineDatos) {
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
