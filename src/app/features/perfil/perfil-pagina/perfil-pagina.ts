import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServicio } from '../../../core/servicios/auth-servicio';
import { EncabezadoSeccion } from '../../../shared/componentes/encabezado-seccion/encabezado-seccion';
import { Icono } from '../../../shared/componentes/icono/icono';

@Component({
  selector: 'app-perfil-pagina',
  imports: [ReactiveFormsModule, EncabezadoSeccion, Icono],
  templateUrl: './perfil-pagina.html',
  styleUrl: './perfil-pagina.css',
})
export class PerfilPagina {
  private readonly fb = inject(FormBuilder).nonNullable;
  protected readonly auth = inject(AuthServicio);

  protected readonly formulario = this.fb.group({
    nombre: [this.auth.sesion()?.nombre ?? '', Validators.required],
    // La contraseña ACTUAL se pide en cada envío: es lo que confirma que eres tú.
    contrasenaActual: ['', Validators.required],
    // La nueva es opcional; si la escribes, mínimo 4 caracteres.
    contrasenaNueva: ['', Validators.minLength(4)],
  });

  protected readonly mostrarActual = signal(false);
  protected readonly mostrarNueva = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal(false);
  protected readonly guardando = signal(false);

  protected invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && control.touched;
  }

  protected enviar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.exito.set(false);
    this.guardando.set(true);

    this.auth.actualizarPerfil(this.formulario.getRawValue()).subscribe({
      next: (sesion) => {
        // Las contraseñas se limpian: la actual hay que volver a escribirla
        // en el próximo envío y la nueva ya quedó guardada.
        this.formulario.reset({ nombre: sesion.nombre, contrasenaActual: '', contrasenaNueva: '' });
        this.guardando.set(false);
        this.exito.set(true);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.guardando.set(false);
      },
    });
  }
}
