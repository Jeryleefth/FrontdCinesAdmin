import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Cine, CineDatos } from '../modelos/cine';

@Injectable({ providedIn: 'root' })
export class CineServicio {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.urlApi}/cines`;

  listar() {
    return this.http.get<Cine[]>(this.url);
  }

  crear(datos: CineDatos) {
    return this.http.post<Cine>(this.url, datos);
  }

  actualizar(id: string, datos: CineDatos) {
    return this.http.put<Cine>(`${this.url}/${id}`, datos);
  }

  eliminar(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
