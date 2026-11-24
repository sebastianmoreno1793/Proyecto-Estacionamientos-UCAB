// Relieve · Altura del terreno real (SRTM) en cualquier punto, suavizada para quitar el ruido de
// árboles y techos que trae el modelo de superficie. Las alturas van en metros sobre la cota más
// baja de la rejilla (y = 0 es el punto más bajo del mapa).
import { Coordenadas } from "./Coordenadas.js";

export class Relieve {
  #lat0;
  #lon0;
  #paso;
  #filas;
  #columnas;
  #alturas;

  // datos: { lat0, lon0, paso, filas, columnas, metros } (RELIEVE de datos_campus/campus.js)
  constructor({ lat0, lon0, paso, filas, columnas, metros }, pasadasDeSuavizado = 2) {
    this.#lat0 = lat0;
    this.#lon0 = lon0;
    this.#paso = paso;
    this.#filas = filas;
    this.#columnas = columnas;
    this.#alturas = Relieve.#suavizar(Float64Array.from(metros), filas, columnas, pasadasDeSuavizado);
    this.cotaBase = Math.min(...this.#alturas);

    const sw = Coordenadas.gpsAMetros(lat0, lon0);
    const ne = Coordenadas.gpsAMetros(lat0 + (filas - 1) * paso, lon0 + (columnas - 1) * paso);
    this.extension = { xmin: sw.x, xmax: ne.x, zmin: ne.z, zmax: sw.z };
  }

  // Altura del terreno en (x, z), interpolada entre los cuatro puntos de la rejilla más cercanos.
  alturaBase(x, z) {
    const [lat, lon] = Coordenadas.metrosAGps(x, z);
    const fi = Math.min(this.#filas - 1.0001, Math.max(0, (lat - this.#lat0) / this.#paso));
    const cj = Math.min(this.#columnas - 1.0001, Math.max(0, (lon - this.#lon0) / this.#paso));
    const i = Math.floor(fi);
    const j = Math.floor(cj);
    const a = fi - i;
    const b = cj - j;
    const h = (ii, jj) => this.#alturas[ii * this.#columnas + jj];
    return (
      h(i, j) * (1 - a) * (1 - b) + h(i + 1, j) * a * (1 - b) + h(i, j + 1) * (1 - a) * b + h(i + 1, j + 1) * a * b - this.cotaBase
    );
  }

  // Promedio ponderado 3 × 3, `pasadas` veces.
  static #suavizar(alturas, filas, columnas, pasadas) {
    for (let p = 0; p < pasadas; p++) {
      const suave = new Float64Array(alturas.length);
      for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
          let suma = 0;
          let peso = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ii = Math.min(filas - 1, Math.max(0, i + di));
              const jj = Math.min(columnas - 1, Math.max(0, j + dj));
              const w = di === 0 && dj === 0 ? 4 : di === 0 || dj === 0 ? 2 : 1;
              suma += alturas[ii * columnas + jj] * w;
              peso += w;
            }
          }
          suave[i * columnas + j] = suma / peso;
        }
      }
      alturas = suave;
    }
    return alturas;
  }
}
