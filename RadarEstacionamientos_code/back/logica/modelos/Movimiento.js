// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Una entrada o salida aceptada, con su hora
// Modelo · Un movimiento que el sensor avisó y cambió el aforo.
import { randomUUID } from "node:crypto";

export class Movimiento {
  static ENTRADA = "ENTRADA";
  static SALIDA = "SALIDA";
  static TIPOS = [Movimiento.ENTRADA, Movimiento.SALIDA];

  #id;
  #idAviso;
  #estacionamientoId;
  #tipo;
  #hora;

  constructor({ id = randomUUID(), idAviso = null, estacionamientoId, tipo, hora }) {
    this.#id = id;
    this.#idAviso = idAviso;
    this.#estacionamientoId = estacionamientoId;
    this.#tipo = tipo;
    this.#hora = hora;
  }

  get id() { return this.#id; }
  get idAviso() { return this.#idAviso; }
  get estacionamientoId() { return this.#estacionamientoId; }
  get tipo() { return this.#tipo; }
  get hora() { return this.#hora; }

  // @HU-3.1 Recibir avisos de entrada y salida · Aaron — queda con la hora en que llegó
  static crear({ estacionamientoId, tipo, idAviso = null }, ahora = new Date()) {
    return new Movimiento({ idAviso, estacionamientoId, tipo, hora: ahora.toISOString() });
  }

  static desde(registro) {
    return new Movimiento(registro);
  }

  aRegistro() {
    return { id: this.#id, idAviso: this.#idAviso, estacionamientoId: this.#estacionamientoId, tipo: this.#tipo, hora: this.#hora };
  }
}
