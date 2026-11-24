// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Control de la sugerencia: pide el más cercano y recuerda el último edificio elegido
// Controlador (front) · Sugerencia (Inicio y /sugerencia).
import { Controlador } from "./Controlador.js";
import { EdificioServicio } from "../servicios/EdificioServicio.js";
import { SugerenciaServicio } from "../servicios/SugerenciaServicio.js";

export class SugerenciaControlador extends Controlador {
  static CLAVE_EDIFICIO = "radar_edificio"; // el último edificio elegido, solo en este navegador

  #servicio;
  #edificios;

  constructor({ navegador, servicio = new SugerenciaServicio(), edificioServicio = new EdificioServicio() } = {}) {
    super({ navegador });
    this.#servicio = servicio;
    this.#edificios = edificioServicio;
  }

  // Los edificios para elegir; con soloConUbicacion, los que se pueden sugerir (chips del Inicio).
  async edificios({ soloConUbicacion = false } = {}) {
    const lista = await this.#edificios.listar();
    return soloConUbicacion ? lista.filter((e) => e.ubicacion) : lista;
  }

  // @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
  // Devuelve MensajeSugerencia { sugerencia } o MensajeError { error }.
  async sugerir(edificioId) {
    if (!edificioId) return this.muestra("MensajeDatosNoValidos", { error: "Elige un edificio." });
    const r = await this.#servicio.sugerir(edificioId);
    if (!r.ok) return this.muestra("MensajeError", { error: r.error });
    this.recordarEdificio(edificioId);
    return this.muestra("MensajeSugerencia", { sugerencia: r.datos });
  }

  recordarEdificio(edificioId) {
    try {
      localStorage.setItem(SugerenciaControlador.CLAVE_EDIFICIO, edificioId);
    } catch {
      // sin almacenamiento (modo privado): no pasa nada
    }
  }

  edificioGuardado() {
    try {
      return localStorage.getItem(SugerenciaControlador.CLAVE_EDIFICIO);
    } catch {
      return null;
    }
  }
}
