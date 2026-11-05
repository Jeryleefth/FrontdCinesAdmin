import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatosPerfil, Sesion } from '../modelos/sesion';

const CLAVE_SESION = 'cinematch_admin_sesion';

// La sesión se guarda en localStorage para que al recargar la página el
// navegador "recuerde" que ya iniciaste sesión (igual que AuthContext en React).
function leerSesionGuardada(): Sesion | null {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION);
    return guardada ? (JSON.parse(guardada) as Sesion) : null;
  } catch {
    // localStorage puede fallar (modo incógnito estricto, cuota llena…):
    // si pasa, se empieza sin sesión en vez de romper la app.
    return null;
  }
}

// En React, "quién está logueado" vivía en un Context + useState. En Angular
// vive en un SERVICIO con una SIGNAL: cualquier componente que lea
// `auth.sesion()` se actualiza solo cuando la sesión cambia.
@Injectable({ providedIn: 'root' })
export class AuthServicio {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.urlApi}/auth`;

  private readonly _sesion = signal<Sesion | null>(leerSesionGuardada());

  /** La sesión actual (solo lectura desde fuera del servicio). */
  readonly sesion = this._sesion.asReadonly();

  /** Un computed se recalcula solo cuando cambia la signal de la que depende. */
  readonly estaAutenticado = computed(() => this._sesion()?.rol === 'ADMINISTRADOR');

  /** POST /api/auth/login: solo acepta cuentas con rol ADMINISTRADOR. */
  iniciarSesion(correo: string, contrasena: string) {
    return this.http
      .post<Sesion>(`${this.url}/login`, { correo, contrasena })
      .pipe(tap((sesion) => this.guardar(sesion)));
  }

  /** PUT /api/auth/perfil: el correo no se edita, siempre va el de la sesión. */
  actualizarPerfil(datos: DatosPerfil) {
    const correo = this._sesion()?.correo;
    return this.http
      .put<Sesion>(`${this.url}/perfil`, { correo, ...datos })
      .pipe(tap((sesion) => this.guardar(sesion)));
  }

  cerrarSesion() {
    this._sesion.set(null);
    try {
      localStorage.removeItem(CLAVE_SESION);
    } catch {
      /* sin localStorage no hay nada que borrar */
    }
  }

  private guardar(sesion: Sesion) {
    this._sesion.set(sesion);
    try {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } catch {
      /* si no se puede guardar, la sesión sigue viva hasta recargar */
    }
  }
}
