// GrafoDeVias · Rutas del carro por las vías reales del campus (mapa 3D, HU 3.2).
//
// El grafo se arma con las vías de `datos_campus/campus.js`: dos vías se conectan donde
// comparten un punto de OSM (mismas coordenadas). Se respeta el sentido único.
import { Coordenadas } from "./Coordenadas.js";
import { Poligono } from "./Poligono.js";

export class GrafoDeVias {
  static TIPOS_CIRCULABLES = ["principal", "acceso", "interna"];

  nodos = [];
  salientes = [];
  entrantes = [];
  #indice = new Map();

  constructor(vias, tipos = GrafoDeVias.TIPOS_CIRCULABLES) {
    for (const via of vias) {
      if (!tipos.includes(via.tipo)) continue;
      const pts = via.puntos.map(([lat, lon]) => Coordenadas.gpsAMetros(lat, lon));
      for (let i = 1; i < pts.length; i++) {
        const a = this.#nodoDe(pts[i - 1]);
        const b = this.#nodoDe(pts[i]);
        const costo = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
        this.#unir(a, b, costo);
        if (!via.sentidoUnico) this.#unir(b, a, costo);
      }
    }
  }

  // Índice del nodo más cercano al punto { x, z }.
  nodoMasCercano({ x, z }) {
    let mejor = -1;
    let distancia = Infinity;
    this.nodos.forEach((n, i) => {
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
  distanciasDesde(origen, { alReves = false, ignorarSentido = false } = {}) {
    const n = this.nodos.length;
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
        ? [...this.salientes[actual], ...this.entrantes[actual]]
        : alReves
          ? this.entrantes[actual]
          : this.salientes[actual];
      for (const { hacia, costo } of vecinos) {
        if (distancia[actual] + costo < distancia[hacia]) {
          distancia[hacia] = distancia[actual] + costo;
          previo[hacia] = actual;
        }
      }
    }
    return { distancia, previo };
  }

  // Ruta de ENTRADA: de la garita al estacionamiento. Devuelve los puntos { x, z } por las
  // vías (sin la llegada por la Av. Teherán ni el último tramo al puesto) y si hubo que
  // ignorar algún sentido único.
  rutaDesdeGarita(garita, pts, puesto) {
    const { distancia, previo, acceso, ignorarSentido } = this.#buscarAcceso(garita, pts, puesto, { alReves: false });
    const camino = [];
    for (let i = acceso; i !== -1; i = previo[i]) camino.push(i);
    return { puntos: camino.reverse().map((i) => this.nodos[i]), ignorarSentido, longitud: distancia[acceso] };
  }

  // Ruta de SALIDA: del estacionamiento a la garita.
  rutaHaciaGarita(garita, pts, puesto) {
    const { distancia, previo, acceso, ignorarSentido } = this.#buscarAcceso(garita, pts, puesto, { alReves: true });
    // `previo` apunta hacia la garita: recorrerlo desde el acceso ya da el orden de salida.
    const camino = [];
    for (let i = acceso; i !== -1; i = previo[i]) camino.push(i);
    return { puntos: camino.map((i) => this.nodos[i]), ignorarSentido, longitud: distancia[acceso] };
  }

  // Distancias desde la garita y el nodo de acceso al estacionamiento; si no hay camino
  // respetando los sentidos únicos, lo busca ignorándolos.
  #buscarAcceso(garita, pts, puesto, { alReves }) {
    let ignorarSentido = false;
    let { distancia, previo } = this.distanciasDesde(garita, { alReves });
    let acceso = this.#nodoDeAcceso(distancia, pts, puesto);
    if (acceso === -1) {
      ignorarSentido = true;
      ({ distancia, previo } = this.distanciasDesde(garita, { ignorarSentido }));
      acceso = this.#nodoDeAcceso(distancia, pts, puesto);
    }
    return { distancia, previo, acceso, ignorarSentido };
  }

  // Nodo donde el carro deja la vía para entrar al estacionamiento: el más cercano al
  // puesto, prefiriendo los pasillos que están dentro del área.
  #nodoDeAcceso(distancia, pts, puesto) {
    let mejor = -1;
    let puntaje = Infinity;
    this.nodos.forEach((n, i) => {
      if (distancia[i] === Infinity) return;
      const factor = Poligono.contiene(n.x, n.z, pts) ? 0.5 : 1;
      const p = Math.hypot(n.x - puesto.x, n.z - puesto.z) * factor;
      if (p < puntaje) {
        puntaje = p;
        mejor = i;
      }
    });
    return mejor;
  }

  #nodoDe(p) {
    const clave = `${p.x.toFixed(2)},${p.z.toFixed(2)}`;
    if (!this.#indice.has(clave)) {
      this.#indice.set(clave, this.nodos.length);
      this.nodos.push(p);
      this.salientes.push([]);
      this.entrantes.push([]);
    }
    return this.#indice.get(clave);
  }

  #unir(a, b, costo) {
    this.salientes[a].push({ hacia: b, costo });
    this.entrantes[b].push({ hacia: a, costo });
  }
}
