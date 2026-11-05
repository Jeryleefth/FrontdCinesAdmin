import { Component, input } from '@angular/core';

// Spinner de carga. Uso:  <app-cargando texto="Cargando películas…" />
@Component({
  selector: 'app-cargando',
  template: `
    <div class="cargando" role="status" aria-live="polite">
      <span class="cargando__anillo" aria-hidden="true"></span>
      <p class="cargando__texto">{{ texto() }}</p>
    </div>
  `,
  styles: `
    .cargando {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding: 48px 20px;
    }

    .cargando__anillo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 4px solid var(--crema-borde);
      border-top-color: var(--rojo-principal);
      animation: girar 0.8s linear infinite;
    }

    .cargando__texto {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
    }

    @keyframes girar {
      to {
        transform: rotate(360deg);
      }
    }

    /* Si la persona pidió "reducir movimiento" en su sistema, el spinner queda quieto. */
    @media (prefers-reduced-motion: reduce) {
      .cargando__anillo {
        animation: none;
      }
    }
  `,
})
export class Cargando {
  texto = input('Cargando…');
}
