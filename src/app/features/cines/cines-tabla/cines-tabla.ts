import { Component, input, output, signal } from '@angular/core';
import { Cine } from '../../../core/modelos/cine';

@Component({
  selector: 'app-cines-tabla',
  templateUrl: './cines-tabla.html',
})
export class CinesTabla {
  cines = input.required<Cine[]>();
  editar = output<Cine>();
  eliminar = output<string>();

  protected readonly confirmandoId = signal<string | null>(null);

  protected confirmarEliminar(id: string) {
    this.confirmandoId.set(null);
    this.eliminar.emit(id);
  }
}
