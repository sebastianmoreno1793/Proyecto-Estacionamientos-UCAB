// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Un aviso rechazado tal como lo ve el administrador
// DTO · Aviso rechazado o anomalía, con su motivo y su hora.
export class AvisoRechazadoDTO {
  constructor({ id, idAviso, estacionamientoId, tipo, motivo, hora }) {
    Object.assign(this, { id, idAviso, estacionamientoId, tipo, motivo, hora });
  }

  static desdeModelo(rechazo) {
    return new AvisoRechazadoDTO(rechazo.aRegistro());
  }
}
