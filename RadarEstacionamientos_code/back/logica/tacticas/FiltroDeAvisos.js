// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Ignora los avisos defectuosos sin detener el sistema y los registra; con N seguidos marca el sensor con falla
// Táctica de DISPONIBILIDAD · Ignorar comportamiento defectuoso (+ límite de anomalías seguidas).
// Un sensor puede fallar y mandar avisos imposibles (una entrada con el estacionamiento lleno, una
// salida sin carros). En vez de romper el aforo o detener el sistema, el aviso se ignora y queda
// registrado (AvisoRechazado). Si un mismo sensor manda `limite` anomalías seguidas, se marca
// «con falla» para que el administrador lo revise; con el siguiente aviso bueno vuelve a la normalidad.
import { AvisoRechazado } from "../modelos/AvisoRechazado.js";

export class FiltroDeAvisos {
  static LIMITE_POR_DEFECTO = 3;

  #repositorio;
  #limite;
  #seguidas = new Map(); // estacionamientoId → anomalías seguidas
  #conFalla = new Set();

  constructor(avisoRechazadoRepositorio, { limite = FiltroDeAvisos.LIMITE_POR_DEFECTO } = {}) {
    this.#repositorio = avisoRechazadoRepositorio;
    this.#limite = limite;
  }

  get limite() {
    return this.#limite;
  }

  // @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
  // Revisa el aviso contra la regla de negocio del estacionamiento (null si no existe).
  // Devuelve { aceptado: true } o { aceptado: false, motivo, mensaje, anomaliasSeguidas, sensorConFalla, nuevaFalla }.
  async revisar(aviso, estacionamiento, ahora = new Date()) {
    const id = aviso.estacionamientoId;
    const motivo = estacionamiento ? estacionamiento.motivoDeRechazo(aviso.tipo) : "no_existe";

    if (!motivo) {
      this.#seguidas.set(id, 0);
      this.#conFalla.delete(id);
      return { aceptado: true };
    }

    await this.#repositorio.guardar(AvisoRechazado.crear(aviso, motivo, ahora));
    const mensaje = estacionamiento ? estacionamiento.mensajeDeRechazo(motivo) : `El estacionamiento «${id}» no existe.`;
    if (!estacionamiento) return { aceptado: false, motivo, mensaje, anomaliasSeguidas: 0, sensorConFalla: false, nuevaFalla: false };

    const anomaliasSeguidas = (this.#seguidas.get(id) ?? 0) + 1;
    this.#seguidas.set(id, anomaliasSeguidas);
    const nuevaFalla = anomaliasSeguidas === this.#limite;
    if (anomaliasSeguidas >= this.#limite) this.#conFalla.add(id);
    return { aceptado: false, motivo, mensaje, anomaliasSeguidas, sensorConFalla: this.#conFalla.has(id), nuevaFalla };
  }

  // Ids de los estacionamientos cuyo sensor está marcado con falla.
  sensoresConFalla() {
    return [...this.#conFalla];
  }

  reiniciar() {
    this.#seguidas.clear();
    this.#conFalla.clear();
  }
}
