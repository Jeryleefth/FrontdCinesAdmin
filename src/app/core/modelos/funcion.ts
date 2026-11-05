import { Cine, Sala } from './cine';

export type TipoFuncion = 'Doblada' | 'Subtitulada' | 'Original';

/** Lo que DEVUELVE la API: el cine y la sala ya vienen resueltos como objetos. */
export interface Funcion {
  id: string;
  peliculaId: string;
  cine: Cine;
  sala: Sala;
  /** Fecha ISO: AAAA-MM-DD. */
  fecha: string;
  /** "HH:mm" */
  horaInicio: string;
  horaFin: string;
  tipoFuncion: TipoFuncion;
  /** 2D | 3D | VIP: es el mismo tipo de la sala. */
  formato: string;
  /** Pesos colombianos (COP). */
  precio: number;
}

/** Lo que se ENVÍA al crear o editar: solo los ids del cine y de la sala. */
export interface FuncionDatos {
  peliculaId: string;
  cineId: string;
  salaId: string;
  tipoFuncion: TipoFuncion;
  formato: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  precio: number;
}

export const TIPOS_FUNCION: TipoFuncion[] = ['Doblada', 'Subtitulada', 'Original'];
