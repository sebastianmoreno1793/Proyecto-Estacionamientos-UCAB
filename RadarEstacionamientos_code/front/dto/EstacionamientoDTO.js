// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Lo que el front recibe de cada estacionamiento: libres, porcentaje y semáforo
// DTO · Estacionamiento que llega de GET /api/estacionamientos y del canal en vivo.
export class EstacionamientoDTO {
  constructor({ id, nombre, etiqueta, soloProfesores = false, capacidad, ocupados, libres, porcentaje, activo, semaforo, poligono = [], pisos = null }) {
    Object.assign(this, { id, nombre, etiqueta: etiqueta ?? nombre, soloProfesores, capacidad, ocupados, libres, porcentaje, activo, semaforo, poligono, pisos });
  }

  static desde(datos) {
    return new EstacionamientoDTO(datos);
  }
}
