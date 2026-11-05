import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Funcion, FuncionDatos } from '../modelos/funcion';

@Injectable({ providedIn: 'root' })
export class FuncionServicio {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.urlApi}/funciones`;

  listar() {
    return this.http.get<Funcion[]>(this.url);
  }

  crear(datos: FuncionDatos) {
    return this.http.post<Funcion>(this.url, datos);
  }

  actualizar(id: string, datos: FuncionDatos) {
    return this.http.put<Funcion>(`${this.url}/${id}`, datos);
  }

  /** En Spring esto CANCELA la función. */
  eliminar(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
