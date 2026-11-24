// @HU-2.1 Registrar mis vehículos · Samuel — Lo que manda el formulario de Mis vehículos
// DTO · Vehículo que el front envía a POST /api/vehiculos.
export class VehiculoDTO {
  constructor({ placa, marca, modelo, color }) {
    Object.assign(this, { placa, marca, modelo, color });
  }
}
