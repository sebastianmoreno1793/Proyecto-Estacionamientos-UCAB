// @HU-3.2 Simular sensores y placas · Aaron — Guarda las placas leídas en la garita
// Repositorio · Lecturas del lector de placas.
import { Repositorio } from "./Repositorio.js";
import { LecturaDePlaca } from "../../logica/modelos/LecturaDePlaca.js";

export class LecturaDePlacaRepositorio extends Repositorio {
  constructor(almacen) {
    super("lecturasDePlaca", LecturaDePlaca, almacen);
  }

  // Para no duplicar una lectura que el lector reintenta con el mismo idLectura.
  async buscarPorIdLectura(idLectura) {
    if (!idLectura) return null;
    return this.buscarUno((r) => r.idLectura === idLectura);
  }
}
