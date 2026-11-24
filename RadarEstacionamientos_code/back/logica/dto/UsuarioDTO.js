// @HU-1.1 Crear cuenta con el correo institucional · Samuel — El usuario tal como sale por la API: correo y rol, nunca la contraseña
// DTO · Usuario.
export class UsuarioDTO {
  constructor({ correo, rol }) {
    this.correo = correo;
    this.rol = rol;
  }

  static desdeModelo(usuario) {
    return new UsuarioDTO({ correo: usuario.correo, rol: usuario.rol });
  }
}
