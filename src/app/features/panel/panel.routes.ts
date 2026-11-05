import { Component } from '@angular/core';
import { Routes } from '@angular/router';

// TEMPORAL: en el commit 4 este archivo se reemplaza por el panel real.
// Sirve para comprobar que, al iniciar sesión, el login lleva a /admin.
@Component({
  template: '<p class="mensaje-estado">Sesión iniciada. El panel se construye en el siguiente commit.</p>',
})
class PanelTemporal {}

export const PANEL_RUTAS: Routes = [{ path: '', component: PanelTemporal }];
