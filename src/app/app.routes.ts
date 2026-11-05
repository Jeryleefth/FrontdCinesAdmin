import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';

// TABLA DE RUTAS (en React: los <Route> dentro de App.jsx).
// `loadComponent` / `loadChildren` cargan cada sección solo cuando alguien
// entra a ella (lazy loading): la página de login no descarga el código del panel.
export const routes: Routes = [
  {
    path: 'ingresar',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/panel/panel.routes').then((m) => m.PANEL_RUTAS),
  },
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  { path: '**', redirectTo: 'admin' },
];
