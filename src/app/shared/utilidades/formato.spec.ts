import { FechaCortaPipe } from '../pipes/fecha-corta-pipe';
import { PrecioCopPipe } from '../pipes/precio-cop-pipe';
import { calcularHoraFin } from './horario';

describe('calcularHoraFin', () => {
  it('suma la duración y 15 minutos de anuncios', () => {
    expect(calcularHoraFin('14:00', 120)).toBe('16:15');
  });

  it('devuelve vacío si faltan datos', () => {
    expect(calcularHoraFin('', 120)).toBe('');
    expect(calcularHoraFin('14:00', 0)).toBe('');
  });

  it('devuelve vacío si pasa de la medianoche', () => {
    expect(calcularHoraFin('23:00', 120)).toBe('');
  });
});

describe('FechaCortaPipe', () => {
  it('convierte AAAA-MM-DD en dd/MM/AAAA', () => {
    expect(new FechaCortaPipe().transform('2024-03-01')).toBe('01/03/2024');
  });

  it('muestra una raya si no hay fecha', () => {
    expect(new FechaCortaPipe().transform(null)).toBe('—');
  });
});

describe('PrecioCopPipe', () => {
  it('formatea en pesos colombianos sin decimales', () => {
    const texto = new PrecioCopPipe().transform(16500).replace(/\s/g, ' ');
    expect(texto).toContain('16.500');
  });
});
