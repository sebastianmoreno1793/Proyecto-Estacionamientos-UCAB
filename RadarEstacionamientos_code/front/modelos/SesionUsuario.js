// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Quién está usando la app: correo, rol e iniciales del perfil
// Modelo (cliente) · La sesión del usuario tal como la conoce el front (la cookie es httpOnly: el
// navegador no la lee; el back dice quién es con GET /api/sesion).
export class SesionUsuario {
  #correo;
  #rol;

  constructor({ correo, rol }) {
    this.#correo = correo;
    this.#rol = rol;
  }

  get correo() { return this.#correo; }
  get rol() { return this.#rol; }

  esAdministrador() {
    return this.#rol === "administrador";
  }

  // Iniciales para el círculo del perfil: «sebastian.moreno@est.ucab.edu.ve» → «SM».
  iniciales() {
    const usuario = String(this.#correo ?? "").trim().toLowerCase().split("@")[0];
    const partes = usuario.split(/[._-]+/).filter(Boolean);
    const letras = partes.length > 1 ? partes[0][0] + partes[1][0] : usuario.slice(0, 2);
    return letras.toUpperCase() || "?";
  }

  static desde(datos) {
    return datos ? new SesionUsuario(datos) : null;
  }
}
