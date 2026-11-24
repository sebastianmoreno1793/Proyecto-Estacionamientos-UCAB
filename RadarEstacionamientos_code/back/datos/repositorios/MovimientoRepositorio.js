// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Guarda cada entrada o salida aceptada
// Repositorio · Movimientos (avisos que cambiaron el aforo).
import { Repositorio } from "./Repositorio.js";
import { Movimiento } from "../../logica/modelos/Movimiento.js";

export class MovimientoRepositorio extends Repositorio {
  constructor(almacen) {
    super("movimientos", Movimiento, almacen);
  }
}
