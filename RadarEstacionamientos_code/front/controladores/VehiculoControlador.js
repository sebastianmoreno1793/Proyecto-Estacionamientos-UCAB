// @HU-2.1 Registrar mis vehículos · Samuel — Control de Mis vehículos: valida la placa y los datos y manda el vehículo
// Controlador (front) · Vehículos.
import { Controlador } from "./Controlador.js";
import { VehiculoDTO } from "../dto/VehiculoDTO.js";
import { VehiculoServicio } from "../servicios/VehiculoServicio.js";
import { VehiculoValidador } from "../validadores/VehiculoValidador.js";

export class VehiculoControlador extends Controlador {
  #servicio;

  constructor({ navegador, servicio = new VehiculoServicio() } = {}) {
    super({ navegador });
    this.#servicio = servicio;
  }

  // @HU-2.1 Registrar mis vehículos · Samuel — cada usuario ve solo los suyos
  listar() {
    return this.#servicio.listar();
  }

  // @HU-2.1 Registrar mis vehículos · Samuel
  async registrar(formulario) {
    const valores = this.leer(formulario);
    const validacion = this.valida(new VehiculoValidador(), valores);
    if (!validacion.valido) return this.muestra("MensajeDatosNoValidos", { error: validacion.error, errores: validacion.errores, valores });

    const r = await this.#servicio.registrar(new VehiculoDTO(validacion.datos));
    if (!r.ok) return this.muestra("MensajeDatosNoValidos", { error: r.error, valores });
    return this.muestra("MensajeVehiculoRegistrado", { mensaje: `Vehículo ${r.datos.vehiculo.placa} registrado.`, vehiculo: r.datos.vehiculo });
  }
}
