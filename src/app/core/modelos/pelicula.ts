// CONTRATO DE DATOS con la API de Spring Boot.
// En React esto eran "typedef" de JSDoc (solo documentación). En Angular son
// interfaces de TypeScript: el compilador revisa que uses los campos bien.

export interface Pelicula {
  id: string;
  titulo: string;
  sinopsis: string;
  /** Minutos. */
  duracion: number;
  genero: string;
  clasificacion: string;
  idioma: string;
  /** Fecha ISO: AAAA-MM-DD. */
  fechaEstreno: string;
  /** URL del póster. */
  rutaImagen: string;
}

/** Lo que se envía al crear o editar: lo mismo, pero sin `id` (lo pone el backend). */
export type PeliculaDatos = Omit<Pelicula, 'id'>;
