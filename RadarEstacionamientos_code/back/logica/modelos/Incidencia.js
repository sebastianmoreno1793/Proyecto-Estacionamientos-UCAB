// @HU-9.1 Crear una incidencia · Sebastian — La incidencia nace «pendiente», con fecha y hora, solo en estacionamientos abiertos
// Modelo · Un problema que un conductor reporta en un estacionamiento.
import { randomUUID } from "node:crypto";
import { ErrorDeNegocio } from "./ErrorDeNegocio.js";

export class Incidencia {
  // @HU-9.1 Crear una incidencia · Sebastian — los tres tipos de problema del Brief
  static TIPOS = [
    { id: "bateria_descargada", nombre: "Batería descargada" },
    { id: "conos_atravesados", nombre: "Conos atravesados" },
    { id: "vehiculo_mal_estacionado", nombre: "Vehículo mal estacionado" },
  ];

  static PENDIENTE = "pendiente";

  #id;
  #estacionamientoId;
  #tipo;
  #estado;
  #reportadaEn;
  #reportadaPor;

  constructor({ id = randomUUID(), estacionamientoId, tipo, estado = Incidencia.PENDIENTE, reportadaEn, reportadaPor }) {
    this.#id = id;
    this.#estacionamientoId = estacionamientoId;
    this.#tipo = tipo;
    this.#estado = estado;
    this.#reportadaEn = reportadaEn;
    this.#reportadaPor = reportadaPor;
  }

  get id() { return this.#id; }
  get estacionamientoId() { return this.#estacionamientoId; }
  get tipo() { return this.#tipo; }
  get estado() { return this.#estado; }
  get reportadaEn() { return this.#reportadaEn; }
  get reportadaPor() { return this.#reportadaPor; }

  // Nombre legible del tipo («Conos atravesados»).
  nombreDelTipo() {
    return Incidencia.nombreDe(this.#tipo);
  }

  static nombreDe(tipo) {
    return Incidencia.TIPOS.find((t) => t.id === tipo)?.nombre;
  }

  // @HU-9.1 Crear una incidencia · Sebastian
  // REGLAS DE NEGOCIO: solo se reporta en un estacionamiento abierto, solo hay tres tipos de
  // problema, siempre a nombre de alguien (RN4), y nace «pendiente» con la fecha y la hora.
  static crear({ estacionamiento, tipo, reportadaPor }, ahora = new Date()) {
    if (!reportadaPor) throw new ErrorDeNegocio("Inicia sesión para reportar una incidencia.", "sin_usuario");
    if (!estacionamiento.estaAbierto()) {
      throw new ErrorDeNegocio(`${estacionamiento.etiqueta} está cerrado: no se pueden reportar incidencias ahí.`, "cerrado");
    }
    if (!Incidencia.nombreDe(tipo)) throw new ErrorDeNegocio("Ese tipo de problema no existe.", "tipo");
    return new Incidencia({ estacionamientoId: estacionamiento.id, tipo, reportadaEn: ahora.toISOString(), reportadaPor });
  }

  static desde(registro) {
    return new Incidencia(registro);
  }

  aRegistro() {
    return {
      id: this.#id,
      estacionamientoId: this.#estacionamientoId,
      tipo: this.#tipo,
      estado: this.#estado,
      reportadaEn: this.#reportadaEn,
      reportadaPor: this.#reportadaPor,
    };
  }
}
