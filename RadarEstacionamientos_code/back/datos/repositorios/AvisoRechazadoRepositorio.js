// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Guarda los avisos rechazados y las anomalías
// Repositorio · Avisos que no cambiaron el aforo (los registra la táctica FiltroDeAvisos).
import { Repositorio } from "./Repositorio.js";
import { AvisoRechazado } from "../../logica/modelos/AvisoRechazado.js";

export class AvisoRechazadoRepositorio extends Repositorio {
  constructor(almacen) {
    super("avisosRechazados", AvisoRechazado, almacen);
  }
}
