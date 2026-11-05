import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServicio } from '../../../core/servicios/auth-servicio';
import { Icono } from '../../../shared/componentes/icono/icono';

// UN COMPONENTE = clase (lógica) + plantilla HTML + CSS.
// En React era una función que devolvía JSX; aquí el HTML vive aparte
// (login.html) y la clase solo guarda el estado y las acciones.
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Icono],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthServicio);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  // FORMULARIO REACTIVO: el formulario es un objeto en la clase (no en el
  // HTML). En React cada campo era un useState + onChange; aquí `FormBuilder`
  // crea el grupo con sus validaciones y la plantilla se conecta por nombre
  // con `formControlName`.
  protected readonly formulario = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
  });

  // SIGNAL: un valor reactivo. Se lee llamándolo como función: `error()`,
  // y se cambia con `.set(...)`. La plantilla se actualiza sola.
  protected readonly mostrarContrasena = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly enviando = signal(false);

  /** ¿Mostramos el mensaje de error de este campo? (inválido y ya tocado) */
  protected invalido(campo: 'correo' | 'contrasena'): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && control.touched;
  }

  protected enviar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.enviando.set(true);

    const { correo, contrasena } = this.formulario.getRawValue();

    // Nada se envía hasta que alguien hace .subscribe(): aquí es donde sale la petición.
    this.auth.iniciarSesion(correo, contrasena).subscribe({
      next: () => this.router.navigateByUrl(this.destino()),
      error: (e: Error) => {
        this.error.set(e.message);
        this.enviando.set(false);
      },
    });
  }

  /** A dónde volver: la ruta que el guard guardó en `?desde=`, solo si es del panel. */
  private destino(): string {
    const desde = this.ruta.snapshot.queryParamMap.get('desde');
    return desde?.startsWith('/admin') ? desde : '/admin';
  }
}
