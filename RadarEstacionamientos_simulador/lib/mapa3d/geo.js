// Geometría del mapa 3D (HU 3.2). Funciones puras: no usan Three.js ni el navegador,
// así se prueban con `npm test`.
//
// Ejes del mundo 3D (en metros, origen en CENTRO_CAMPUS):
//   x  este (+) / oeste (−)
//   z  sur (+) / norte (−)   ← negado para que Three.js vea el norte "hacia adentro"
//   y  altura sobre la cota más baja del relieve

import { CENTRO_CAMPUS } from "../../data/campus.js";

export const [LAT_CENTRO, LON_CENTRO] = CENTRO_CAMPUS;
export const M_POR_GRADO_LAT = 110540;
export const M_POR_GRADO_LON = 111320 * Math.cos((LAT_CENTRO * Math.PI) / 180);

export function gpsAMetros(lat, lon) {
  return {
    x: (lon - LON_CENTRO) * M_POR_GRADO_LON, // Este-Oeste
    z: -(lat - LAT_CENTRO) * M_POR_GRADO_LAT, // Norte-Sur (negado para Three.js)
  };
}

export const poligonoAMetros = (poligono) => poligono.map(([lat, lon]) => gpsAMetros(lat, lon));

// ---------- Polígonos (listas de {x, z}) ----------

export function puntoEnPoligono(x, z, pts) {
  let dentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i];
    const b = pts[j];
    if (a.z > z !== b.z > z && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) dentro = !dentro;
  }
  return dentro;
}

export function areaPoligono(pts) {
  let suma = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    suma += pts[j].x * pts[i].z - pts[i].x * pts[j].z;
  }
  return Math.abs(suma / 2);
}

export function cajaDe(pts, margen = 0) {
  const xs = pts.map((p) => p.x);
  const zs = pts.map((p) => p.z);
  return {
    xmin: Math.min(...xs) - margen,
    xmax: Math.max(...xs) + margen,
    zmin: Math.min(...zs) - margen,
    zmax: Math.max(...zs) + margen,
  };
}

export function distanciaASegmento(x, z, a, b) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const largo2 = dx * dx + dz * dz;
  const t = largo2 === 0 ? 0 : Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / largo2));
  return Math.hypot(x - (a.x + t * dx), z - (a.z + t * dz));
}

export function distanciaAlBorde(x, z, pts) {
  let minimo = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    minimo = Math.min(minimo, distanciaASegmento(x, z, pts[j], pts[i]));
  }
  return minimo;
}

export function distanciaAPolilinea(x, z, pts) {
  let minimo = Infinity;
  for (let i = 1; i < pts.length; i++) minimo = Math.min(minimo, distanciaASegmento(x, z, pts[i - 1], pts[i]));
  return minimo;
}

function segmentosSeCruzan(a, b, c, d) {
  const orientacion = (p, q, r) => Math.sign((q.x - p.x) * (r.z - p.z) - (q.z - p.z) * (r.x - p.x));
  return (
    orientacion(a, b, c) !== orientacion(a, b, d) && orientacion(c, d, a) !== orientacion(c, d, b)
  );
}

export function poligonosSeTocan(p, q) {
  if (p.some((v) => puntoEnPoligono(v.x, v.z, q)) || q.some((v) => puntoEnPoligono(v.x, v.z, p))) return true;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    for (let k = 0, l = q.length - 1; k < q.length; l = k++) {
      if (segmentosSeCruzan(p[j], p[i], q[l], q[k])) return true;
    }
  }
  return false;
}

