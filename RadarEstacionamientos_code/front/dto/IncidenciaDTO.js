// @HU-9.1 Crear una incidencia · Sebastian — Lo que manda el formulario de Reportar: estacionamiento y tipo de problema
// DTO · Incidencia que el front envía a POST /api/incidencias.
export class IncidenciaDTO {
  constructor({ estacionamientoId, tipo }) {
    this.estacionamientoId = estacionamientoId;
    this.tipo = tipo;
  }
}
