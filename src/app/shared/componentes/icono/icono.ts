import { Component, input } from '@angular/core';

export type NombreIcono = 'usuario' | 'correo' | 'candado' | 'ojo' | 'ojo-cerrado';

// Iconos dibujados como SVG (en vez de emojis) para que se vean igual en todos
// los sistemas y tomen el color del texto (`currentColor`).
// Uso:  <app-icono nombre="correo" />
// El tamaño lo decide quien lo usa, con CSS sobre `app-icono`.
@Component({
  selector: 'app-icono',
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (nombre()) {
        @case ('usuario') {
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
        }
        @case ('correo') {
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        }
        @case ('candado') {
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        }
        @case ('ojo') {
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        }
        @case ('ojo-cerrado') {
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
          <path
            d="M9.4 5.3A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a14 14 0 0 1-3.2 3.9M6.1 6.9A14.3 14.3 0 0 0 2 12s3.5 7 10 7c1.1 0 2.1-.15 3-.44"
          />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 18px;
      height: 18px;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class Icono {
  nombre = input.required<NombreIcono>();
}
