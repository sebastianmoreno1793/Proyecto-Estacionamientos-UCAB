"use client";
// @PANTALLA Simulador Maqueta › Render del campus visto desde arriba

// Render de la MAQUETA del campus para la app (D-007 › Maqueta): una vista desde arriba, con
// el acabado de una maqueta física de arquitectura (grama de fieltro, árboles redondos, techos
// de teja y concreto, asfalto claro, puestos pintados), estática y en alta resolución.
//
// Sale de los mismos datos reales que la maqueta 3D: edificios, vías, canchas y jardines de
// `datos_campus/campus.js` (OpenStreetMap) y los estacionamientos de la app base (su API pública,
// D-006). El suelo es plano: es una maqueta, no el relieve.
//
// Al terminar, `onListo({ imagen, datos })` entrega la imagen (JPEG) y la proyección: dónde
// cae cada estacionamiento y cada edificio en la imagen, en píxeles. Con eso la app pinta el
// semáforo encima sin volver a dibujar el campus.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AREAS, CANCHAS, CONTORNO_CAMPUS, EDIFICIOS, GARITA, PUNTOS_DE_INTERES, VIAS } from "@/datos_campus/campus";
import {
  cajaDe,
  distanciaAPolilinea,
  distribuirPuestos,
  generadorAleatorio,
  gpsAMetros,
  poligonoAMetros,
  puntoEnPoligono,
  puntoInterior,
  semillaDeTexto,
} from "@/mapa_3d/geo";

const ALTO_PISO = 3.5;
const INCLINACION = 34; // grados desde la vertical: se ven techos y fachadas, como una foto de maqueta
const ALTO_BASE = 2.4; // grosor de la base de la maqueta

const VIA = {
  autopista: { ancho: 11, afuera: true },
  avenida: { ancho: 10, afuera: true },
  ramal: { ancho: 6, afuera: true },
  principal: { ancho: 7 },
  acceso: { ancho: 5.5 },
  interna: { ancho: 4.5 },
  peatonal: { ancho: 2.4, peatonal: true },
};

// ---------- Texturas hechas a mano (canvas) ----------

function textura(dibujar, tam = 256, metros = 20) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = tam;
  dibujar(canvas.getContext("2d"), tam);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / metros, 1 / metros);
  t.anisotropy = 8;
  return t;
}

function ruido(ctx, tam, base, manchas, cuantas, radio, aleatorio) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, tam, tam);
  for (let i = 0; i < cuantas; i++) {
    ctx.fillStyle = manchas[Math.floor(aleatorio() * manchas.length)];
    const r = radio * (0.4 + aleatorio());
    ctx.beginPath();
    ctx.arc(aleatorio() * tam, aleatorio() * tam, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function crearTexturas() {
  const a = generadorAleatorio(7);
  return {
    grama: textura((c, t) => ruido(c, t, "#86b25f", ["#7aa755", "#93bd69", "#6f9e4c", "#9cc471"], 2600, 1.6, a), 256, 16),
    gramaJardin: textura((c, t) => ruido(c, t, "#93c06a", ["#a5cc78", "#86b35f", "#b3d486"], 2200, 1.6, a), 256, 14),
    afuera: textura((c, t) => ruido(c, t, "#b3b38a", ["#adae84", "#b9b991", "#a8aa80"], 1800, 2.4, a), 256, 40),
    asfalto: textura((c, t) => ruido(c, t, "#a7a9ab", ["#9ea0a3", "#b0b2b4", "#999b9e"], 2400, 1, a), 256, 12),
    asfaltoEstacionamiento: textura((c, t) => ruido(c, t, "#8f9396", ["#878b8f", "#979a9d", "#82868a"], 2400, 1, a), 256, 12),
    adoquin: textura((c, t) => {
      c.fillStyle = "#e8dcc4";
      c.fillRect(0, 0, t, t);
      c.strokeStyle = "rgba(150, 125, 90, 0.35)";
      c.lineWidth = 2;
      for (let i = 0; i <= t; i += t / 8) {
        c.beginPath(); c.moveTo(i, 0); c.lineTo(i, t); c.stroke();
        c.beginPath(); c.moveTo(0, i); c.lineTo(t, i); c.stroke();
      }
    }, 256, 8),
    teja: textura((c, t) => {
      c.fillStyle = "#c9764d";
      c.fillRect(0, 0, t, t);
      for (let y = 0; y < t; y += 16) {
        c.fillStyle = y % 32 ? "#bf6c44" : "#d38359";
        c.fillRect(0, y, t, 9);
        c.fillStyle = "rgba(90, 40, 20, 0.25)";
        c.fillRect(0, y + 14, t, 2);
      }
    }, 128, 6),
    concreto: textura((c, t) => ruido(c, t, "#ece6da", ["#e4ddd0", "#f2ede3", "#ddd5c6"], 900, 2, a), 256, 18),
    pared: (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 64;
      const c = canvas.getContext("2d");
      c.fillStyle = "#f3ead9";
      c.fillRect(0, 0, 128, 64);
      c.fillStyle = "#6f8094";
      for (let i = 0; i < 2; i++) c.fillRect(10 + i * 64, 20, 44, 26);
      c.fillStyle = "#e2d6bf";
      c.fillRect(0, 56, 128, 8);
      const t = new THREE.CanvasTexture(canvas);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1 / 7, 1 / ALTO_PISO);
      return t;
    })(),
    paredParqueo: (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const c = canvas.getContext("2d");
      c.fillStyle = "#d9d6cf";
      c.fillRect(0, 0, 64, 64);
      c.fillStyle = "#4f5359";
      c.fillRect(0, 22, 64, 22);
      const t = new THREE.CanvasTexture(canvas);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1 / 6, 1 / 3);
      return t;
    })(),
  };
}

