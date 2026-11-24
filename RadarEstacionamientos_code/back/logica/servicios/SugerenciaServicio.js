// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Elige el estacionamiento abierto con puestos libres más cercano al edificio
// Servicio · Sugerencia. Criterio de aceptación (Issue #9): «el usuario elige el edificio al que va y
// el sistema le sugiere el estacionamiento con puestos libres más cercano a ese edificio, sin tomar
// en cuenta todavía su horario». El horario es la HU 7.1 y los puestos docentes la 7.3 (R2).
import { ErrorDeNegocio } from "../modelos/ErrorDeNegocio.js";
import { SugerenciaDTO } from "../dto/SugerenciaDTO.js";

export class SugerenciaServicio {
  static RADIO_DE_LA_TIERRA_M = 6371000;

  #edificios;
  #estacionamientos;

  constructor({ edificioRepositorio, estacionamientoRepositorio }) {
    this.#edificios = edificioRepositorio;
    this.#estacionamientos = estacionamientoRepositorio;
  }

  // @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
  // Devuelve un SugerenciaDTO o lanza ErrorDeNegocio («no_existe», «sin_ubicacion», «sin_puestos»).
  async sugerir(edificioId) {
    const edificio = await this.#edificios.buscarPorId(edificioId);
    return SugerenciaDTO.desde(edificio, this.candidatos(edificio, await this.#estacionamientos.listar()));
  }

  // @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
  // REGLA: solo abiertos (HU 5.4) y con al menos un puesto libre (D-009); el más cercano primero y,
  // si están a la misma distancia, el que tiene más libres. Considera también los de solo profesores
  // (tener en cuenta el rol es la HU 7.3). Devuelve [{ estacionamiento, distancia }].
  candidatos(edificio, estacionamientos) {
    if (!edificio) throw new ErrorDeNegocio("Ese edificio no existe.", "no_existe");
    if (!edificio.tieneUbicacion()) {
      throw new ErrorDeNegocio(`«${edificio.nombre}» todavía no tiene ubicación. Pídele al administrador que la agregue.`, "sin_ubicacion");
    }
    const lista = estacionamientos
      .filter((e) => e.estaAbierto() && e.libres() > 0 && e.poligono.length)
      .map((e) => ({ estacionamiento: e, distancia: this.distanciaEnMetros(edificio.ubicacion, this.centroDelPoligono(e.poligono)) }))
      .sort((a, b) => a.distancia - b.distancia || b.estacionamiento.libres() - a.estacionamiento.libres());
    if (lista.length === 0) {
      throw new ErrorDeNegocio("Ahora mismo no hay puestos libres en ningún estacionamiento abierto.", "sin_puestos");
    }
    return lista;
  }

  // Distancia en línea recta, en metros, entre dos puntos [latitud, longitud] (fórmula de Haversine).
  // La distancia caminando por el campus es la HU 6.2 (R2).
  distanciaEnMetros([lat1, lon1], [lat2, lon2]) {
    const aRadianes = (grados) => (grados * Math.PI) / 180;
    const dLat = aRadianes(lat2 - lat1);
    const dLon = aRadianes(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLon / 2) ** 2;
    return Math.round(2 * SugerenciaServicio.RADIO_DE_LA_TIERRA_M * Math.asin(Math.sqrt(a)));
  }

  // Centro aproximado de un estacionamiento: el promedio de las esquinas de su polígono.
  centroDelPoligono(poligono) {
    const suma = poligono.reduce(([la, lo], [lat, lon]) => [la + lat, lo + lon], [0, 0]);
    return [suma[0] / poligono.length, suma[1] / poligono.length];
  }
}
