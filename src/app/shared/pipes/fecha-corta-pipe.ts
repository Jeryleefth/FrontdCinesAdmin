import { Pipe, PipeTransform } from '@angular/core';

// {{ pelicula.fechaEstreno | fechaCorta }}   ->   "2024-03-01" se ve "01/03/2024"
@Pipe({ name: 'fechaCorta' })
export class FechaCortaPipe implements PipeTransform {
  transform(fechaIso: string | null | undefined): string {
    if (!fechaIso) return '—';
    const [anio, mes, dia] = fechaIso.split('-');
    return `${dia}/${mes}/${anio}`;
  }
}
