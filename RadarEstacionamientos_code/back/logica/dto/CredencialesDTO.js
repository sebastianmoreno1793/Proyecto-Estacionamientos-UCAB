// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Correo y contraseña que llegan de Crear cuenta o de Entrar
// DTO · Credenciales. Solo viajan hacia el back; nunca se devuelven.
export class CredencialesDTO {
  constructor({ correo, contrasena }) {
    this.correo = correo;
    this.contrasena = contrasena;
  }

  static desdeCuerpo(cuerpo) {
    return new CredencialesDTO({ correo: String(cuerpo.correo ?? ""), contrasena: String(cuerpo.contrasena ?? "") });
  }
}
