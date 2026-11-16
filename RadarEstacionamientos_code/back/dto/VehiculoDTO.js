// @HU-2.1 Registrar mis vehículos · Samuel — Lo que llega del formulario y lo que ve el dueño
// DTO · Vehículo.
export class VehiculoDTO {
  constructor(datos) {
    Object.assign(this, datos);
  }

  // { "placa": "AB123CD", "marca": "Toyota", "modelo": "Corolla", "color": "Gris" } (quita espacios de los extremos).
  static desdeCuerpo(cuerpo) {
    const texto = (valor) => String(valor ?? "").trim();
    return new VehiculoDTO({ placa: texto(cuerpo.placa), marca: texto(cuerpo.marca), modelo: texto(cuerpo.modelo), color: texto(cuerpo.color) });
  }

  static desdeModelo(vehiculo) {
    const { id, placa, marca, modelo, color, registradoEn } = vehiculo.aRegistro();
    return new VehiculoDTO({ id, placa, marca, modelo, color, registradoEn });
  }
}
