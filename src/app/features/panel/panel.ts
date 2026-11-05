import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthServicio } from '../../core/servicios/auth-servicio';
import { Banner } from '../../shared/componentes/banner/banner';
import { ConfirmacionModal } from '../../shared/componentes/confirmacion-modal/confirmacion-modal';

// EL PANEL es el "marco" de todas las pantallas del administrador: barra
// superior, banner y pestañas. Lo que cambia según la pestaña se dibuja en
// <router-outlet />. Es el equivalente de PanelAdmin.jsx, pero en React las
// pestañas eran un useState y aquí cada pestaña es una RUTA (/admin/cines):
// se puede recargar la página, copiar el enlace o usar "atrás" y sigues ahí.
@Component({
  selector: 'app-panel',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Banner, ConfirmacionModal],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel {
  protected readonly auth = inject(AuthServicio);
  private readonly router = inject(Router);

  protected readonly pestanas = [
    { ruta: 'peliculas', texto: 'Películas' },
    { ruta: 'cines', texto: 'Cines' },
    { ruta: 'funciones', texto: 'Funciones' },
    { ruta: 'perfil', texto: 'Mi perfil' },
  ];

  protected readonly confirmandoSalida = signal(false);

  protected salir() {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/ingresar');
  }
}
