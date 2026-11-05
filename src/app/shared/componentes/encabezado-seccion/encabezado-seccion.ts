import { Component, input } from '@angular/core';

// Título de sección con un hueco a la derecha para el botón de acción.
//
//   <app-encabezado-seccion titulo="Películas">
//     <button class="boton boton--principal">+ Agregar película</button>
//   </app-encabezado-seccion>
//
// <ng-content /> es la "proyección de contenido": lo que escribes ENTRE las
// etiquetas del componente aparece donde pongas <ng-content />. En React
// esto era la prop `children`.
@Component({
  selector: 'app-encabezado-seccion',
  template: `
    <div class="encabezado">
      <h2 class="encabezado__titulo">{{ titulo() }}</h2>
      <ng-content />
    </div>
  `,
  styles: `
    .encabezado {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: var(--espacio-medio);
    }

    .encabezado__titulo {
      margin: 0;
      font-family: var(--fuente-titulo);
      font-weight: 800;
      font-style: italic;
      font-size: 22px;
      color: var(--rojo-principal);
    }
  `,
})
export class EncabezadoSeccion {
  titulo = input.required<string>();
}
