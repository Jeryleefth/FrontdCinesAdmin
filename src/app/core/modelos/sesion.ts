/** Lo que devuelve Spring al iniciar sesión o actualizar el perfil. */
export interface Sesion {
  token: string;
  nombre: string;
  correo: string;
  telefono?: string;
  rol: 'ADMINISTRADOR' | 'CLIENTE';
}

export interface DatosPerfil {
  nombre: string;
  contrasenaActual: string;
  /** Vacía si no quiere cambiar la contraseña. */
  contrasenaNueva: string;
}
