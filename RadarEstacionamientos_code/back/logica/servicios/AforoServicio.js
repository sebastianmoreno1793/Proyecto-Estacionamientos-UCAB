// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Registra cada entrada o salida con su hora
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Con cada aviso suma o resta un ocupado, pasando por el filtro de avisos
// Servicio · Aforo. Coordina el modelo Estacionamiento, sus repositorios y las tácticas de
// disponibilidad (FiltroDeAvisos y MonitorDeSensores).
import { ErrorDeNegocio } from "../modelos/ErrorDeNegocio.js";
import { Movimiento } from "../modelos/Movimiento.js";
import { AvisoRechazadoDTO } from "../dto/AvisoRechazadoDTO.js";
import { EstacionamientoDTO } from "../dto/EstacionamientoDTO.js";
import { MovimientoDTO } from "../dto/MovimientoDTO.js";

export class AforoServicio {
  #estacionamientos;
  #movimientos;
  #rechazos;
  #filtro;
  #monitor;
  #eventos;

  constructor({ estacionamientoRepositorio, movimientoRepositorio, avisoRechazadoRepositorio, filtroDeAvisos, monitorDeSensores, eventos }) {
    this.#estacionamientos = estacionamientoRepositorio;
    this.#movimientos = movimientoRepositorio;
    this.#rechazos = avisoRechazadoRepositorio;
    this.#filtro = filtroDeAvisos;
    this.#monitor = monitorDeSensores;
    this.#eventos = eventos;
  }

  // @HU-3.1 Recibir avisos de entrada y salida · Aaron
  // @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
  // aviso: AvisoDTO. Devuelve { movimiento, estacionamiento } (DTO). Si el filtro lo rechaza, lanza
  // ErrorDeNegocio con el motivo («no_existe», «tipo», «lleno», «vacio»); el aviso queda registrado.
  async registrar(aviso, ahora = new Date()) {
    const estacionamiento = await this.#estacionamientos.buscarPorId(aviso.estacionamientoId);
    if (estacionamiento) this.#monitor.recibioAviso(estacionamiento.id, ahora); // el sensor está vivo, aunque falle

    const revision = await this.#filtro.revisar(aviso, estacionamiento, ahora);
    if (!revision.aceptado) {
      if (revision.nuevaFalla) {
        this.#eventos.emitir("SENSOR_CON_FALLA", { estacionamientoId: aviso.estacionamientoId, anomaliasSeguidas: revision.anomaliasSeguidas });
      }
      throw new ErrorDeNegocio(revision.mensaje, revision.motivo);
    }

    estacionamiento.registrarMovimiento(aviso.tipo); // REGLA DE NEGOCIO dentro del modelo
    await this.#estacionamientos.guardar(estacionamiento);
    const movimiento = await this.#movimientos.guardar(Movimiento.crear(aviso, ahora));

    const respuesta = { movimiento: MovimientoDTO.desdeModelo(movimiento), estacionamiento: EstacionamientoDTO.desdeModelo(estacionamiento) };
    this.#eventos.emitir("AVISO", respuesta);
    return respuesta;
  }

  // @HU-3.1 Recibir avisos de entrada y salida · Aaron — los últimos avisos aceptados, el más reciente primero
  async ultimosMovimientos(limite = 50) {
    return (await this.#movimientos.ultimos(limite)).map(MovimientoDTO.desdeModelo);
  }

  // @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — los últimos rechazados (CA3 a CA5)
  async ultimosRechazos(limite = 50) {
    return (await this.#rechazos.ultimos(limite)).map(AvisoRechazadoDTO.desdeModelo);
  }

  // Lo que dicen las tácticas: sensores con falla (FiltroDeAvisos) y sin avisar (MonitorDeSensores).
  async estadoDeLosSensores(ahora = new Date()) {
    const ids = (await this.#estacionamientos.listar()).map((e) => e.id);
    return {
      limiteDeAnomalias: this.#filtro.limite,
      conFalla: this.#filtro.sensoresConFalla(),
      tiempoLimiteMinutos: this.#monitor.tiempoLimiteMinutos,
      sinAviso: this.#monitor.sensoresSinAviso(ids, ahora),
    };
  }
}
