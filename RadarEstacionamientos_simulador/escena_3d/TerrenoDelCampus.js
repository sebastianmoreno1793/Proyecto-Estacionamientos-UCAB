// TerrenoDelCampus · Todo lo fijo del campus en 3D, con coordenadas reales: relieve con terrazas,
// cerca, vías, canchas, plazas, edificios, puntos de interés y árboles.
//   edificios, vías, canchas, relieve   datos_campus/campus.js (OpenStreetMap + SRTM)
//   estacionamientos                    la app base (GET /api/estacionamientos)
// Lo único que no tiene coordenadas son los árboles (decorativos, repartidos en las áreas verdes).
import * as THREE from "three";
import { AREAS, CANCHAS, CONTORNO_CAMPUS, EDIFICIOS, PUNTOS_DE_INTERES, RELIEVE, VIAS } from "@/datos_campus/campus";
import { Aleatorio } from "@/mapa_3d/Aleatorio";
import { Coordenadas } from "@/mapa_3d/Coordenadas";
import { Poligono } from "@/mapa_3d/Poligono";
import { Relieve } from "@/mapa_3d/Relieve";
import { Suelo } from "@/mapa_3d/Suelo";
import { Medidas3D } from "./Medidas3D.js";
import { Piezas3D } from "./Piezas3D.js";
import { Texturas3D } from "./Texturas3D.js";

const { VIA } = Medidas3D;

export class TerrenoDelCampus {
  #escena;
  #etiquetas;
  #relieve;
  #suelo;
  #edificios;
  #canchas;
  #areas;
  #plazas;
  #texturaVentanas;

  // estacionamientos: los que trae la app base (con polígono) · etiquetas: un Etiquetas3D
  constructor(escena, estacionamientos, etiquetas) {
    this.#escena = escena;
    this.#etiquetas = etiquetas;

    // Polígonos reales en metros
    this.contorno = Coordenadas.poligonoAMetros(CONTORNO_CAMPUS);
    this.zonas = estacionamientos
      .filter((e) => e?.poligono?.length >= 3)
      .map((est) => ({ est, pts: Coordenadas.poligonoAMetros(est.poligono) }));
    this.#edificios = EDIFICIOS.map((e) => ({ ...e, pts: Coordenadas.poligonoAMetros(e.poligono) }));
    this.#canchas = CANCHAS.map((c) => ({ ...c, pts: Coordenadas.poligonoAMetros(c.poligono) }));
    this.#areas = AREAS.map((a) => ({ ...a, pts: Coordenadas.poligonoAMetros(a.poligono) }));
    this.#plazas = this.#areas.filter((a) => a.tipo === "plaza");
    this.vias = VIAS.map((v) => ({ ...v, pts: v.puntos.map(([lat, lon]) => Coordenadas.gpsAMetros(lat, lon)) }));

    // Relieve real (SRTM) con terrazas planas, como se construye un campus en ladera
    this.#relieve = new Relieve(RELIEVE);
    this.#nivelarTerrazas();
    this.#suelo = new Suelo({
      relieve: this.#relieve,
      paso: 5,
      terrazas: [...this.#canchas, ...this.#plazas, ...this.zonas.map((z) => ({ pts: z.pts, nivel: z.nivel }))],
    });

