// @HU-3.2 Simular sensores y placas · Aaron — Lo que manda el lector de la garita y lo que se devuelve
// DTO · Lectura de placa. La placa es un dato personal: este DTO solo lo ve el lector y el administrador.
export class LecturaDePlacaDTO {
  constructor(datos) {
    Object.assign(this, datos);
  }

  // { "placa": "ab-123 cd", "sentido": "entrada", "idLectura": "L1" }
  static desdeCuerpo(cuerpo) {
    return new LecturaDePlacaDTO({
      placa: String(cuerpo.placa ?? ""),
      sentido: String(cuerpo.sentido ?? "").toUpperCase().trim(),
      idLectura: ["string", "number"].includes(typeof cuerpo.idLectura) ? String(cuerpo.idLectura).slice(0, 100) : null,
    });
  }

  static desdeModelo(lectura) {
    return new LecturaDePlacaDTO(lectura.aRegistro());
  }
}
