// @HU-9.1 Crear una incidencia · Sebastian — Guarda las incidencias reportadas
// Repositorio · Incidencias.
import { Repositorio } from "./Repositorio.js";
import { Incidencia } from "../../logica/modelos/Incidencia.js";

export class IncidenciaRepositorio extends Repositorio {
  constructor(almacen) {
    super("incidencias", Incidencia, almacen);
  }
}
