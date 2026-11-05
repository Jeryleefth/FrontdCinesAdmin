import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pelicula, PeliculaDatos } from '../modelos/pelicula';

// UN SERVICIO es una clase que guarda lógica reutilizable (aquí: hablar con
// la API). `providedIn: 'root'` hace que Angular cree UNA sola instancia para
// toda la app; cualquier componente la pide con `inject(PeliculaServicio)`.
//
// Cada método devuelve un Observable: es como una promesa que todavía no se
// ejecutó. La petición solo se envía cuando alguien hace `.subscribe(...)`.
@Injectable({ providedIn: 'root' })
export class PeliculaServicio {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.urlApi}/peliculas`;

  listar() {
    return this.http.get<Pelicula[]>(this.url);
  }

  crear(datos: PeliculaDatos) {
    return this.http.post<Pelicula>(this.url, datos);
  }

  actualizar(id: string, datos: PeliculaDatos) {
    return this.http.put<Pelicula>(`${this.url}/${id}`, datos);
  }

  eliminar(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
