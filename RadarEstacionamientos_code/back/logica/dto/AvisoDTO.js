// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Lo que manda el sensor: estacionamiento, ENTRADA o SALIDA e id del aviso
// DTO · Aviso de un sensor. Solo arma los datos (mayúsculas, texto); no valida: las reglas las
// aplica el modelo Estacionamiento a través de la táctica FiltroDeAvisos.
export class AvisoDTO {
  constructor({ estacionamientoId, tipo, idAviso = null }) {
    this.estacionamientoId = estacionamientoId;
    this.tipo = tipo;
    this.idAviso = idAviso;
  }

  // { "estacionamientoId": "est-playa", "tipo": "entrada", "idAviso": 7 } → tipo «ENTRADA», idAviso «7».
  static desdeCuerpo(cuerpo) {
    return new AvisoDTO({
      estacionamientoId: String(cuerpo.estacionamientoId ?? ""),
      tipo: String(cuerpo.tipo ?? "").toUpperCase().trim(),
      idAviso: ["string", "number"].includes(typeof cuerpo.idAviso) ? String(cuerpo.idAviso).slice(0, 100) : null,
    });
  }
}
