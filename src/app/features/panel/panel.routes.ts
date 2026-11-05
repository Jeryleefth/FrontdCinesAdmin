import { Routes } from '@angular/router';
import { Panel } from './panel';

// RUTAS HIJAS del panel. `Panel` es el marco (barra, banner, pestañas) y cada
// pestaña es una ruta hija que se dibuja dentro de su <router-outlet />.
export const PANEL_RUTAS: Routes = [
  {
    path: '',
    component: Panel,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'peliculas' },
      {
        path: 'peliculas',
        loadComponent: () =>
          import('../peliculas/peliculas-pagina/peliculas-pagina').then((m) => m.PeliculasPagina),
      },
      {
        path: 'cines',
        loadComponent: () => import('../cines/cines-pagina/cines-pagina').then((m) => m.CinesPagina),
      },
      {
        path: 'funciones',
        loadComponent: () =>
          import('../funciones/funciones-pagina/funciones-pagina').then((m) => m.FuncionesPagina),
      },
      {
        path: 'perfil',
        loadComponent: () => import('../perfil/perfil-pagina/perfil-pagina').then((m) => m.PerfilPagina),
      },
    ],
  },
];
