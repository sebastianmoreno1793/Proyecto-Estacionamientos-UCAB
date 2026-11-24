// Poligono · Cálculos sobre polígonos y polilíneas del mapa 3D (listas de { x, z } en metros).
// No usa Three.js ni el navegador, así se prueba con `npm test`.
export class Poligono {
  // ¿El punto (x, z) cae dentro del polígono?
  static contiene(x, z, pts) {
    let dentro = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const a = pts[i];
      const b = pts[j];
      if (a.z > z !== b.z > z && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) dentro = !dentro;
    }
    return dentro;
  }

  // Área en m².
  static area(pts) {
    let suma = 0;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      suma += pts[j].x * pts[i].z - pts[i].x * pts[j].z;
    }
    return Math.abs(suma / 2);
  }

  // Caja { xmin, xmax, zmin, zmax } que encierra los puntos, con `margen` metros de más.
  static caja(pts, margen = 0) {
    const xs = pts.map((p) => p.x);
    const zs = pts.map((p) => p.z);
    return {
      xmin: Math.min(...xs) - margen,
      xmax: Math.max(...xs) + margen,
      zmin: Math.min(...zs) - margen,
      zmax: Math.max(...zs) + margen,
    };
  }

  // Distancia del punto (x, z) al segmento a–b.
  static distanciaASegmento(x, z, a, b) {
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const largo2 = dx * dx + dz * dz;
    const t = largo2 === 0 ? 0 : Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / largo2));
    return Math.hypot(x - (a.x + t * dx), z - (a.z + t * dz));
  }

  // Distancia del punto al borde del polígono (cerrado).
  static distanciaAlBorde(x, z, pts) {
    let minimo = Infinity;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      minimo = Math.min(minimo, Poligono.distanciaASegmento(x, z, pts[j], pts[i]));
    }
    return minimo;
  }

  // Distancia del punto a una polilínea (abierta, como una vía).
  static distanciaAPolilinea(x, z, pts) {
    let minimo = Infinity;
    for (let i = 1; i < pts.length; i++) minimo = Math.min(minimo, Poligono.distanciaASegmento(x, z, pts[i - 1], pts[i]));
    return minimo;
  }

  // ¿Los polígonos p y q se pisan o se cruzan?
  static seTocan(p, q) {
    if (p.some((v) => Poligono.contiene(v.x, v.z, q)) || q.some((v) => Poligono.contiene(v.x, v.z, p))) return true;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      for (let k = 0, l = q.length - 1; k < q.length; l = k++) {
        if (Poligono.#segmentosSeCruzan(p[j], p[i], q[l], q[k])) return true;
      }
    }
    return false;
  }

  static #segmentosSeCruzan(a, b, c, d) {
    const orientacion = (p, q, r) => Math.sign((q.x - p.x) * (r.z - p.z) - (q.z - p.z) * (r.x - p.x));
    return orientacion(a, b, c) !== orientacion(a, b, d) && orientacion(c, d, a) !== orientacion(c, d, b);
  }

  // El punto del interior más alejado de los bordes (ahí van el tótem o la etiqueta).
  // El promedio de las esquinas puede caer fuera en polígonos cóncavos.
  static puntoInterior(pts, paso = 2) {
    const caja = Poligono.caja(pts);
    let mejor = null;
    let mejorDistancia = -1;
    for (let x = caja.xmin; x <= caja.xmax; x += paso) {
      for (let z = caja.zmin; z <= caja.zmax; z += paso) {
        if (!Poligono.contiene(x, z, pts)) continue;
        const d = Poligono.distanciaAlBorde(x, z, pts);
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

  // Dirección (ángulo) del lado más largo: los puestos se alinean con ella.
  static direccionPrincipal(pts) {
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
  static distribuirPuestos(pts, { anchoPuesto = 2.6, largoPuesto = 5, pasillo = 6, margen = 0.8 } = {}) {
    const angulo = Poligono.direccionPrincipal(pts);
    const u = { x: Math.cos(angulo), z: Math.sin(angulo) };
    const v = { x: -u.z, z: u.x };
    const us = pts.map((p) => p.x * u.x + p.z * u.z);
    const vs = pts.map((p) => p.x * v.x + p.z * v.z);
    const [umin, umax, vmin, vmax] = [Math.min(...us), Math.max(...us), Math.min(...vs), Math.max(...vs)];
    const aMundo = (pu, pv) => ({ x: pu * u.x + pv * v.x, z: pu * u.z + pv * v.z });
    const adentro = (pu, pv) => {
      const p = aMundo(pu, pv);
      return Poligono.contiene(p.x, p.z, pts) && Poligono.distanciaAlBorde(p.x, p.z, pts) >= margen;
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

  // Punto del borde del polígono más cercano a `p` (la entrada de un estacionamiento, p. ej.),
  // con el ángulo del lado donde cae.
  static puntoMasCercanoEnBorde(pts, p) {
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
}
