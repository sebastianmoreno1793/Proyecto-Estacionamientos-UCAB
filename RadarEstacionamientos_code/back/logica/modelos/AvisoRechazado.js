// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Un aviso que no cambió el aforo, con su hora y su motivo
// Modelo · Aviso rechazado. «no_existe» es un rechazo (RN4); «lleno», «vacio» y «tipo» son
// anomalías (RN3). Lo registra la táctica FiltroDeAvisos para que el sistema siga funcionando.
import { randomUUID } from "node:crypto";

export class AvisoRechazado {
  #id;
  #idAviso;
  #estacionamientoId;
  #tipo;
  #motivo;
  #hora;

  constructor({ id = randomUUID(), idAviso = null, estacionamientoId, tipo, motivo, hora }) {
    this.#id = id;
    this.#idAviso = idAviso;
    this.#estacionamientoId = estacionamientoId;
    this.#tipo = tipo;
    this.#motivo = motivo;
    this.#hora = hora;
  }

  get id() { return this.#id; }
  get idAviso() { return this.#idAviso; }
  get estacionamientoId() { return this.#estacionamientoId; }
  get tipo() { return this.#tipo; }
  get motivo() { return this.#motivo; }
  get hora() { return this.#hora; }

  // Una anomalía la manda un sensor que existe pero falla; un rechazo, un estacionamiento que no existe.
  esAnomalia() {
    return this.#motivo !== "no_existe";
  }

  static crear({ estacionamientoId, tipo, idAviso = null }, motivo, ahora = new Date()) {
    return new AvisoRechazado({ idAviso, estacionamientoId, tipo, motivo, hora: ahora.toISOString() });
  }

  static desde(registro) {
    return new AvisoRechazado(registro);
  }

  aRegistro() {
    return {
      id: this.#id,
      idAviso: this.#idAviso,
      estacionamientoId: this.#estacionamientoId,
      tipo: this.#tipo,
      motivo: this.#motivo,
      hora: this.#hora,
    };
  }
}
