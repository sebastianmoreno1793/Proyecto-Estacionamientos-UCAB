// @HU-1.1 Crear cuenta con el correo institucional · Samuel — La sesión abierta: un código secreto (la cookie radar_sesion) y de quién es
// Modelo · Sesión iniciada. El código viaja en la cookie httpOnly «radar_sesion».
import { randomUUID } from "node:crypto";

export class Sesion {
  static COOKIE = "radar_sesion";

  #codigo;
  #correo;
  #abiertaEn;

  constructor({ codigo, correo, abiertaEn }) {
    this.#codigo = codigo;
    this.#correo = correo;
    this.#abiertaEn = abiertaEn;
  }

  // El código es el identificador.
  get id() { return this.#codigo; }
  get codigo() { return this.#codigo; }
  get correo() { return this.#correo; }
  get abiertaEn() { return this.#abiertaEn; }

  static abrir(correo, ahora = new Date()) {
    return new Sesion({ codigo: randomUUID(), correo, abiertaEn: ahora.toISOString() });
  }

  static desde(registro) {
    return new Sesion(registro);
  }

  aRegistro() {
    return { codigo: this.#codigo, correo: this.#correo, abiertaEn: this.#abiertaEn };
  }
}