// El punto del interior más alejado de los bordes (ahí van el tótem o la etiqueta).
// El promedio de las esquinas puede caer fuera en polígonos cóncavos.
export function puntoInterior(pts, paso = 2) {
  const caja = cajaDe(pts);
  let mejor = null;
  let mejorDistancia = -1;
  for (let x = caja.xmin; x <= caja.xmax; x += paso) {
    for (let z = caja.zmin; z <= caja.zmax; z += paso) {
      if (!puntoEnPoligono(x, z, pts)) continue;
      const d = distanciaAlBorde(x, z, pts);
      if (d > mejorDistancia) {
        mejorDistancia = d;
        mejor = { x, z };
      }
    }
  }
  if (mejor) return mejor;
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
    z: pts.reduce((s, p) => s + p.z, 0) / pts.length,
  };
}

// Dirección del lado más largo: los puestos se alinean con ella.
export function direccionPrincipal(pts) {
  let mayor = 0;
  let angulo = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const largo = Math.hypot(pts[i].x - pts[j].x, pts[i].z - pts[j].z);
    if (largo > mayor) {
      mayor = largo;
      angulo = Math.atan2(pts[i].z - pts[j].z, pts[i].x - pts[j].x);
    }
  }
  return angulo;
}

// Reparte puestos de 2,6 × 5 m dentro del polígono: filas dobles con un pasillo de 6 m
// entre ellas, alineadas con el lado más largo. Cada puesto queda entero dentro del área.
// `haciaPasillo` (+1 / −1) dice hacia qué lado de la fila está el pasillo.
export function distribuirPuestos(
  pts,
  { anchoPuesto = 2.6, largoPuesto = 5, pasillo = 6, margen = 0.8 } = {}
) {
  const angulo = direccionPrincipal(pts);
  const u = { x: Math.cos(angulo), z: Math.sin(angulo) };
  const v = { x: -u.z, z: u.x };
  const us = pts.map((p) => p.x * u.x + p.z * u.z);
  const vs = pts.map((p) => p.x * v.x + p.z * v.z);
  const [umin, umax, vmin, vmax] = [Math.min(...us), Math.max(...us), Math.min(...vs), Math.max(...vs)];
  const aMundo = (pu, pv) => ({ x: pu * u.x + pv * v.x, z: pu * u.z + pv * v.z });
  const adentro = (pu, pv) => {
    const p = aMundo(pu, pv);
    return puntoEnPoligono(p.x, p.z, pts) && distanciaAlBorde(p.x, p.z, pts) >= margen;
  };

  const puestos = [];
  let v0 = vmin + margen;
  for (let fila = 0; v0 + largoPuesto <= vmax - margen; fila++) {
    for (let u0 = umin + margen; u0 + anchoPuesto <= umax - margen; u0 += anchoPuesto) {
      const esquinas = [
        [u0, v0],
        [u0 + anchoPuesto, v0],
        [u0 + anchoPuesto, v0 + largoPuesto],
        [u0, v0 + largoPuesto],
      ];
      if (!esquinas.every(([a, b]) => adentro(a, b))) continue;
      const centro = aMundo(u0 + anchoPuesto / 2, v0 + largoPuesto / 2);
      puestos.push({
        ...centro,
        fila,
        haciaPasillo: fila % 2 === 0 ? 1 : -1,
        lineaIzquierda: [aMundo(u0, v0), aMundo(u0, v0 + largoPuesto)],
        lineaDerecha: [aMundo(u0 + anchoPuesto, v0), aMundo(u0 + anchoPuesto, v0 + largoPuesto)],
      });
    }
    v0 += largoPuesto + (fila % 2 === 0 ? pasillo : 0);
  }
  return { puestos, angulo, u, v, largoPuesto };
}

