import { Routes } from '@angular/router';
import { Panel } from './panel';

// RUTAS HIJAS del panel. `Panel` es el marco (barra, banner, pestañas) y cada
// pestaña es una ruta hija que se dibuja dentro de su <router-outlet />.
// En los siguientes commits vamos agregando una ruta por pestaña.
export const PANEL_RUTAS: Routes = [
  {
    path: '',
    component: Panel,
    children: [],
  },
];
