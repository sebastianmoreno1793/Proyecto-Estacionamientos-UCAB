// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Lee y guarda el aforo de cada estacionamiento
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Guarda la capacidad nueva y si está abierto
// Repositorio · Estacionamientos del campus.
import { Repositorio } from "./Repositorio.js";
import { Estacionamiento } from "../modelos/Estacionamiento.js";

export class EstacionamientoRepositorio extends Repositorio {
  constructor(almacen) {
    super("estacionamientos", Estacionamiento, almacen);
  }

  // @HU-9.1 Crear una incidencia · Sebastian — solo los abiertos aparecen en el formulario
  async listarAbiertos() {
    return (await this.listar()).filter((e) => e.estaAbierto());
  }
}
