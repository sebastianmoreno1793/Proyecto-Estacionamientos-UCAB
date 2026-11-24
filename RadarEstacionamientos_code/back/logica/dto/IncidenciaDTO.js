// @HU-9.1 Crear una incidencia · Sebastian — Lo que llega del formulario y lo que se devuelve, sin el correo de quien reporta
// DTO · Incidencia.
export class IncidenciaDTO {
  constructor(datos) {
    Object.assign(this, datos);
  }

  // { "estacionamientoId": "est-playa", "tipo": "conos_atravesados" }
  static desdeCuerpo(cuerpo) {
    return new IncidenciaDTO({ estacionamientoId: String(cuerpo.estacionamientoId ?? ""), tipo: String(cuerpo.tipo ?? "") });
  }

  // Lo que se muestra o emite: sin el correo de quien la reportó. `estacionamiento` (opcional) da la etiqueta.
  static desdeModelo(incidencia, estacionamiento = null) {
    return new IncidenciaDTO({
      id: incidencia.id,
      estacionamientoId: incidencia.estacionamientoId,
      estacionamiento: estacionamiento?.etiqueta ?? incidencia.estacionamientoId,
      tipo: incidencia.tipo,
      nombreTipo: incidencia.nombreDelTipo(),
      estado: incidencia.estado,
      reportadaEn: incidencia.reportadaEn,
    });
  }
}
