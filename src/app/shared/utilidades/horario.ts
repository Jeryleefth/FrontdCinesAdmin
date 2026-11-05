/** Minutos de anuncios y tráilers antes de que empiece la película. */
export const MINUTOS_PREVIO_FUNCION = 15;

/**
 * Hora de fin de una función = inicio + duración de la película + anuncios.
 * Devuelve '' si faltan datos o si la función terminaría después de la
 * medianoche (en este proyecto deben terminar el mismo día).
 *
 *   calcularHoraFin('14:00', 120)  ->  '16:15'
 */
export function calcularHoraFin(horaInicio: string, duracion: number): string {
  if (!horaInicio || !Number.isFinite(duracion) || duracion <= 0) return '';
  const [horas, minutos] = horaInicio.split(':').map(Number);
  const total = horas * 60 + minutos + duracion + MINUTOS_PREVIO_FUNCION;
  if (total >= 24 * 60) return '';
  const hh = String(Math.floor(total / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}
