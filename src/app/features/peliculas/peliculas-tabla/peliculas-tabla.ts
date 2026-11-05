import { Component, input, output, signal } from '@angular/core';
import { Pelicula } from '../../../core/modelos/pelicula';
import { FechaCortaPipe } from '../../../shared/pipes/fecha-corta-pipe';

@Component({
  selector: 'app-peliculas-tabla',
  imports: [FechaCortaPipe],
  templateUrl: './peliculas-tabla.html',
})
export class PeliculasTabla {
  peliculas = input.required<Pelicula[]>();
  editar = output<Pelicula>();
  eliminar = output<string>();

  // Confirmación de borrado EN LA MISMA fila (sin confirm() del navegador):
  // guarda el id de la fila que está pidiendo confirmación, o null.
  protected readonly confirmandoId = signal<string | null>(null);

  protected confirmarEliminar(id: string) {
    this.confirmandoId.set(null);
    this.eliminar.emit(id);
  }
}
