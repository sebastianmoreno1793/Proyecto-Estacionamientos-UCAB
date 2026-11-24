// @HU-2.1 Registrar mis vehículos · Samuel — Un vehículo a nombre de su dueño, con la placa normalizada
// Modelo · Vehículo de un usuario. Que la placa no se repita en el sistema es una regla de negocio
// y la revisa VehiculoServicio (el lector de la garita identifica al vehículo por ella).
import { randomUUID } from "node:crypto";
import { ErrorDeNegocio } from "./ErrorDeNegocio.js";
import { Placa } from "./Placa.js";
import { Usuario } from "./Usuario.js";

export class Vehiculo {
  #id;
  #dueno;
  #placa;
  #marca;
  #modelo;
  #color;
  #registradoEn;

  constructor({ id = randomUUID(), dueno, placa, marca, modelo, color, registradoEn }) {
    this.#id = id;
    this.#dueno = dueno;
    this.#placa = new Placa(placa);
    this.#marca = marca;
    this.#modelo = modelo;
    this.#color = color;
    this.#registradoEn = registradoEn;
  }

  get id() { return this.#id; }
  get dueno() { return this.#dueno; }
  get placa() { return this.#placa.toString(); }
  get marca() { return this.#marca; }
  get modelo() { return this.#modelo; }
  get color() { return this.#color; }
  get registradoEn() { return this.#registradoEn; }

  // «ANA@…» y «ana@…» son la misma persona.
  esDe(correo) {
    return this.#dueno === Usuario.normalizarCorreo(correo);
  }

  // @HU-2.1 Registrar mis vehículos · Samuel — siempre a nombre de alguien
  static crear(dueno, { placa, marca, modelo, color }, ahora = new Date()) {
    if (!dueno) throw new ErrorDeNegocio("Inicia sesión para registrar tus vehículos.", "sin_usuario");
    return new Vehiculo({ dueno: Usuario.normalizarCorreo(dueno), placa, marca, modelo, color, registradoEn: ahora.toISOString() });
  }

  static desde(registro) {
    return new Vehiculo(registro);
  }

  aRegistro() {
    return {
      id: this.#id,
      dueno: this.#dueno,
      placa: this.placa,
      marca: this.#marca,
      modelo: this.#modelo,
      color: this.#color,
      registradoEn: this.#registradoEn,
    };
  }
}
