// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Guarda el catálogo de edificios
// Repositorio · Edificios del catálogo.
import { Repositorio } from "./Repositorio.js";
import { Edificio } from "../../logica/modelos/Edificio.js";

export class EdificioRepositorio extends Repositorio {
  constructor(almacen) {
    super("edificios", Edificio, almacen);
  }
}