// ---------- Geometría ----------

// Polígono en metros → forma. La forma vive en XY y se acuesta con rotateX(−π/2), que manda
// y → −z; por eso se usa −z (si no, el campus sale espejado N-S).
const formaDe = (pts) => new THREE.Shape(pts.map((p) => new THREE.Vector2(p.x, -p.z)));

function plano(pts, y) {
  const geo = new THREE.ShapeGeometry(formaDe(pts));
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, y, 0);
  return geo;
}

function bloque(pts, abajo, arriba) {
  const geo = new THREE.ExtrudeGeometry(formaDe(pts), { depth: arriba - abajo, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, abajo, 0);
  return geo;
}

// Pretil de una azotea: un anillo bajo en el borde del techo (el polígono menos una copia
// encogida hacia su centro).
function pretil(pts, grosor, abajo, alto) {
  const c = puntoInterior(pts);
  const caja = cajaDe(pts);
  const k = Math.max(0.5, 1 - (2 * grosor) / Math.min(caja.xmax - caja.xmin, caja.zmax - caja.zmin));
  const forma = formaDe(pts);
  forma.holes.push(new THREE.Path(pts.map((p) => new THREE.Vector2(c.x + (p.x - c.x) * k, -(c.z + (p.z - c.z) * k)))));
  const geo = new THREE.ExtrudeGeometry(forma, { depth: alto, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, abajo, 0);
  return geo;
}

function cinta(pts, ancho, y) {
  const posiciones = [];
  const uvs = [];
  const indices = [];
  let recorrido = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const largo = Math.hypot(b.x - a.x, b.z - a.z) || 1;
    const nx = -(b.z - a.z) / largo;
    const nz = (b.x - a.x) / largo;
    if (i > 0) recorrido += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
    for (const lado of [1, -1]) {
      posiciones.push(pts[i].x + (nx * ancho * lado) / 2, y, pts[i].z + (nz * ancho * lado) / 2);
      uvs.push(recorrido, (lado * ancho) / 2);
    }
    if (i > 0) {
      const k = (i - 1) * 2;
      indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(posiciones, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Líneas blancas de los puestos (cuadritos finos), todas en una sola geometría.
function lineasDePuestos(pts, y) {
  const { puestos } = distribuirPuestos(pts);
  const posiciones = [];
  const indices = [];
  const linea = ([p, q]) => {
    const largo = Math.hypot(q.x - p.x, q.z - p.z) || 1;
    const nx = (-(q.z - p.z) / largo) * 0.09;
    const nz = ((q.x - p.x) / largo) * 0.09;
    const k = posiciones.length / 3;
    posiciones.push(p.x + nx, y, p.z + nz, p.x - nx, y, p.z - nz, q.x + nx, y, q.z + nz, q.x - nx, y, q.z - nz);
    indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
  };
  for (const puesto of puestos) {
    linea(puesto.lineaIzquierda);
    linea(puesto.lineaDerecha);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(posiciones, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function suavizar(pts, paso) {
  const salida = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / paso));
    for (let k = 0; k < n; k++) salida.push({ x: a.x + ((b.x - a.x) * k) / n, z: a.z + ((b.z - a.z) * k) / n });
  }
  salida.push(pts[pts.length - 1]);
  return salida;
}

const VERDES = ["#4f8a3c", "#5f9b45", "#3f7a37", "#6aa84f", "#7cb85a", "#56923f"];
const FLORES = ["#e48fb3", "#f2c94c", "#b18ad6", "#ef8f4a", "#f3eee3", "#e86a6a"];

export default function MaquetaRender({ estacionamientos, ancho = 2400, alto = 1560, onListo }) {
  const contenedor = useRef(null);

  useEffect(() => {
    if (!estacionamientos?.length || !contenedor.current) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(ancho, alto, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xefe9dc);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "auto";
    contenedor.current.appendChild(renderer.domElement);

    const escena = new THREE.Scene();
    const tex = crearTexturas();
    const mat = {
      afuera: new THREE.MeshStandardMaterial({ map: tex.afuera, roughness: 1 }),
      base: new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: 0.9 }),
      grama: new THREE.MeshStandardMaterial({ map: tex.grama, roughness: 1 }),
      gramaJardin: new THREE.MeshStandardMaterial({ map: tex.gramaJardin, roughness: 1 }),
      asfalto: new THREE.MeshStandardMaterial({ map: tex.asfalto, roughness: 0.95, side: THREE.DoubleSide }),
      asfaltoAfuera: new THREE.MeshStandardMaterial({ color: 0x9c9a92, roughness: 1, side: THREE.DoubleSide }),
      estacionamiento: new THREE.MeshStandardMaterial({ map: tex.asfaltoEstacionamiento, roughness: 0.95 }),
      lineas: new THREE.MeshStandardMaterial({ color: 0xf7f5ef, roughness: 0.8, side: THREE.DoubleSide }),
      adoquin: new THREE.MeshStandardMaterial({ map: tex.adoquin, roughness: 1, side: THREE.DoubleSide }),
      teja: new THREE.MeshStandardMaterial({ map: tex.teja, roughness: 0.85 }),
      concreto: new THREE.MeshStandardMaterial({ map: tex.concreto, roughness: 0.9 }),
      pared: new THREE.MeshStandardMaterial({ map: tex.pared, roughness: 0.9 }),
      paredParqueo: new THREE.MeshStandardMaterial({ map: tex.paredParqueo, roughness: 0.95 }),
      caseta: new THREE.MeshStandardMaterial({ color: 0xd9d0bf, roughness: 0.9 }),
      cancha: new THREE.MeshStandardMaterial({ color: 0x4f9a52, roughness: 1 }),
      tierra: new THREE.MeshStandardMaterial({ color: 0xc8a477, roughness: 1 }),
      baloncesto: new THREE.MeshStandardMaterial({ color: 0xb85b43, roughness: 1 }),
      blanco: new THREE.MeshStandardMaterial({ color: 0xf7f5ef, roughness: 0.8, side: THREE.DoubleSide }),
      tronco: new THREE.MeshStandardMaterial({ color: 0x7a5a3c, roughness: 1 }),
      copa: new THREE.MeshStandardMaterial({ roughness: 0.95, flatShading: true }),
    };
    const agregar = (geo, material, { sombra = true, recibe = true } = {}) => {
      const m = new THREE.Mesh(geo, material);
      m.castShadow = sombra;
      m.receiveShadow = recibe;
      escena.add(m);
      return m;
    };

    // ---------- Base de la maqueta y suelo ----------
    const contorno = poligonoAMetros(CONTORNO_CAMPUS);
    const caja = cajaDe(contorno, 140);
    agregar(
      new THREE.PlaneGeometry(caja.xmax - caja.xmin + 1200, caja.zmax - caja.zmin + 1200).rotateX(-Math.PI / 2).translate((caja.xmin + caja.xmax) / 2, -ALTO_BASE, (caja.zmin + caja.zmax) / 2),
      mat.afuera,
      { sombra: false },
    );
    // La base: el campus está montado sobre un bloque con borde claro, como una maqueta real.
    agregar(bloque(contorno, -ALTO_BASE, -0.02), [mat.grama, mat.base]);
    agregar(plano(contorno, 0), mat.grama, { sombra: false });

    // ---------- Vías ----------
    for (const via of VIAS) {
      const estilo = VIA[via.tipo];
      if (!estilo) continue;
      const pts = suavizar(poligonoAMetros(via.puntos), 2);
      // Los caminos peatonales de afuera del campus ensucian la base: solo van los de adentro.
      const medio = pts[Math.floor(pts.length / 2)];
      if (estilo.peatonal && !puntoEnPoligono(medio.x, medio.z, contorno)) continue;
      const y = estilo.afuera ? -ALTO_BASE + 0.05 : estilo.peatonal ? 0.06 : 0.04;
      agregar(cinta(pts, estilo.ancho, y), estilo.afuera ? mat.asfaltoAfuera : estilo.peatonal ? mat.adoquin : mat.asfalto, { sombra: false });
    }

    // ---------- Jardines, plazas y canchas ----------
    const ocupado = []; // polígonos donde no van árboles
    for (const area of AREAS) {
      const pts = poligonoAMetros(area.poligono);
      agregar(plano(pts, area.tipo === "plaza" ? 0.08 : 0.03), area.tipo === "plaza" ? mat.adoquin : mat.gramaJardin, { sombra: false });
      if (area.tipo === "plaza") ocupado.push(pts);
    }
    for (const cancha of CANCHAS) {
      const pts = poligonoAMetros(cancha.poligono);
      const material = cancha.deporte === "baloncesto" ? mat.baloncesto : mat.cancha;
      agregar(plano(pts, 0.09), material, { sombra: false });
      // Borde blanco de la cancha.
      agregar(cinta(suavizar([...pts, pts[0]], 3), 0.35, 0.11), mat.blanco, { sombra: false });
      if (cancha.deporte === "béisbol") {
        const c = puntoInterior(pts);
        const r = 14;
        const rombo = [{ x: c.x, z: c.z + r }, { x: c.x + r, z: c.z }, { x: c.x, z: c.z - r }, { x: c.x - r, z: c.z }];
        agregar(plano(rombo, 0.1), mat.tierra, { sombra: false });
      }
      ocupado.push(pts);
    }

    // ---------- Edificios ----------
    const proyectar = (x, y, z, camara) => {
      const v = new THREE.Vector3(x, y, z).project(camara);
      return [Math.round(((v.x + 1) / 2) * ancho * 10) / 10, Math.round(((1 - v.y) / 2) * alto * 10) / 10];
    };
    const edificios = [];
    for (const e of EDIFICIOS) {
      const pts = poligonoAMetros(e.poligono);
      const pisos = Math.max(2, Math.min(e.pisos ?? 2, 6));
      const altura = pisos * ALTO_PISO;
      const aleatorio = generadorAleatorio(semillaDeTexto(e.id));
      const conTeja = ["biblioteca", "capilla", "auditorio", "comida"].includes(e.uso) || aleatorio() < 0.3;
      agregar(bloque(pts, 0, altura), [conTeja ? mat.teja : mat.concreto, mat.pared]);
      // Pretil y caseta en la azotea de los techos planos: el detalle que hace "maqueta".
      if (!conTeja) {
        agregar(pretil(pts, 0.7, altura, 0.9), [mat.caseta, mat.pared]);
        const c = puntoInterior(pts);
        const t = 2.2 + aleatorio() * 1.6;
        agregar(new THREE.BoxGeometry(t * 1.6, 2.2, t).translate(c.x, altura + 1.1, c.z), mat.caseta);
      }
      ocupado.push(pts);
      const centro = puntoInterior(pts);
      edificios.push({ id: e.id, nombre: e.nombre, uso: e.uso, centro, altura });
    }

    // Garita y estatua de Andrés Bello.
    const garita = gpsAMetros(...GARITA.posicion);
    agregar(new THREE.BoxGeometry(4, 3, 4).translate(garita.x, 1.5, garita.z), [mat.pared, mat.pared, mat.teja, mat.pared, mat.pared, mat.pared]);
    const estatua = PUNTOS_DE_INTERES.find((p) => p.tipo === "estatua");
    if (estatua) {
      const p = gpsAMetros(...estatua.posicion);
      agregar(new THREE.CylinderGeometry(1.4, 1.6, 1.2, 16).translate(p.x, 0.6, p.z), mat.caseta);
      agregar(new THREE.CylinderGeometry(0.45, 0.5, 2.4, 10).translate(p.x, 2.4, p.z), mat.tronco);
    }

    // ---------- Estacionamientos (de la app base) ----------
    const lotes = [];
    for (const est of estacionamientos) {
      if (!est.poligono) continue;
      const pts = poligonoAMetros(est.poligono);
      const techo = est.pisos ? est.pisos * 3 : 0.07;
      if (est.pisos) {
        agregar(bloque(pts, 0, techo), [mat.estacionamiento, mat.paredParqueo]);
      } else {
        agregar(plano(pts, techo), mat.estacionamiento, { sombra: false });
      }
      agregar(lineasDePuestos(pts, techo + 0.03), mat.lineas, { sombra: false });
      ocupado.push(pts);
      lotes.push({ est, pts, techo });
    }

    // ---------- Árboles (decorativos, deterministas) ----------
    const viasInternas = VIAS.filter((v) => VIA[v.tipo]).map((v) => ({ pts: poligonoAMetros(v.puntos), ancho: VIA[v.tipo].ancho }));
    const libreParaArbol = (x, z, dentro) => {
      if (dentro && !puntoEnPoligono(x, z, contorno)) return false;
      if (ocupado.some((p) => puntoEnPoligono(x, z, p))) return false;
      return viasInternas.every((v) => distanciaAPolilinea(x, z, v.pts) > v.ancho / 2 + 2.5);
    };
    const copas = [];
    const aleatorio = generadorAleatorio(2026);
    const cajaCampus = cajaDe(contorno);
    for (let i = 0, puestos = 0; i < 9000 && puestos < 1100; i++) {
      const x = cajaCampus.xmin + aleatorio() * (cajaCampus.xmax - cajaCampus.xmin);
      const z = cajaCampus.zmin + aleatorio() * (cajaCampus.zmax - cajaCampus.zmin);
      if (!libreParaArbol(x, z, true)) continue;
      if (copas.some((c) => Math.hypot(c.x - x, c.z - z) < 4.2)) continue;
      const flor = aleatorio() < 0.14;
      copas.push({ x, z, y: 0, r: 2.1 + aleatorio() * 1.9, color: flor ? FLORES[Math.floor(aleatorio() * FLORES.length)] : VERDES[Math.floor(aleatorio() * VERDES.length)] });
      puestos++;
    }
    // Afuera del campus, árboles más apagados para dar contexto.
    for (let i = 0, puestos = 0; i < 6000 && puestos < 180; i++) {
      const x = caja.xmin + aleatorio() * (caja.xmax - caja.xmin);
      const z = caja.zmin + aleatorio() * (caja.zmax - caja.zmin);
      if (puntoEnPoligono(x, z, contorno) || !libreParaArbol(x, z, false)) continue;
      copas.push({ x, z, y: -ALTO_BASE, r: 2 + aleatorio() * 1.6, color: ["#6f8f55", "#7c9a60", "#88a26a"][Math.floor(aleatorio() * 3)] });
      puestos++;
    }
    const geoCopa = new THREE.IcosahedronGeometry(1, 1);
    const geoTronco = new THREE.CylinderGeometry(0.18, 0.24, 1, 6);
    const instCopas = new THREE.InstancedMesh(geoCopa, mat.copa, copas.length);
    const instTroncos = new THREE.InstancedMesh(geoTronco, mat.tronco, copas.length);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    copas.forEach((c, i) => {
      const altoTronco = c.r * 0.7;
      m.compose(new THREE.Vector3(c.x, c.y + altoTronco + c.r * 0.75, c.z), q, new THREE.Vector3(c.r, c.r * 0.85, c.r));
      instCopas.setMatrixAt(i, m);
      instCopas.setColorAt(i, new THREE.Color(c.color));
      m.compose(new THREE.Vector3(c.x, c.y + altoTronco / 2, c.z), q, new THREE.Vector3(1, altoTronco, 1));
      instTroncos.setMatrixAt(i, m);
    });
    for (const inst of [instCopas, instTroncos]) {
      inst.castShadow = true;
      inst.receiveShadow = true;
      escena.add(inst);
    }

    // ---------- Luz: sol de la mañana desde el sureste, cielo cálido ----------
    escena.add(new THREE.HemisphereLight(0xfff4e2, 0x6d6450, 0.8));
    const centro = { x: (cajaCampus.xmin + cajaCampus.xmax) / 2, z: (cajaCampus.zmin + cajaCampus.zmax) / 2 };
    const sol = new THREE.DirectionalLight(0xfff1dc, 3.1);
    sol.position.set(centro.x + 300, 380, centro.z + 240);
    sol.target.position.set(centro.x, 0, centro.z);
    sol.castShadow = true;
    sol.shadow.mapSize.set(4096, 4096);
    Object.assign(sol.shadow.camera, { left: -680, right: 680, top: 680, bottom: -680, near: 10, far: 1800 });
    sol.shadow.bias = -0.0005;
    sol.shadow.normalBias = 0.6;
    sol.shadow.radius = 4;
    escena.add(sol, sol.target);

    // ---------- Cámara ortográfica casi cenital, mirando al norte ----------
    const angulo = (INCLINACION * Math.PI) / 180;
    const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 4000);
    camara.position.set(centro.x, Math.cos(angulo) * 1500, centro.z + Math.sin(angulo) * 1500);
    camara.lookAt(centro.x, 0, centro.z);
    camara.updateMatrixWorld();
    // Encuadre: el contorno del campus completo, con un margen, en la proporción de la imagen.
    const enVista = contorno.map((p) => new THREE.Vector3(p.x, 0, p.z).applyMatrix4(camara.matrixWorldInverse));
    const xs = enVista.map((v) => v.x);
    const ys = enVista.map((v) => v.y);
    let [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const margen = 14;
    [x0, x1, y0, y1] = [x0 - margen, x1 + margen, y0 - margen, y1 + margen];
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    let medioAncho = (x1 - x0) / 2;
    let medioAlto = (y1 - y0) / 2;
    if (medioAncho / medioAlto > ancho / alto) medioAlto = (medioAncho * alto) / ancho;
    else medioAncho = (medioAlto * ancho) / alto;
    Object.assign(camara, { left: cx - medioAncho, right: cx + medioAncho, top: cy + medioAlto, bottom: cy - medioAlto });
    camara.updateProjectionMatrix();

    renderer.render(escena, camara);

    // ---------- Proyección para la app ----------
    const datos = {
      version: 1,
      generado: new Date().toISOString(),
      ancho,
      alto,
      inclinacion: INCLINACION,
      fuente: "OpenStreetMap (ODbL) y los estacionamientos de la app base",
      estacionamientos: lotes.map(({ est, pts, techo }) => ({
        id: est.id,
        puntos: pts.map((p) => proyectar(p.x, techo, p.z, camara)),
        etiqueta: proyectar(puntoInterior(pts).x, techo, puntoInterior(pts).z, camara),
      })),
      edificios: edificios
        .filter((e) => e.nombre)
        .map((e) => ({ id: e.id, nombre: e.nombre, punto: proyectar(e.centro.x, e.altura, e.centro.z, camara) })),
      garita: proyectar(garita.x, 3, garita.z, camara),
    };
    onListo?.({ imagen: renderer.domElement.toDataURL("image/jpeg", 0.9), datos });

    return () => {
      renderer.dispose();
      renderer.domElement.remove();
      escena.traverse((o) => o.geometry?.dispose());
    };
  }, [estacionamientos, ancho, alto, onListo]);

  return <div ref={contenedor} className="maqueta-render" />;
}