    this.#dibujarSuelo();
    this.#dibujarCerca();
    this.#dibujarVias();
    this.#dibujarCanchasYPlazas();
    this.#dibujarEdificios();
    this.#dibujarPuntosDeInteres();
    this.#rotularAvenidas();
    this.#plantarArboles();
  }

  // Altura del suelo (con terrazas) en (x, z).
  alturaEn(x, z) {
    return this.#suelo.alturaEn(x, z);
  }

  // Altura a la que rueda un carro: sobre la losa de un estacionamiento o sobre el asfalto.
  alturaDeRodado(x, z) {
    const enLosa = this.zonas.some((zd) => Poligono.contiene(x, z, zd.pts));
    return this.alturaEn(x, z) + (enLosa ? Medidas3D.ESPESOR_LOSA + 0.02 : VIA.principal.elevacion + 0.02);
  }

  destruir() {
    this.#texturaVentanas.dispose();
  }

  // Alturas del relieve dentro del polígono (cada 6 m) y en sus esquinas.
  #muestrasDeAltura(pts) {
    const muestras = pts.map((p) => this.#relieve.alturaBase(p.x, p.z));
    const caja = Poligono.caja(pts);
    for (let x = caja.xmin; x <= caja.xmax; x += 6) {
      for (let z = caja.zmin; z <= caja.zmax; z += 6) {
        if (Poligono.contiene(x, z, pts)) muestras.push(this.#relieve.alturaBase(x, z));
      }
    }
    return muestras;
  }

  static #promedio(lista) {
    return lista.reduce((s, v) => s + v, 0) / lista.length;
  }

  // Nivel plano de cada estacionamiento, cancha y plaza. Los estacionamientos que se tocan
  // (Sambilito y Presambilito, p. ej.) comparten terraza.
  #nivelarTerrazas() {
    const zonas = this.zonas;
    const grupo = zonas.map((_, i) => i);
    const raiz = (i) => (grupo[i] === i ? i : (grupo[i] = raiz(grupo[i])));
    for (let i = 0; i < zonas.length; i++) {
      for (let j = i + 1; j < zonas.length; j++) {
        if (Poligono.seTocan(zonas[i].pts, zonas[j].pts)) grupo[raiz(i)] = raiz(j);
      }
    }
    const nivelDeGrupo = new Map();
    zonas.forEach((z, i) => {
      const r = raiz(i);
      nivelDeGrupo.set(r, [...(nivelDeGrupo.get(r) ?? []), ...this.#muestrasDeAltura(z.pts)]);
    });
    // Un desfase mínimo por zona evita que dos losas superpuestas parpadeen.
    zonas.forEach((z, i) => {
      z.nivel = TerrenoDelCampus.#promedio(nivelDeGrupo.get(raiz(i))) + i * 0.02;
    });
    for (const c of this.#canchas) c.nivel = TerrenoDelCampus.#promedio(this.#muestrasDeAltura(c.pts));
    for (const a of this.#plazas) a.nivel = TerrenoDelCampus.#promedio(this.#muestrasDeAltura(a.pts));
  }

  // Terreno: césped dentro del campus, ciudad y cerros alrededor, y los costados de la maqueta.
  #dibujarSuelo() {
    const { nx, nz, paso, x0, z0, alturas } = this.#suelo;
    const jardines = this.#areas.filter((a) => a.tipo === "jardin");
    const posiciones = [];
    const colores = [];
    const indices = [];
    const cCampus = new THREE.Color(0x3b7537);
    const cJardin = new THREE.Color(0x4f9a46);
    const cCiudad = new THREE.Color(0x4a4d48);
    const cCerro = new THREE.Color(0x4c6236);
    const color = new THREE.Color();
    for (let iz = 0; iz <= nz; iz++) {
      for (let ix = 0; ix <= nx; ix++) {
        const x = x0 + ix * paso;
        const z = z0 + iz * paso;
        const h = alturas[iz * (nx + 1) + ix];
        posiciones.push(x, h, z);
        const ruido = (Math.sin(ix * 12.9898 + iz * 78.233) * 43758.5453) % 1;
        if (Poligono.contiene(x, z, this.contorno)) {
          color.copy(jardines.some((j) => Poligono.contiene(x, z, j.pts)) ? cJardin : cCampus);
        } else {
          color.copy(cCiudad).lerp(cCerro, Medidas3D.limitar((h - 25) / 60, 0, 1));
        }
        color.offsetHSL(0, 0, ruido * 0.025);
        colores.push(color.r, color.g, color.b);
      }
    }
    for (let iz = 0; iz < nz; iz++) {
      for (let ix = 0; ix < nx; ix++) {
        const a = iz * (nx + 1) + ix;
        const b = a + nx + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const terreno = new THREE.Mesh(
      Piezas3D.geometria({ posiciones, indices, colores }),
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }),
    );
    terreno.receiveShadow = true;
    this.#escena.add(terreno);

    // Costados de la maqueta (bloque de tierra)
    const fondo = -14;
    const costados = { posiciones: [], indices: [] };
    const borde = (lista) => {
      const base = costados.posiciones.length / 3;
      lista.forEach(([ix, iz]) => {
        const x = x0 + ix * paso;
        const z = z0 + iz * paso;
        costados.posiciones.push(x, alturas[iz * (nx + 1) + ix], z, x, fondo, z);
      });
      for (let i = 1; i < lista.length; i++) {
        const k = base + (i - 1) * 2;
        costados.indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      }
    };
    borde(Array.from({ length: nx + 1 }, (_, ix) => [ix, 0]));
    borde(Array.from({ length: nx + 1 }, (_, ix) => [ix, nz]));
    borde(Array.from({ length: nz + 1 }, (_, iz) => [0, iz]));
    borde(Array.from({ length: nz + 1 }, (_, iz) => [nx, iz]));
    this.#escena.add(
      new THREE.Mesh(
        Piezas3D.geometria(costados),
        new THREE.MeshStandardMaterial({ color: 0x3b2f24, roughness: 1, side: THREE.DoubleSide }),
      ),
    );
  }

  // Cerca del campus (contorno de OSM).
  #dibujarCerca() {
    const puntos = [];
    const cerrado = [...this.contorno, this.contorno[0]];
    for (let i = 1; i < cerrado.length; i++) {
      const a = cerrado[i - 1];
      const b = cerrado[i];
      const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 4));
      for (let k = 0; k < n; k++) {
        const x = a.x + ((b.x - a.x) * k) / n;
        const z = a.z + ((b.z - a.z) * k) / n;
        puntos.push(new THREE.Vector3(x, this.alturaEn(x, z) + 1.2, z));
      }
    }
    puntos.push(puntos[0].clone());
    this.#escena.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(puntos),
        new THREE.LineBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.55 }),
      ),
    );
  }

  // Vías: cintas de asfalto pegadas al relieve, con las curvas del trazado de OSM.
  #dibujarVias() {
    const cintas = new Map();
    const agregarCinta = (clave, color, pts, anchoCinta, elevacion) => {
      if (!cintas.has(clave)) cintas.set(clave, { color, posiciones: [], indices: [] });
      const destino = cintas.get(clave);
      const base = destino.posiciones.length / 3;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 1)];
        const b = pts[Math.min(pts.length - 1, i + 1)];
        const largo = Math.hypot(b.x - a.x, b.z - a.z) || 1;
        const nx = -(b.z - a.z) / largo;
        const nz = (b.x - a.x) / largo;
        for (const lado of [1, -1]) {
          const x = pts[i].x + (nx * anchoCinta * lado) / 2;
          const z = pts[i].z + (nz * anchoCinta * lado) / 2;
          destino.posiciones.push(x, this.alturaEn(x, z) + elevacion, z);
        }
        if (i > 0) {
          const k = base + (i - 1) * 2;
          destino.indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
        }
      }
    };

    for (const via of this.vias) {
      const estilo = VIA[via.tipo];
      if (!estilo) continue;
      const trazado = Piezas3D.suavizar(via.pts, 2);
      agregarCinta(via.tipo, estilo.color, trazado, estilo.ancho, estilo.elevacion);
      via.trazado = trazado;
    }
    // Líneas viales amarillas (discontinuas) en el anillo principal y los accesos
    for (const via of this.vias.filter((v) => v.tipo === "principal" || v.tipo === "acceso")) {
      const pts = Piezas3D.suavizar(via.pts, 1.5);
      for (let i = 0; i + 2 < pts.length; i += 4) {
        agregarCinta("linea", 0xfacc15, pts.slice(i, i + 3), 0.25, VIA.principal.elevacion + 0.04);
      }
    }
    for (const [, { color, posiciones, indices }] of cintas) {
      const malla = new THREE.Mesh(
        Piezas3D.geometria({ posiciones, indices }),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.85,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2,
        }),
      );
      malla.receiveShadow = true;
      this.#escena.add(malla);
    }
  }

  // Canchas y plazas (terrazas planas).
  #dibujarCanchasYPlazas() {
    for (const c of this.#canchas) {
      const geo = new THREE.ShapeGeometry(Piezas3D.forma(c.pts));
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, c.nivel + 0.1, 0);
      const cancha = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: Medidas3D.COLOR_CANCHA[c.deporte] ?? 0x3f8f3f, roughness: 0.9 }),
      );
      cancha.receiveShadow = true;
      this.#escena.add(cancha);
      const borde = c.pts.map((p) => new THREE.Vector3(p.x, c.nivel + 0.15, p.z));
      this.#escena.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(borde), new THREE.LineBasicMaterial({ color: 0xffffff })));
    }
    for (const plaza of this.#plazas) {
      const piso = new THREE.Mesh(
        Piezas3D.losa(plaza.pts, plaza.nivel - 1, plaza.nivel + 0.12),
        new THREE.MeshStandardMaterial({ color: 0xbfb8a8, roughness: 0.9 }),
      );
      piso.receiveShadow = true;
      this.#escena.add(piso);
    }
  }

  // Edificios de referencia (huellas reales de OSM), con su nombre encima.
  #dibujarEdificios() {
    this.#texturaVentanas = Texturas3D.ventanas();
    const materialTecho = new THREE.MeshStandardMaterial({ color: 0x8f969e, roughness: 0.9 });
    for (const e of this.#edificios) {
      const pts = e.pts;
      const alturasSuelo = pts.map((p) => this.alturaEn(p.x, p.z));
      const base = Math.min(...alturasSuelo) - 0.5;
      const esCapilla = e.uso === "capilla";
      const tope = TerrenoDelCampus.#promedio(alturasSuelo) + (esCapilla ? 8 : e.pisos * Medidas3D.ALTO_PISO);
      const paredes = new THREE.MeshStandardMaterial({
        color: Medidas3D.COLOR_EDIFICIO[e.uso] ?? Medidas3D.COLOR_EDIFICIO.otro,
        map: esCapilla ? null : this.#texturaVentanas,
        roughness: 0.8,
      });
      const edificio = new THREE.Mesh(Piezas3D.losa(pts, base, tope), [materialTecho, paredes]);
      edificio.castShadow = true;
      edificio.receiveShadow = true;
      this.#escena.add(edificio);

      if (esCapilla) this.#dibujarTechoDeCapilla(pts, tope);

      if (e.nombre) {
        const c = Poligono.puntoInterior(pts);
        this.#etiquetas.crear(e.nombre, new THREE.Vector3(c.x, tope + (esCapilla ? 9 : 2), c.z), { factor: 0.016, max: 13, hasta: 1100 });
      }
    }
  }

  // Techo a dos aguas y cruz, orientados con el lado largo de la capilla.
  #dibujarTechoDeCapilla(pts, tope) {
    const angulo = Poligono.direccionPrincipal(pts);
    const u = { x: Math.cos(angulo), z: Math.sin(angulo) };
    const v = { x: -u.z, z: u.x };
    const us = pts.map((p) => p.x * u.x + p.z * u.z);
    const vs = pts.map((p) => p.x * v.x + p.z * v.z);
    const largoU = Math.max(...us) - Math.min(...us);
    const anchoV = Math.max(...vs) - Math.min(...vs);
    const cu = (Math.max(...us) + Math.min(...us)) / 2;
    const cv = (Math.max(...vs) + Math.min(...vs)) / 2;
    const centro = { x: cu * u.x + cv * v.x, z: cu * u.z + cv * v.z };
    const perfil = new THREE.Shape([
      new THREE.Vector2(-anchoV / 2 - 0.6, 0),
      new THREE.Vector2(anchoV / 2 + 0.6, 0),
      new THREE.Vector2(0, anchoV * 0.45),
    ]);
    const geoTecho = new THREE.ExtrudeGeometry(perfil, { depth: largoU + 1, bevelEnabled: false });
    geoTecho.translate(0, 0, -(largoU + 1) / 2);
    const techo = new THREE.Mesh(geoTecho, new THREE.MeshStandardMaterial({ color: 0x9a4a32, roughness: 0.8 }));
    techo.position.set(centro.x, tope, centro.z);
    techo.rotation.y = Math.atan2(u.x, u.z);
    techo.castShadow = true;
    this.#escena.add(techo);

    const matCruz = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
    const cruz = new THREE.Group();
    const palo = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4, 0.35), matCruz);
    const brazoCruz = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 2), matCruz);
    brazoCruz.position.y = 0.8;
    cruz.add(palo, brazoCruz);
    const extremo = largoU / 2 - 1.5;
    cruz.position.set(centro.x + u.x * extremo, tope + anchoV * 0.45 + 1.6, centro.z + u.z * extremo);
    cruz.rotation.y = Math.atan2(u.x, u.z);
    this.#escena.add(cruz);
  }

  // Puntos de interés de OSM (la estatua se modela; el resto, solo etiqueta).
  #dibujarPuntosDeInteres() {
    for (const p of PUNTOS_DE_INTERES) {
      const { x, z } = Coordenadas.gpsAMetros(...p.posicion);
      const y = this.alturaEn(x, z);
      if (p.tipo === "estatua") {
        const bronce = new THREE.MeshStandardMaterial({ color: 0x8c6a3f, metalness: 0.4, roughness: 0.5 });
        const pedestal = new THREE.Mesh(new THREE.BoxGeometry(2, 2.2, 2), new THREE.MeshStandardMaterial({ color: 0xd6d3d1 }));
        pedestal.position.set(x, y + 1.1, z);
        const figura = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 2.2, 10), bronce);
        figura.position.set(x, y + 3.3, z);
        const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), bronce);
        cabeza.position.set(x, y + 4.7, z);
        for (const m of [pedestal, figura, cabeza]) {
          m.castShadow = true;
          this.#escena.add(m);
        }
      }
      this.#etiquetas.crear(p.nombre, new THREE.Vector3(x, y + 6, z), { factor: 0.012, min: 2.5, max: 6, hasta: 380, color: "#fde68a" });
    }
  }

  // Nombres de las avenidas de alrededor, para orientarse.
  #rotularAvenidas() {
    for (const nombre of ["Avenida Teherán", "Autopista Gran Cacique Guaicaipuro"]) {
      const tramo = this.vias
        .filter((v) => v.nombre === nombre && v.trazado?.length > 4)
        .sort((a, b) => b.trazado.length - a.trazado.length)[0];
      if (!tramo) continue;
      const m = tramo.trazado[Math.floor(tramo.trazado.length / 2)];
      this.#etiquetas.crear(nombre, new THREE.Vector3(m.x, this.alturaEn(m.x, m.z) + 4, m.z), {
        factor: 0.016,
        max: 18,
        hasta: 2000,
        color: "#cbd5e1",
        fondo: "rgba(30, 41, 59, 0.75)",
      });
    }
  }

  // Vegetación: árboles en las áreas verdes (posiciones decorativas, siempre las mismas).
  #plantarArboles() {
    const aleatorio = new Aleatorio(20261013);
    const contorno = this.contorno;
    const caja = Poligono.caja(contorno);
    const obstaculos = [
      ...this.#edificios.map((e) => ({ pts: e.pts, margen: 5 })),
      ...this.zonas.map((z) => ({ pts: z.pts, margen: 3 })),
      ...this.#canchas.map((c) => ({ pts: c.pts, margen: 2 })),
      ...this.#plazas.map((p) => ({ pts: p.pts, margen: 2 })),
    ].map((o) => ({ ...o, caja: Poligono.caja(o.pts, o.margen) }));
    const caminos = this.vias
      .filter((v) => v.trazado && v.pts.some((p) => Poligono.contiene(p.x, p.z, contorno)))
      .map((v) => ({ pts: v.trazado, margen: VIA[v.tipo].ancho / 2 + 2.5, caja: Poligono.caja(v.trazado, 8) }));
    const dentroDeCaja = (c, x, z) => x >= c.xmin && x <= c.xmax && z >= c.zmin && z <= c.zmax;

    const arboles = [];
    for (let intento = 0; arboles.length < Medidas3D.CANTIDAD_ARBOLES && intento < 40000; intento++) {
      const x = caja.xmin + aleatorio.siguiente() * (caja.xmax - caja.xmin);
      const z = caja.zmin + aleatorio.siguiente() * (caja.zmax - caja.zmin);
      if (!Poligono.contiene(x, z, contorno) || Poligono.distanciaAlBorde(x, z, contorno) < 4) continue;
      const choca = obstaculos.some(
        (o) => dentroDeCaja(o.caja, x, z) && (Poligono.contiene(x, z, o.pts) || Poligono.distanciaAlBorde(x, z, o.pts) < o.margen),
      );
      if (choca) continue;
      if (caminos.some((c) => dentroDeCaja(c.caja, x, z) && Poligono.distanciaAPolilinea(x, z, c.pts) < c.margen)) continue;
      if (arboles.some((a) => Math.hypot(a.x - x, a.z - z) < 10)) continue;
      arboles.push({ x, z, escala: 0.8 + aleatorio.siguiente() * 0.6, tono: aleatorio.siguiente() });
    }

    const troncos = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.35, 0.5, 5, 6).translate(0, 2.5, 0),
      new THREE.MeshStandardMaterial({ color: 0x5b4636, roughness: 1 }),
      arboles.length,
    );
    const copas = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(3.6, 1).translate(0, 7.2, 0),
      new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }),
      arboles.length,
    );
    const verdes = [0x2f6b2f, 0x3a7d34, 0x285c2a, 0x4a8a3c];
    const matriz = new THREE.Matrix4();
    const color = new THREE.Color();
    arboles.forEach((a, i) => {
      matriz.compose(new THREE.Vector3(a.x, this.alturaEn(a.x, a.z) - 0.2, a.z), new THREE.Quaternion(), new THREE.Vector3(a.escala, a.escala, a.escala));
      troncos.setMatrixAt(i, matriz);
      copas.setMatrixAt(i, matriz);
      copas.setColorAt(i, color.setHex(verdes[Math.floor(a.tono * verdes.length)]));
    });
    troncos.castShadow = true;
    copas.castShadow = true;
    this.#escena.add(troncos, copas);
  }
}
