// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Lo que manda el administrador y lo que ve el usuario
// DTO · Edificio: { id, nombre, ubicacion: [latitud, longitud] | null }.
export class EdificioDTO {
  constructor(datos) {
    Object.assign(this, datos);
  }

  // { "nombre": "Módulo 1", "ubicacion": [10.4642, -66.9762] } (ubicacion es opcional).
  static desdeCuerpo(cuerpo) {
    const ubicacion = Array.isArray(cuerpo.ubicacion) && cuerpo.ubicacion.length === 2 ? cuerpo.ubicacion.map(Number) : null;
    return new EdificioDTO({ nombre: String(cuerpo.nombre ?? "").replace(/\s+/g, " ").trim(), ubicacion });
  }

  static desdeModelo(edificio) {
    return new EdificioDTO(edificio.aRegistro());
  }
}
