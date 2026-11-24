// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Un movimiento aceptado tal como sale por la API
// DTO · Movimiento (entrada o salida registrada).
export class MovimientoDTO {
  constructor({ id, idAviso, estacionamientoId, tipo, hora }) {
    Object.assign(this, { id, idAviso, estacionamientoId, tipo, hora });
  }

  static desdeModelo(movimiento) {
    return new MovimientoDTO(movimiento.aRegistro());
  }
}
