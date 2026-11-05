import { Component, input, output, signal } from '@angular/core';
import { Funcion } from '../../../core/modelos/funcion';
import { Pelicula } from '../../../core/modelos/pelicula';
import { FechaCortaPipe } from '../../../shared/pipes/fecha-corta-pipe';
import { PrecioCopPipe } from '../../../shared/pipes/precio-cop-pipe';

@Component({
  selector: 'app-funciones-tabla',
  imports: [FechaCortaPipe, PrecioCopPipe],
  templateUrl: './funciones-tabla.html',
})
export class FuncionesTabla {
  funciones = input.required<Funcion[]>();
  // Una función solo trae `peliculaId`; este mapa permite mostrar el título.
  peliculasPorId = input.required<Map<string, Pelicula>>();
  editar = output<Funcion>();
  eliminar = output<string>();

  protected readonly confirmandoId = signal<string | null>(null);

  protected confirmarEliminar(id: string) {
    this.confirmandoId.set(null);
    this.eliminar.emit(id);
  }
}
