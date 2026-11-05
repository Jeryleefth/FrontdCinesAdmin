export type TipoSala = '2D' | '3D' | 'VIP';

export interface Sala {
  /** Las salas nuevas todavía no tienen id: lo asigna Spring al guardar. */
  id?: string;
  nombre: string;
  capacidad: number;
  tipo: TipoSala;
}

export interface Cine {
  id: string;
  cadena: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  salas: Sala[];
}

export type CineDatos = Omit<Cine, 'id'>;

export const CADENAS = ['Cinemark', 'Cine Colombia', 'Royal Films'];
export const TIPOS_SALA: TipoSala[] = ['2D', '3D', 'VIP'];
