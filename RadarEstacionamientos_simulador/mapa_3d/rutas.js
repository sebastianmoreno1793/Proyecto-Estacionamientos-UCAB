// Rutas del carro por las vías reales del campus (mapa 3D, HU 3.2). Funciones puras.
//
// El grafo se arma con las vías de `datos_campus/campus.js`: dos vías se conectan donde
// comparten un punto de OSM (mismas coordenadas). Se respeta el sentido único.

import { gpsAMetros, puntoEnPoligono } from "./geo.js";

export const TIPOS_CIRCULABLES = ["principal", "acceso", "interna"];

const claveDe = ({ x, z }) => `${x.toFixed(2)},${z.toFixed(2)}`;

export function crearGrafo(vias, tipos = TIPOS_CIRCULABLES) {
  const nodos = [];
  const indice = new Map();
  const salientes = [];
  const entrantes = [];

  const nodoDe = (p) => {
    const clave = claveDe(p);
    if (!indice.has(clave)) {
      indice.set(clave, nodos.length);
      nodos.push(p);
      salientes.push([]);
      entrantes.push([]);
    }
    return indice.get(clave);
  };
  const unir = (a, b, costo) => {
    salientes[a].push({ hacia: b, costo });
    entrantes[b].push({ hacia: a, costo });
  };

  for (const via of vias) {
    if (!tipos.includes(via.tipo)) continue;
    const pts = via.puntos.map(([lat, lon]) => gpsAMetros(lat, lon));
    for (let i = 1; i < pts.length; i++) {
      const a = nodoDe(pts[i - 1]);
      const b = nodoDe(pts[i]);
      const costo = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
      unir(a, b, costo);
      if (!via.sentidoUnico) unir(b, a, costo);
    }
  }
  return { nodos, salientes, entrantes, indice };
}

export function nodoMasCercano(grafo, { x, z }) {
  let mejor = -1;
  let distancia = Infinity;
  grafo.nodos.forEach((n, i) => {
    const d = Math.hypot(n.x - x, n.z - z);
    if (d < distancia) {
      distancia = d;
      mejor = i;
    }
  });
  return mejor;
}

// Dijkstra desde `origen`. Con `alReves` recorre las aristas al revés: da la distancia
// de cada nodo HASTA `origen` (sirve para la salida).
// Con `ignorarSentido` usa las aristas en ambos sentidos (plan B si el trazado de OSM
// deja un estacionamiento sin salida legal).
export function distanciasDesde(grafo, origen, { alReves = false, ignorarSentido = false } = {}) {
  const n = grafo.nodos.length;
  const distancia = new Float64Array(n).fill(Infinity);
  const previo = new Int32Array(n).fill(-1);
  const visitado = new Uint8Array(n);
  distancia[origen] = 0;
  for (;;) {
    let actual = -1;
    for (let i = 0; i < n; i++) {
      if (!visitado[i] && distancia[i] < Infinity && (actual === -1 || distancia[i] < distancia[actual])) actual = i;
    }
    if (actual === -1) break;
    visitado[actual] = 1;
    const vecinos = ignorarSentido
      ? [...grafo.salientes[actual], ...grafo.entrantes[actual]]
      : alReves
        ? grafo.entrantes[actual]
        : grafo.salientes[actual];
    for (const { hacia, costo } of vecinos) {
      if (distancia[actual] + costo < distancia[hacia]) {
        distancia[hacia] = distancia[actual] + costo;
        previo[hacia] = actual;
      }
    }
  }
  return { distancia, previo };
}

function caminoHasta(previo, destino) {
  const camino = [];
  for (let i = destino; i !== -1; i = previo[i]) camino.push(i);
  return camino.reverse();
}

// Nodo del grafo donde el carro deja la vía para entrar al estacionamiento: el más
// cercano al puesto, prefiriendo los pasillos que están dentro del área.
function nodoDeAcceso(grafo, distancia, pts, puesto) {
  let mejor = -1;
  let puntaje = Infinity;
  grafo.nodos.forEach((n, i) => {
    if (distancia[i] === Infinity) return;
    const factor = puntoEnPoligono(n.x, n.z, pts) ? 0.5 : 1;
    const p = Math.hypot(n.x - puesto.x, n.z - puesto.z) * factor;
    if (p < puntaje) {
      puntaje = p;
      mejor = i;
    }
  });
  return mejor;
}

// Ruta de ENTRADA: de la garita al estacionamiento. Devuelve los puntos {x, z} por las
// vías (sin la llegada por la Av. Teherán ni el último tramo al puesto) y si hubo que
// ignorar algún sentido único.
export function rutaDesdeGarita(grafo, garita, pts, puesto) {
  let ignorarSentido = false;
  let { distancia, previo } = distanciasDesde(grafo, garita);
  let acceso = nodoDeAcceso(grafo, distancia, pts, puesto);
  if (acceso === -1) {
    ignorarSentido = true;
    ({ distancia, previo } = distanciasDesde(grafo, garita, { ignorarSentido }));
    acceso = nodoDeAcceso(grafo, distancia, pts, puesto);
  }
  return {
    puntos: caminoHasta(previo, acceso).map((i) => grafo.nodos[i]),
    ignorarSentido,
    longitud: distancia[acceso],
  };
}

// Ruta de SALIDA: del estacionamiento a la garita.
export function rutaHaciaGarita(grafo, garita, pts, puesto) {
  let ignorarSentido = false;
  let { distancia, previo } = distanciasDesde(grafo, garita, { alReves: true });
  let acceso = nodoDeAcceso(grafo, distancia, pts, puesto);
  if (acceso === -1) {
    ignorarSentido = true;
    ({ distancia, previo } = distanciasDesde(grafo, garita, { ignorarSentido }));
    acceso = nodoDeAcceso(grafo, distancia, pts, puesto);
  }
  // `previo` apunta hacia la garita: recorrerlo desde el acceso ya da el orden de salida.
  const camino = [];
  for (let i = acceso; i !== -1; i = previo[i]) camino.push(i);
  return {
    puntos: camino.map((i) => grafo.nodos[i]),
    ignorarSentido,
    longitud: distancia[acceso],
  };
}
