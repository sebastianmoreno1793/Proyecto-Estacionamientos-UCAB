// @HU-9.1 Crear una incidencia · Sebastian — Registra la incidencia como «pendiente» si el estacionamiento existe y está abierto
// Servicio · Incidencias.
import { ErrorDeNegocio } from "../modelos/ErrorDeNegocio.js";
import { Incidencia } from "../modelos/Incidencia.js";
import { IncidenciaDTO } from "../dto/IncidenciaDTO.js";

export class IncidenciaServicio {
  #incidencias;
  #estacionamientos;
  #eventos;

  constructor({ incidenciaRepositorio, estacionamientoRepositorio, eventos }) {
    this.#incidencias = incidenciaRepositorio;
    this.#estacionamientos = estacionamientoRepositorio;
    this.#eventos = eventos;
  }

  // @HU-9.1 Crear una incidencia · Sebastian
  // pedido: IncidenciaDTO · usuario: modelo Usuario (la precondición ya la revisó ControlDeAcceso).
  async reportar(pedido, usuario, ahora = new Date()) {
    const estacionamiento = await this.#estacionamientos.buscarPorId(pedido.estacionamientoId);
    if (!estacionamiento) throw new ErrorDeNegocio("Ese estacionamiento no existe.", "no_existe");

    const incidencia = Incidencia.crear({ estacionamiento, tipo: pedido.tipo, reportadaPor: usuario?.correo }, ahora);
    await this.#incidencias.guardar(incidencia);

    const dto = IncidenciaDTO.desdeModelo(incidencia, estacionamiento);
    this.#eventos.emitir("INCIDENCIA", { incidencia: dto });
    return dto;
  }

  async listar() {
    const etiquetas = new Map((await this.#estacionamientos.listar()).map((e) => [e.id, e]));
    return (await this.#incidencias.listar()).map((i) => IncidenciaDTO.desdeModelo(i, etiquetas.get(i.estacionamientoId)));
  }

  // Los tres tipos de problema (para el formulario de Reportar y el simulador).
  tipos() {
    return Incidencia.TIPOS.map((t) => ({ ...t }));
  }
}
