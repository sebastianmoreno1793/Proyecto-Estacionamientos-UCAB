// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Lo que manda el administrador: nombre y ubicación
// DTO · Edificio que el front envía a /api/edificios: { nombre, ubicacion: [latitud, longitud] | null }.
export class EdificioDTO {
  constructor({ nombre, ubicacion = null }) {
    this.nombre = nombre;
    this.ubicacion = ubicacion;
  }
}
