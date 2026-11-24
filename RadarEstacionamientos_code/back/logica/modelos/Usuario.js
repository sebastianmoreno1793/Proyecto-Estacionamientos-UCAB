// @HU-1.1 Crear cuenta con el correo institucional · Samuel — La cuenta: correo, rol que sale del dominio y contraseña cifrada
// Modelo · Usuario del Radar. La contraseña nunca se guarda tal cual: se guarda un hash con sal.
// Que el correo esté bien escrito, la contraseña de 8 o más y la confirmación los revisa el front
// (front/validadores/CuentaValidador.js).
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { ErrorDeNegocio } from "./ErrorDeNegocio.js";

export class Usuario {
  static ADMINISTRADOR = "administrador";
  static ESTUDIANTE = "estudiante";
  static PROFESOR = "profesor";

  // Mensaje del paso 7.1 del escenario de la HU 1.1.
  static MENSAJE_SOLO_UCAB = "Solo puede entrar la comunidad UCAB. Usa tu correo institucional";

  #correo;
  #rol;
  #sal;
  #hash;
  #creadoEn;

  constructor({ correo, rol, sal, hash, creadoEn }) {
    this.#correo = correo;
    this.#rol = rol;
    this.#sal = sal;
    this.#hash = hash;
    this.#creadoEn = creadoEn;
  }

  // El correo es el identificador.
  get id() { return this.#correo; }
  get correo() { return this.#correo; }
  get rol() { return this.#rol; }
  get creadoEn() { return this.#creadoEn; }

  esAdministrador() {
    return this.#rol === Usuario.ADMINISTRADOR;
  }

  // Compara la contraseña escrita con el hash guardado, en tiempo constante.
  contrasenaCorrecta(contrasena) {
    const { hash } = Usuario.#cifrar(contrasena, this.#sal);
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(this.#hash, "hex"));
  }

  // Quita los espacios y pasa el correo a minúsculas.
  static normalizarCorreo(correo) {
    return String(correo ?? "")
      .trim()
      .toLowerCase();
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel — el rol sale del dominio
  // REGLA DE NEGOCIO (D-003): @est.ucab.edu.ve → estudiante; @ucab.edu.ve → profesor; otro → sin rol.
  // Vigilancia y administración se asignan a mano.
  static rolSegunCorreo(correo) {
    const dominio = /@([^@]+)$/.exec(Usuario.normalizarCorreo(correo))?.[1];
    if (dominio === "est.ucab.edu.ve") return Usuario.ESTUDIANTE;
    if (dominio === "ucab.edu.ve") return Usuario.PROFESOR;
    return null;
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel
  // REGLA DE NEGOCIO: sin rol de la comunidad UCAB no hay cuenta. `rol` se pasa a mano solo para
  // las cuentas de prueba (el administrador no sale del dominio).
  static crear({ correo, contrasena, rol = Usuario.rolSegunCorreo(correo) }, ahora = new Date()) {
    if (!rol) throw new ErrorDeNegocio(Usuario.MENSAJE_SOLO_UCAB, "solo_ucab");
    return new Usuario({ correo: Usuario.normalizarCorreo(correo), rol, ...Usuario.#cifrar(contrasena), creadoEn: ahora.toISOString() });
  }

  static #cifrar(contrasena, sal = randomBytes(16).toString("hex")) {
    return { sal, hash: scryptSync(String(contrasena ?? ""), sal, 64).toString("hex") };
  }

  static desde(registro) {
    return new Usuario(registro);
  }

  aRegistro() {
    return { correo: this.#correo, rol: this.#rol, sal: this.#sal, hash: this.#hash, creadoEn: this.#creadoEn };
  }
}
