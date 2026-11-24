// @HU-9.1 Crear una incidencia · Sebastian — Revisa que se elija un estacionamiento de la lista y un tipo de problema; dice todo lo que falta
// Validador · Reporte de una incidencia (CA2: si falta algo, dice todo lo que falta elegir).
import { Validador } from "./Validador.js";

export class IncidenciaValidador extends Validador {
  #estacionamientos;
  #tipos;

  // estacionamientos: ids que ofrece el formulario (solo abiertos) · tipos: ids de los tipos de problema
  constructor({ estacionamientos = [], tipos = [] } = {}) {
    super();
    this.#estacionamientos = estacionamientos;
    this.#tipos = tipos;
  }

  revisar({ estacionamientoId, tipo }, anotar) {
    if (!this.#estacionamientos.includes(estacionamientoId)) anotar("estacionamientoId", "un estacionamiento de la lista");
    if (!this.#tipos.includes(tipo)) anotar("tipo", "el tipo de problema");
    return { estacionamientoId, tipo };
  }

  // «Elige un estacionamiento de la lista y el tipo de problema.»
  resumir(faltan) {
    return faltan.length ? `Elige ${faltan.join(" y ")}.` : null;
  }
}
