// @HU-3.2 Simular sensores y placas · Aaron — Registra cada placa leída en la garita sin duplicar los reintentos
// Servicio · Garita (lector de placas).
import { LecturaDePlaca } from "../modelos/LecturaDePlaca.js";
import { LecturaDePlacaDTO } from "../dto/LecturaDePlacaDTO.js";

export class GaritaServicio {
  #repositorio;
  #eventos;

  constructor({ lecturaDePlacaRepositorio, eventos }) {
    this.#repositorio = lecturaDePlacaRepositorio;
    this.#eventos = eventos;
  }

  // @HU-3.2 Simular sensores y placas · Aaron
  // lectura: LecturaDePlacaDTO. Si llega repetida (mismo idLectura) no se duplica.
  // Devuelve { lectura (DTO), repetida }.
  async registrar(lectura, ahora = new Date()) {
    const repetida = await this.#repositorio.buscarPorIdLectura(lectura.idLectura);
    if (repetida) return { lectura: LecturaDePlacaDTO.desdeModelo(repetida), repetida: true };

    const guardada = await this.#repositorio.guardar(LecturaDePlaca.crear(lectura, ahora));
    // Al canal en vivo va el sentido, NO la placa (dato personal).
    this.#eventos.emitir("LECTURA_GARITA", { sentido: guardada.sentido, idLectura: guardada.idLectura });
    return { lectura: LecturaDePlacaDTO.desdeModelo(guardada), repetida: false };
  }

  // @HU-3.2 Simular sensores y placas · Aaron — las últimas placas leídas, la más reciente primero
  async ultimas(limite = 50) {
    return (await this.#repositorio.ultimos(limite)).map(LecturaDePlacaDTO.desdeModelo);
  }
}
