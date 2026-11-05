import { Component, computed, input, signal } from '@angular/core';

// Banner de cabecera. Dos modos:
//  - con `imagen`: se muestra la imagen (que ya trae el título dibujado);
//  - sin imagen, o si la imagen no carga: se dibuja el título sobre un degradado rojo.
// Uso:  <app-banner titulo="Panel" subtitulo="..." imagen="/banners/encabezadoAdmin.png" />
@Component({
  selector: 'app-banner',
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {
  // `input()` es la forma moderna de recibir datos del componente padre
  // (lo que en React eran las "props").
  titulo = input.required<string>();
  subtitulo = input<string>();
  imagen = input<string>();

  private readonly imagenFallida = signal(false);
  protected readonly hayImagen = computed(() => Boolean(this.imagen()) && !this.imagenFallida());

  protected alFallarImagen() {
    this.imagenFallida.set(true);
  }
}
