// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — El edificio, el sugerido y hasta dos alternativas, con su distancia
// DTO · Sugerencia: { edificio: { id, nombre }, sugerido: { id, nombre, libres, capacidad, distancia }, alternativas: [...] }.
export class SugerenciaDTO {
  constructor({ edificio, sugerido, alternativas }) {
    this.edificio = edificio;
    this.sugerido = sugerido;
    this.alternativas = alternativas;
  }

  // candidatos: [{ estacionamiento (modelo), distancia }], el primero es el sugerido.
  static desde(edificio, [primero, ...resto]) {
    const resumen = ({ estacionamiento: e, distancia }) => ({
      id: e.id,
      nombre: e.etiqueta,
      libres: e.libres(),
      capacidad: e.capacidad,
      distancia,
    });
    return new SugerenciaDTO({
      edificio: { id: edificio.id, nombre: edificio.nombre },
      sugerido: resumen(primero),
      alternativas: resto.slice(0, 2).map(resumen),
    });
  }
}
