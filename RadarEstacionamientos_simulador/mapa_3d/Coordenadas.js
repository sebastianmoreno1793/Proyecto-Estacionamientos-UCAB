// Coordenadas · Pasa coordenadas GPS a metros del mundo 3D (HU 3.2). No usa Three.js ni el navegador,
// así se prueba con `npm test`.
//
// Ejes del mundo 3D (en metros, origen en CENTRO_CAMPUS):
//   x  este (+) / oeste (−)
//   z  sur (+) / norte (−)   ← negado para que Three.js vea el norte "hacia adentro"
//   y  altura sobre la cota más baja del relieve

import { CENTRO_CAMPUS } from "../datos_campus/campus.js";

export class Coordenadas {
  static LAT_CENTRO = CENTRO_CAMPUS[0];
  static LON_CENTRO = CENTRO_CAMPUS[1];
  static M_POR_GRADO_LAT = 110540;
  static M_POR_GRADO_LON = 111320 * Math.cos((Coordenadas.LAT_CENTRO * Math.PI) / 180);

  // [lat, lon] → { x, z } en metros desde el centro del campus.
  static gpsAMetros(lat, lon) {
    return {
      x: (lon - Coordenadas.LON_CENTRO) * Coordenadas.M_POR_GRADO_LON, // Este-Oeste
      z: -(lat - Coordenadas.LAT_CENTRO) * Coordenadas.M_POR_GRADO_LAT, // Norte-Sur (negado para Three.js)
    };
  }

  // { x, z } en metros → [lat, lon] (el camino de vuelta de gpsAMetros).
  static metrosAGps(x, z) {
    return [Coordenadas.LAT_CENTRO - z / Coordenadas.M_POR_GRADO_LAT, Coordenadas.LON_CENTRO + x / Coordenadas.M_POR_GRADO_LON];
  }

  // Lista de [lat, lon] → lista de { x, z }.
  static poligonoAMetros(poligono) {
    return poligono.map(([lat, lon]) => Coordenadas.gpsAMetros(lat, lon));
  }
}
