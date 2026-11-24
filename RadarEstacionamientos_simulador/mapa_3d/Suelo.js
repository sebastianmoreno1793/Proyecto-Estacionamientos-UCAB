// Suelo · El suelo del mapa: el relieve con terrazas planas (estacionamientos, canchas, plazas),
// como se construye un campus en ladera. Guarda la rejilla de alturas para la malla y `alturaEn`
// interpola EXACTAMENTE como los triángulos de esa malla: así las vías y los carros quedan
// pegados al suelo sin hundirse ni flotar.
import { Poligono } from "./Poligono.js";

export class Suelo {
  // relieve: un Relieve · terrazas: [{ pts, nivel }] (en orden; la última manda donde se pisan)
  constructor({ relieve, paso = 5, terrazas = [], borde = 8 }) {
    const { extension } = relieve;
    this.paso = paso;
    this.nx = Math.floor((extension.xmax - extension.xmin) / paso);
    this.nz = Math.floor((extension.zmax - extension.zmin) / paso);
    this.x0 = extension.xmin;
    this.z0 = extension.zmin;
    this.alturas = new Float32Array((this.nx + 1) * (this.nz + 1));

    const conCaja = terrazas.map((t) => ({ ...t, caja: Poligono.caja(t.pts, borde) }));
    for (let iz = 0; iz <= this.nz; iz++) {
      for (let ix = 0; ix <= this.nx; ix++) {
        const x = this.x0 + ix * paso;
        const z = this.z0 + iz * paso;
        this.alturas[iz * (this.nx + 1) + ix] = Suelo.#alturaConTerrazas(relieve.alturaBase(x, z), x, z, conCaja, borde);
      }
    }
  }

  // Altura del suelo en (x, z). Cada celda se parte en dos triángulos por la diagonal (ix, iz+1)–(ix+1, iz).
  alturaEn(x, z) {
    const { nx, nz, paso, x0, z0, alturas } = this;
    const fx = Math.min(nx - 1e-6, Math.max(0, (x - x0) / paso));
    const fz = Math.min(nz - 1e-6, Math.max(0, (z - z0) / paso));
    const ix = Math.floor(fx);
    const iz = Math.floor(fz);
    const u = fx - ix;
    const w = fz - iz;
    const h = (cx, cz) => alturas[cz * (nx + 1) + cx];
    if (u + w <= 1) {
      const ha = h(ix, iz);
      return ha + u * (h(ix + 1, iz) - ha) + w * (h(ix, iz + 1) - ha);
    }
    const hc = h(ix + 1, iz + 1);
    return hc + (1 - u) * (h(ix, iz + 1) - hc) + (1 - w) * (h(ix + 1, iz) - hc);
  }

  // Dentro de una terraza, su nivel; cerca del borde, una transición suave hacia el relieve.
  static #alturaConTerrazas(h, x, z, terrazas, borde) {
    for (const t of terrazas) {
      const c = t.caja;
      if (x < c.xmin || x > c.xmax || z < c.zmin || z > c.zmax) continue;
      if (Poligono.contiene(x, z, t.pts)) {
        h = t.nivel;
      } else {
        const d = Poligono.distanciaAlBorde(x, z, t.pts);
        if (d < borde) {
          const s = 1 - d / borde;
          const w = s * s * (3 - 2 * s);
          h = h + (t.nivel - h) * w;
        }
      }
    }
    return h;
  }
}
