import { Pipe, PipeTransform } from '@angular/core';

const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

// UN PIPE transforma un valor directamente en la plantilla HTML:
//   {{ funcion.precio | precioCop }}   ->   $ 16.500
@Pipe({ name: 'precioCop' })
export class PrecioCopPipe implements PipeTransform {
  transform(valor: number): string {
    return formatoPesos.format(valor);
  }
}
