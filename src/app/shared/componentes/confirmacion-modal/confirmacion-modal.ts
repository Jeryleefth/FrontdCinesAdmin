import { Component, input, output } from '@angular/core';

// Modal genérico de "¿estás seguro?".
// Uso:
//   <app-confirmacion-modal
//      titulo="Cerrar sesión"
//      mensaje="¿Seguro?"
//      (confirmar)="salir()"
//      (cancelar)="cerrarModal()" />
@Component({
  selector: 'app-confirmacion-modal',
  templateUrl: './confirmacion-modal.html',
  styleUrl: './confirmacion-modal.css',
  // Escucha la tecla Escape en todo el documento para cerrar el modal.
  host: { '(document:keydown.escape)': 'cancelar.emit()' },
})
export class ConfirmacionModal {
  titulo = input('¿Estás seguro?');
  mensaje = input<string>();
  textoConfirmar = input('Confirmar');
  textoCancelar = input('Cancelar');

  // `output()` es la forma de avisarle algo al componente padre
  // (lo que en React eran las props de tipo función: onConfirmar, onCancelar).
  confirmar = output<void>();
  cancelar = output<void>();
}
