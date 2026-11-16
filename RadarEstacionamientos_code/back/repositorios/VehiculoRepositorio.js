// @HU-2.1 Registrar mis vehículos · Samuel — Guarda los vehículos de cada usuario
// Repositorio · Vehículos.
import { Repositorio } from "./Repositorio.js";
import { Placa } from "../modelos/Placa.js";
import { Vehiculo } from "../modelos/Vehiculo.js";

export class VehiculoRepositorio extends Repositorio {
  constructor(almacen) {
    super("vehiculos", Vehiculo, almacen);
  }

  // @HU-2.1 Registrar mis vehículos · Samuel — cada usuario ve solo los suyos
  async listarDe(dueno) {
    return (await this.listar()).filter((v) => v.esDe(dueno));
  }

  async buscarPorPlaca(placa) {
    return this.buscarUno((r) => r.placa === Placa.normalizar(placa));
  }
}