// Mezcla determinista (siempre el mismo orden para la misma semilla).
export function generadorAleatorio(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function semillaDeTexto(texto) {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function mezclar(lista, aleatorio) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// ---------- Relieve ----------

// Altura del relieve SRTM en cualquier punto, suavizada para quitar el ruido de
// árboles y techos que trae el modelo de superficie. Devuelve metros sobre la cota
// más baja de la rejilla (y = 0 es el punto más bajo del mapa).
export function crearRelieve(relieve, pasadasDeSuavizado = 2) {
  const { lat0, lon0, paso, filas, columnas } = relieve;
  let alturas = Float64Array.from(relieve.metros);
  for (let p = 0; p < pasadasDeSuavizado; p++) {
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
  const cotaBase = Math.min(...alturas);

  const sw = gpsAMetros(lat0, lon0);
  const ne = gpsAMetros(lat0 + (filas - 1) * paso, lon0 + (columnas - 1) * paso);
  const extension = { xmin: sw.x, xmax: ne.x, zmin: ne.z, zmax: sw.z };

  function alturaBase(x, z) {
    const lat = LAT_CENTRO - z / M_POR_GRADO_LAT;
    const lon = LON_CENTRO + x / M_POR_GRADO_LON;
    const fi = Math.min(filas - 1.0001, Math.max(0, (lat - lat0) / paso));
    const cj = Math.min(columnas - 1.0001, Math.max(0, (lon - lon0) / paso));
    const i = Math.floor(fi);
    const j = Math.floor(cj);
    const a = fi - i;
    const b = cj - j;
    const h = (ii, jj) => alturas[ii * columnas + jj];
    return (
      h(i, j) * (1 - a) * (1 - b) +
      h(i + 1, j) * a * (1 - b) +
      h(i, j + 1) * (1 - a) * b +
      h(i + 1, j + 1) * a * b -
      cotaBase
    );
  }

  return { alturaBase, cotaBase, extension };
}

// Suelo del mapa: el relieve con terrazas planas (estacionamientos, canchas, plazas),
// como se construye un campus en ladera. Devuelve la rejilla de alturas para la malla
// y `alturaEn`, que interpola EXACTAMENTE como los triángulos de esa malla: así las
// vías y los carros quedan pegados al suelo sin hundirse ni flotar.
//   terrazas: [{ pts, nivel }]   (en orden; la última manda donde se pisan)
export function crearSuelo({ alturaBase, extension, paso = 5, terrazas = [], borde = 8 }) {
  const nx = Math.floor((extension.xmax - extension.xmin) / paso);
  const nz = Math.floor((extension.zmax - extension.zmin) / paso);
  const x0 = extension.xmin;
  const z0 = extension.zmin;
  const alturas = new Float32Array((nx + 1) * (nz + 1));

  const conCaja = terrazas.map((t) => ({ ...t, caja: cajaDe(t.pts, borde) }));
  for (let iz = 0; iz <= nz; iz++) {
    for (let ix = 0; ix <= nx; ix++) {
      const x = x0 + ix * paso;
      const z = z0 + iz * paso;
      let h = alturaBase(x, z);
      for (const t of conCaja) {
        const c = t.caja;
        if (x < c.xmin || x > c.xmax || z < c.zmin || z > c.zmax) continue;
        if (puntoEnPoligono(x, z, t.pts)) {
          h = t.nivel;
        } else {
          const d = distanciaAlBorde(x, z, t.pts);
          if (d < borde) {
            const s = 1 - d / borde;
            const w = s * s * (3 - 2 * s);
            h = h + (t.nivel - h) * w;
          }
        }
      }
      alturas[iz * (nx + 1) + ix] = h;
    }
  }

  // Cada celda se parte en dos triángulos por la diagonal (ix, iz+1)–(ix+1, iz).
  function alturaEn(x, z) {
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

  return { nx, nz, paso, x0, z0, alturas, alturaEn };
}

// Punto del borde del polígono más cercano a `p` (la entrada de un estacionamiento, p. ej.).
export function puntoMasCercanoEnBorde(pts, p) {
  let mejor = null;
  let distancia = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[j];
    const b = pts[i];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const largo2 = dx * dx + dz * dz || 1;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / largo2));
    const q = { x: a.x + t * dx, z: a.z + t * dz, angulo: Math.atan2(dz, dx) };
    const d = Math.hypot(q.x - p.x, q.z - p.z);
    if (d < distancia) {
      distancia = d;
      mejor = q;
    }
  }
  return mejor;
}
