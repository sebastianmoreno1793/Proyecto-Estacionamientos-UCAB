// @HU-2.1 Registrar mis vehículos · Samuel — Registra el vehículo a nombre del usuario; la placa no se repite en el Radar
// Servicio · Vehículos.
import { ErrorDeNegocio } from "../modelos/ErrorDeNegocio.js";
import { Vehiculo } from "../modelos/Vehiculo.js";
import { VehiculoDTO } from "../dto/VehiculoDTO.js";

export class VehiculoServicio {
  #repositorio;

  constructor({ vehiculoRepositorio }) {
    this.#repositorio = vehiculoRepositorio;
  }

  // @HU-2.1 Registrar mis vehículos · Samuel
  // dueno: correo del usuario con sesión · datos: VehiculoDTO.
  // REGLA DE NEGOCIO: una placa no se registra dos veces (la garita identifica al vehículo por ella).
  async registrar(dueno, datos, ahora = new Date()) {
    const vehiculo = Vehiculo.crear(dueno, datos, ahora);
    if (await this.#repositorio.buscarPorPlaca(vehiculo.placa)) {
      throw new ErrorDeNegocio("Esa placa ya está registrada en el Radar.", "repetida");
    }
    return VehiculoDTO.desdeModelo(await this.#repositorio.guardar(vehiculo));
  }

  // @HU-2.1 Registrar mis vehículos · Samuel — cada usuario ve solo los suyos
  async listarDe(dueno) {
    return (await this.#repositorio.listarDe(dueno)).map(VehiculoDTO.desdeModelo);
  }

  // El Vehiculo con esa placa (para la garita), o null.
  async buscarPorPlaca(placa) {
    return this.#repositorio.buscarPorPlaca(placa);
  }
}
