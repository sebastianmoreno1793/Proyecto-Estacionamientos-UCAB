// @HU-2.1 Registrar mis vehículos · Samuel — Pide mis vehículos y registra uno nuevo (fetch)
// Servicio · Vehículos: GET y POST /api/vehiculos.
import { ClienteHttp } from "./ClienteHttp.js";

export class VehiculoServicio extends ClienteHttp {
  async listar() {
    const r = await this.get("/api/vehiculos");
    return r.datos.vehiculos ?? [];
  }

  // vehiculo: VehiculoDTO { placa, marca, modelo, color }
  registrar(vehiculo) {
    return this.post("/api/vehiculos", vehiculo);
  }
}
