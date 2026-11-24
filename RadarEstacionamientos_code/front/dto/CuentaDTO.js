// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Lo que manda Crear cuenta o Entrar: correo y contraseña
// DTO · Cuenta que el front envía a POST /api/cuenta o POST /api/sesion. La confirmación de la
// contraseña no viaja: solo la revisa el validador del front.
export class CuentaDTO {
  constructor({ correo, contrasena }) {
    this.correo = correo;
    this.contrasena = contrasena;
  }
}
