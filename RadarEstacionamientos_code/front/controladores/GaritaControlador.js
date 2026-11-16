// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Control de Administrar › Garita: trae los avisos y el estado de los sensores
// @HU-3.2 Simular sensores y placas · Aaron — Trae las placas leídas
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Trae los avisos rechazados
// Controlador (front) · Actividad de la garita (solo administrador).
import { Controlador } from "./Controlador.js";
import { EstacionamientoServicio } from "../servicios/EstacionamientoServicio.js";
import { GaritaServicio } from "../servicios/GaritaServicio.js";

export class GaritaControlador extends Controlador {
  #servicio;
  #estacionamientos;

  constructor({ navegador, servicio = new GaritaServicio(), estacionamientoServicio = new EstacionamientoServicio() } = {}) {
    super({ navegador });
    this.#servicio = servicio;
    this.#estacionamientos = estacionamientoServicio;
  }

  // Devuelve { ok, error, movimientos, rechazados, sensores, lecturas, etiquetas: { id: etiqueta } }.
  async actividad() {
    const [actividad, { estacionamientos }] = await Promise.all([this.#servicio.actividad(), this.#estacionamientos.listar()]);
    return { ...actividad, etiquetas: Object.fromEntries(estacionamientos.map((e) => [e.id, e.etiqueta])) };
  }
}
