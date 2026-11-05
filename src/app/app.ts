import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componente raíz: solo tiene el <router-outlet />, el hueco donde Angular
// dibuja la pantalla que corresponde a la URL (como <Outlet /> en React Router).
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
