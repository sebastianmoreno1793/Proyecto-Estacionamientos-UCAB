// @HU-3.2 Simular sensores y placas · Aaron — Una placa leída en la garita, con su sentido y su hora
// Modelo · Lectura del lector de placas de la garita. Las placas son datos personales: solo las
// ve el administrador y nunca van al canal en vivo.
import { randomUUID } from "node:crypto";
import { ErrorDeNegocio } from "./ErrorDeNegocio.js";
import { Movimiento } from "./Movimiento.js";
import { Placa } from "./Placa.js";

export class LecturaDePlaca {
  #id;
  #idLectura;
  #placa;
  #sentido;
  #hora;

  constructor({ id = randomUUID(), idLectura = null, placa, sentido, hora }) {
    this.#id = id;
    this.#idLectura = idLectura;
    this.#placa = new Placa(placa);
    this.#sentido = sentido;
    this.#hora = hora;
  }

  get id() { return this.#id; }
  get idLectura() { return this.#idLectura; }
  get placa() { return this.#placa.toString(); }
  get sentido() { return this.#sentido; }
  get hora() { return this.#hora; }

  // @HU-3.2 Simular sensores y placas · Aaron
  // REGLAS DE NEGOCIO: sin placa no hay lectura, y el carro solo puede ENTRAR o SALIR del campus.
  static crear({ placa, sentido, idLectura = null }, ahora = new Date()) {
    if (new Placa(placa).estaVacia()) throw new ErrorDeNegocio("La lectura no trae placa.", "sin_placa");
    if (!Movimiento.TIPOS.includes(sentido)) throw new ErrorDeNegocio("El sentido debe ser ENTRADA o SALIDA.", "sentido");
    return new LecturaDePlaca({ idLectura, placa, sentido, hora: ahora.toISOString() });
  }

  static desde(registro) {
    return new LecturaDePlaca(registro);
  }

  aRegistro() {
    return { id: this.#id, idLectura: this.#idLectura, placa: this.placa, sentido: this.#sentido, hora: this.#hora };
  }
}
