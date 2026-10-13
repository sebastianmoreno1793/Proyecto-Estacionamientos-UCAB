"use client";

// Maqueta 3D del Campus Montalbán con dimensiones reales (HU 3.2).
// 1 unidad de Three.js = 1 metro. Origen = CENTRO_CAMPUS. Ejes en `lib/mapa3d/geo.js`.
//
// Todo lo que se dibuja sale de coordenadas reales:
//   estacionamientos   data/estacionamientos.js
//   edificios, vías, canchas, garita, relieve   data/campus.js (OpenStreetMap + SRTM)
// Lo único que no tiene coordenadas son los árboles (decorativos, repartidos en las
// áreas verdes) y los puestos pintados (se reparten dentro de cada polígono).

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ESTACIONAMIENTOS } from "@/data/estacionamientos";
import {
  AREAS,
  CANCHAS,
  CONTORNO_CAMPUS,
  EDIFICIOS,
  GARITA,
  PUNTOS_DE_INTERES,
  RELIEVE,
  VIAS,
} from "@/data/campus";
import { CAPACIDAD_DE_EJEMPLO, CAPACIDAD_POR_DEFECTO } from "@/lib/datos_de_ejemplo";
import { etiquetasUnicas, puestosLibres } from "@/lib/estacionamientos/reglas";
import {
  cajaDe,
  crearRelieve,
  crearSuelo,
  direccionPrincipal,
  distanciaAlBorde,
  distanciaAPolilinea,
  distribuirPuestos,
  generadorAleatorio,
  gpsAMetros,
  mezclar,
  poligonoAMetros,
  poligonosSeTocan,
  puntoEnPoligono,
  puntoInterior,
  semillaDeTexto,
} from "@/lib/mapa3d/geo";
import { crearGrafo, nodoMasCercano, rutaDesdeGarita, rutaHaciaGarita } from "@/lib/mapa3d/rutas";

// Reglas de color del semáforo del proyecto:
// Verde < 50%, Amarillo 50% a < 80%, Naranja 80% a < 95%, Rojo ≥ 95%
function obtenerColorSemaforo(porcentaje) {
  if (porcentaje < 50) return 0x22c55e; // Verde
  if (porcentaje < 80) return 0xeab308; // Amarillo
  if (porcentaje < 95) return 0xf97316; // Naranja
  return 0xef4444; // Rojo
}

// Genera una textura de lona/canvas 2D para colocar texto nítido en el mundo 3D
function crearTexturaCartel(nombre, libres, porcentaje) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Fondo
  ctx.fillStyle = "#1e293b";
  ctx.roundRect ? ctx.roundRect(0, 0, 512, 256, 24) : ctx.fillRect(0, 0, 512, 256);
  ctx.fill();

  // Borde según el semáforo
  let colorHex = "#22c55e";
  if (porcentaje >= 95) colorHex = "#ef4444";
  else if (porcentaje >= 80) colorHex = "#f97316";
  else if (porcentaje >= 50) colorHex = "#eab308";

  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 12;
  ctx.stroke();

  // Título
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(nombre, 256, 75);

  // Puestos libres
  ctx.fillStyle = colorHex;
  ctx.font = "bold 68px sans-serif";
  ctx.fillText(`${libres} libres`, 256, 160);

  // Porcentaje
  ctx.fillStyle = "#94a3b8";
  ctx.font = "32px sans-serif";
  ctx.fillText(`${porcentaje}% ocupación`, 256, 215);

  const textura = new THREE.CanvasTexture(canvas);
  textura.needsUpdate = true;
  return textura;
}

// ---------- Medidas y colores de la maqueta ----------

const ALTO_PISO = 3.5; // m por piso en los edificios
const ALTO_PISO_SAMBILITO = 3.2;
const ESPESOR_LOSA = 0.3; // losa de los estacionamientos sobre el suelo
const ALTO_TOTEM = 12;
const ESCALA_CARRO = 1.7; // el carro del modelo mide 2,6 m; uno real, ~4,4 m
const CANTIDAD_ARBOLES = 60;
const MAX_CARROS_EN_MOVIMIENTO = 8;

const VIA = {
  principal: { ancho: 7, color: 0x272f3d, elevacion: 0.16 },
  acceso: { ancho: 5.5, color: 0x272f3d, elevacion: 0.16 },
  interna: { ancho: 4.5, color: 0x2b3340, elevacion: 0.15 },
  avenida: { ancho: 10, color: 0x3a3f47, elevacion: 0.12 },
  ramal: { ancho: 6, color: 0x3a3f47, elevacion: 0.12 },
  autopista: { ancho: 11, color: 0x30343b, elevacion: 0.12 },
  peatonal: { ancho: 2.2, color: 0xc9bfa5, elevacion: 0.1 },
};

const COLOR_EDIFICIO = {
  aulas: 0xe7dcc6,
  administrativo: 0xd6d3cd,
  biblioteca: 0xc9a27e,
  laboratorios: 0xc7d2da,
  capilla: 0xf3eee4,
  auditorio: 0xb5694a,
  comida: 0xe8b46a,
  otro: 0xb9b3a7,
};

const COLOR_CANCHA = { fútbol: 0x3f8f3f, béisbol: 0x4a9440, baloncesto: 0x3b6ea5 };
const COLORES_CARROS = [0xd97706, 0xdc2626, 0x0284c7, 0x475569, 0xf8fafc, 0x16a34a, 0x7c3aed, 0x1f2937, 0xa3a3a3];

const limitar = (v, min, max) => Math.min(max, Math.max(min, v));

// Etiqueta de texto (nombres de edificios, garita, puntos de interés).
function crearTexturaEtiqueta(texto, { color = "#f8fafc", fondo = "rgba(15, 23, 42, 0.82)", borde = null } = {}) {
  const alto = 64;
  const medidor = document.createElement("canvas").getContext("2d");
  medidor.font = "bold 34px sans-serif";
  const ancho = Math.ceil(medidor.measureText(texto).width) + 36;
  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = fondo;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(2, 2, ancho - 4, alto - 4, 14) : ctx.rect(2, 2, ancho - 4, alto - 4);
  ctx.fill();
  if (borde) {
    ctx.strokeStyle = borde;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.font = "bold 34px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(texto, ancho / 2, alto / 2 + 1);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  return { textura, aspecto: ancho / alto };
}

// Franja de ventanas que se repite en las fachadas (un módulo = 6 m × 1 piso).
function crearTexturaVentanas() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 128, 64);
  ctx.fillStyle = "#5d6b7e";
  for (let i = 0; i < 2; i++) ctx.fillRect(8 + i * 64, 18, 48, 30);
  ctx.fillStyle = "#d9dee5";
  ctx.fillRect(0, 56, 128, 8);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.wrapS = THREE.RepeatWrapping;
  textura.wrapT = THREE.RepeatWrapping;
  textura.repeat.set(1 / 6, 1 / ALTO_PISO);
  textura.offset.set(0, -1 / ALTO_PISO);
  return textura;
}

// El cartel tiene 512 px de ancho: los nombres largos se acortan.
function nombreParaCartel(est, etiqueta) {
  if (est.soloProfesores) return `Prof. ${est.nombre.split("·").pop().trim()}`;
  return etiqueta
    .replace(" (principal)", "")
    .replace(/ \((\w+)\)$/, (_, zona) => ` ${zona[0].toUpperCase()}${zona.slice(1)}`);
}

// Polígono en metros → forma de Three.js. La forma vive en el plano XY y se acuesta con
// rotateX(−π/2), que manda y → −z; por eso se usa −z (si no, el mapa sale espejado N-S).
function formaDe(pts) {
  return new THREE.Shape(pts.map((p) => new THREE.Vector2(p.x, -p.z)));
}

function losa(pts, abajo, arriba) {
  const geo = new THREE.ExtrudeGeometry(formaDe(pts), { depth: arriba - abajo, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, abajo, 0);
  return geo;
}

function geometriaDe({ posiciones, indices, colores }) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(posiciones, 3));
  if (colores) geo.setAttribute("color", new THREE.Float32BufferAttribute(colores, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Suaviza una polilínea (curvas sin ángulos de 90°) y la remuestrea cada `paso` metros.
function suavizar(pts, paso) {
  const limpios = pts.filter((p, i) => i === 0 || Math.hypot(p.x - pts[i - 1].x, p.z - pts[i - 1].z) > 0.4);
  if (limpios.length < 2) return limpios;
  const curva = new THREE.CatmullRomCurve3(
    limpios.map((p) => new THREE.Vector3(p.x, 0, p.z)),
    false,
    "centripetal"
  );
  const n = Math.max(2, Math.ceil(curva.getLength() / paso));
  return curva.getSpacedPoints(n).map((v) => ({ x: v.x, z: v.z }));
}

export default function Mapa3D({ estacionamientos = [], ultimoEvento = null, onDispararEvento = null }) {
  const mountRef = useRef(null);
  const brujulaRef = useRef(null);
  const eventosPendientes = useRef([]);
  const estacionamientosRef = useRef(estacionamientos);
  const seguirRef = useRef(true);
  const [seguir, setSeguir] = useState(true);
  const [infoOverlay, setInfoOverlay] = useState("Garita lista para recibir vehículos.");

  // Referencias mutables para la escena Three.js
  const refsScene = useRef({ actualizarOcupacion: null });

  estacionamientosRef.current = estacionamientos;
  useEffect(() => {
    seguirRef.current = seguir;
  }, [seguir]);

  // Reaccionar cuando entra un nuevo evento externo (Postman o botón)
  useEffect(() => {
    if (!ultimoEvento) return;

    const { tipo, estacionamientoId, placa, nombre } = ultimoEvento.evento || ultimoEvento;
    eventosPendientes.current.push({
      tipo: tipo || "ENTRADA",
      estacionamientoId: estacionamientoId || "est-playa",
      placa: placa || "UCAB-01",
      ocupacion: ultimoEvento.estacionamiento ?? null,
    });

    setInfoOverlay(
      `${tipo === "ENTRADA" ? "🚗 Entrada" : "🚙 Salida"}: ${placa || "Vehículo"} → ${
        nombre || estacionamientoId
      }`
    );
  }, [ultimoEvento]);

  // Si la página pasa la ocupación de los estacionamientos, los carteles la siguen.
  useEffect(() => {
    const actualizar = refsScene.current.actualizarOcupacion;
    if (!actualizar) return;
    for (const e of estacionamientos) {
      if (e?.id && Number.isFinite(e.capacidad)) actualizar(e.id, e, { carros: true });
    }
  }, [estacionamientos]);

  useEffect(() => {
    const contenedor = mountRef.current;
    if (!contenedor) return;

    // 1. Escena, Cámara y Renderer
    const escena = new THREE.Scene();
    escena.background = new THREE.Color(0x0b1329);
    escena.fog = new THREE.Fog(0x0b1329, 1500, 3400);

    const ancho = contenedor.clientWidth;
    const alto = contenedor.clientHeight;

    const camara = new THREE.PerspectiveCamera(45, ancho / alto, 1, 6000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(ancho, alto);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    contenedor.appendChild(renderer.domElement);

    // Controles de órbita
    const controls = new OrbitControls(camara, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.15; // Para no pasar por debajo del suelo
    controls.minDistance = 12;
    controls.maxDistance = 1900;
    controls.screenSpacePanning = false;

    // 2. Luces
    escena.add(new THREE.AmbientLight(0xffffff, 0.75));

    const luzSol = new THREE.DirectionalLight(0xfff4e0, 1.7);
    luzSol.position.set(380, 650, -260);
    luzSol.castShadow = true;
    luzSol.shadow.mapSize.width = 2048;
    luzSol.shadow.mapSize.height = 2048;
    luzSol.shadow.camera.near = 100;
    luzSol.shadow.camera.far = 1800;
    luzSol.shadow.camera.left = -560;
    luzSol.shadow.camera.right = 560;
    luzSol.shadow.camera.top = 480;
    luzSol.shadow.camera.bottom = -480;
    luzSol.shadow.bias = -0.0004;
    luzSol.shadow.normalBias = 0.6;
    escena.add(luzSol);
    escena.add(luzSol.target);

    // 3. Polígonos reales en metros
    const contorno = poligonoAMetros(CONTORNO_CAMPUS);
    const etiquetas = etiquetasUnicas(ESTACIONAMIENTOS);
    const zonasDatos = ESTACIONAMIENTOS.map((est, i) => ({
      est,
      etiqueta: etiquetas[i],
      pts: poligonoAMetros(est.poligono),
    }));
    const edificios = EDIFICIOS.map((e) => ({ ...e, pts: poligonoAMetros(e.poligono) }));
    const canchas = CANCHAS.map((c) => ({ ...c, pts: poligonoAMetros(c.poligono) }));
    const areas = AREAS.map((a) => ({ ...a, pts: poligonoAMetros(a.poligono) }));
    const vias = VIAS.map((v) => ({ ...v, pts: v.puntos.map(([lat, lon]) => gpsAMetros(lat, lon)) }));

    // 4. Relieve real (SRTM) con terrazas planas, como se construye un campus en ladera
    const relieve = crearRelieve(RELIEVE);
    const muestrasDeAltura = (pts) => {
      const muestras = pts.map((p) => relieve.alturaBase(p.x, p.z));
      const caja = cajaDe(pts);
      for (let x = caja.xmin; x <= caja.xmax; x += 6) {
        for (let z = caja.zmin; z <= caja.zmax; z += 6) {
          if (puntoEnPoligono(x, z, pts)) muestras.push(relieve.alturaBase(x, z));
        }
      }
      return muestras;
    };
    const promedio = (lista) => lista.reduce((s, v) => s + v, 0) / lista.length;

    // Los estacionamientos que se tocan (Sambilito y Presambilito, p. ej.) comparten terraza.
    const grupo = zonasDatos.map((_, i) => i);
    const raiz = (i) => (grupo[i] === i ? i : (grupo[i] = raiz(grupo[i])));
    for (let i = 0; i < zonasDatos.length; i++) {
      for (let j = i + 1; j < zonasDatos.length; j++) {
        if (poligonosSeTocan(zonasDatos[i].pts, zonasDatos[j].pts)) grupo[raiz(i)] = raiz(j);
      }
    }
    const nivelDeGrupo = new Map();
    zonasDatos.forEach((z, i) => {
      const r = raiz(i);
      nivelDeGrupo.set(r, [...(nivelDeGrupo.get(r) ?? []), ...muestrasDeAltura(z.pts)]);
    });
    // Un desfase mínimo por zona evita que dos losas superpuestas parpadeen.
    zonasDatos.forEach((z, i) => {
      z.nivel = promedio(nivelDeGrupo.get(raiz(i))) + i * 0.02;
    });
    canchas.forEach((c) => (c.nivel = promedio(muestrasDeAltura(c.pts))));
    const plazas = areas.filter((a) => a.tipo === "plaza");
    plazas.forEach((a) => (a.nivel = promedio(muestrasDeAltura(a.pts))));

    const suelo = crearSuelo({
      alturaBase: relieve.alturaBase,
      extension: relieve.extension,
      paso: 5,
      terrazas: [...canchas, ...plazas, ...zonasDatos.map((z) => ({ pts: z.pts, nivel: z.nivel }))],
    });
    const { alturaEn } = suelo;

    // 5. Terreno: césped dentro del campus, ciudad y cerros alrededor
    {
      const { nx, nz, paso, x0, z0, alturas } = suelo;
      const jardines = areas.filter((a) => a.tipo === "jardin");
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
          if (puntoEnPoligono(x, z, contorno)) {
            color.copy(jardines.some((j) => puntoEnPoligono(x, z, j.pts)) ? cJardin : cCampus);
          } else {
            color.copy(cCiudad).lerp(cCerro, limitar((h - 25) / 60, 0, 1));
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
        geometriaDe({ posiciones, indices, colores }),
        new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 })
      );
      terreno.receiveShadow = true;
      escena.add(terreno);

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
      escena.add(
        new THREE.Mesh(
          geometriaDe(costados),
          new THREE.MeshStandardMaterial({ color: 0x3b2f24, roughness: 1, side: THREE.DoubleSide })
        )
      );
    }

    // Cerca del campus (contorno de OSM)
    {
      const puntos = [];
      const cerrado = [...contorno, contorno[0]];
      for (let i = 1; i < cerrado.length; i++) {
        const a = cerrado[i - 1];
        const b = cerrado[i];
        const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 4));
        for (let k = 0; k < n; k++) {
          const x = a.x + ((b.x - a.x) * k) / n;
          const z = a.z + ((b.z - a.z) * k) / n;
          puntos.push(new THREE.Vector3(x, alturaEn(x, z) + 1.2, z));
        }
      }
      puntos.push(puntos[0].clone());
      escena.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(puntos),
          new THREE.LineBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.55 })
        )
      );
    }

    // 6. Vías: cintas de asfalto pegadas al relieve, con las curvas del trazado de OSM
    const cintas = new Map();
    function agregarCinta(clave, color, pts, anchoCinta, elevacion) {
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
          destino.posiciones.push(x, alturaEn(x, z) + elevacion, z);
        }
        if (i > 0) {
          const k = base + (i - 1) * 2;
          destino.indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
        }
      }
    }

    for (const via of vias) {
      const estilo = VIA[via.tipo];
      if (!estilo) continue;
      const trazado = suavizar(via.pts, 2);
      agregarCinta(via.tipo, estilo.color, trazado, estilo.ancho, estilo.elevacion);
      via.trazado = trazado;
    }
    // Líneas viales amarillas (discontinuas) en el anillo principal y los accesos
    for (const via of vias.filter((v) => v.tipo === "principal" || v.tipo === "acceso")) {
      const pts = suavizar(via.pts, 1.5);
      for (let i = 0; i + 2 < pts.length; i += 4) {
        agregarCinta("linea", 0xfacc15, pts.slice(i, i + 3), 0.25, VIA.principal.elevacion + 0.04);
      }
    }
    for (const [, { color, posiciones, indices }] of cintas) {
      const malla = new THREE.Mesh(
        geometriaDe({ posiciones, indices }),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.85,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2,
        })
      );
      malla.receiveShadow = true;
      escena.add(malla);
    }

    // 7. Canchas y plazas (terrazas planas)
    for (const c of canchas) {
      const geo = new THREE.ShapeGeometry(formaDe(c.pts));
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, c.nivel + 0.1, 0);
      const cancha = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: COLOR_CANCHA[c.deporte] ?? 0x3f8f3f, roughness: 0.9 })
      );
      cancha.receiveShadow = true;
      escena.add(cancha);
      const borde = c.pts.map((p) => new THREE.Vector3(p.x, c.nivel + 0.15, p.z));
      escena.add(
        new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(borde),
          new THREE.LineBasicMaterial({ color: 0xffffff })
        )
      );
    }
    for (const plaza of plazas) {
      const piso = new THREE.Mesh(
        losa(plaza.pts, plaza.nivel - 1, plaza.nivel + 0.12),
        new THREE.MeshStandardMaterial({ color: 0xbfb8a8, roughness: 0.9 })
      );
      piso.receiveShadow = true;
      escena.add(piso);
    }

    // Lista de etiquetas que cambian de tamaño con la distancia para leerse siempre.
    const etiquetasEscalables = [];
    function crearEtiqueta(texto, posicion, { factor = 0.018, min = 3.5, max = 16, hasta = 900, ...estilo } = {}) {
      const { textura, aspecto } = crearTexturaEtiqueta(texto, estilo);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: textura, transparent: true }));
      sprite.center.set(0.5, 0);
      sprite.position.copy(posicion);
      escena.add(sprite);
      etiquetasEscalables.push({ sprite, aspecto, factor, min, max, hasta });
      return sprite;
    }

    // 8. Edificios de referencia (huellas reales de OSM)
    const texturaVentanas = crearTexturaVentanas();
    const materialTecho = new THREE.MeshStandardMaterial({ color: 0x8f969e, roughness: 0.9 });
    for (const e of edificios) {
      const pts = e.pts;
      const alturasSuelo = pts.map((p) => alturaEn(p.x, p.z));
      const base = Math.min(...alturasSuelo) - 0.5;
      const esCapilla = e.uso === "capilla";
      const tope = promedio(alturasSuelo) + (esCapilla ? 8 : e.pisos * ALTO_PISO);
      const paredes = new THREE.MeshStandardMaterial({
        color: COLOR_EDIFICIO[e.uso] ?? COLOR_EDIFICIO.otro,
        map: esCapilla ? null : texturaVentanas,
        roughness: 0.8,
      });
      const edificio = new THREE.Mesh(losa(pts, base, tope), [materialTecho, paredes]);
      edificio.castShadow = true;
      edificio.receiveShadow = true;
      escena.add(edificio);

      if (esCapilla) {
        // Techo a dos aguas y cruz, orientados con el lado largo de la capilla
        const angulo = direccionPrincipal(pts);
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
        escena.add(techo);

        const matCruz = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
        const cruz = new THREE.Group();
        const palo = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4, 0.35), matCruz);
        const brazoCruz = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 2), matCruz);
        brazoCruz.position.y = 0.8;
        cruz.add(palo, brazoCruz);
        const extremo = largoU / 2 - 1.5;
        cruz.position.set(centro.x + u.x * extremo, tope + anchoV * 0.45 + 1.6, centro.z + u.z * extremo);
        cruz.rotation.y = Math.atan2(u.x, u.z);
        escena.add(cruz);
      }

      if (e.nombre) {
        const c = puntoInterior(pts);
        crearEtiqueta(e.nombre, new THREE.Vector3(c.x, tope + (esCapilla ? 9 : 2), c.z), {
          factor: 0.016,
          max: 13,
          hasta: 1100,
        });
      }
    }

    // Puntos de interés de OSM (la estatua se modela; el resto, solo etiqueta)
    for (const p of PUNTOS_DE_INTERES) {
      const { x, z } = gpsAMetros(...p.posicion);
      const y = alturaEn(x, z);
      if (p.tipo === "estatua") {
        const bronce = new THREE.MeshStandardMaterial({ color: 0x8c6a3f, metalness: 0.4, roughness: 0.5 });
        const pedestal = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2.2, 2),
          new THREE.MeshStandardMaterial({ color: 0xd6d3d1 })
        );
        pedestal.position.set(x, y + 1.1, z);
        const figura = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 2.2, 10), bronce);
        figura.position.set(x, y + 3.3, z);
        const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), bronce);
        cabeza.position.set(x, y + 4.7, z);
        for (const m of [pedestal, figura, cabeza]) {
          m.castShadow = true;
          escena.add(m);
        }
      }
      crearEtiqueta(p.nombre, new THREE.Vector3(x, y + 6, z), {
        factor: 0.012,
        min: 2.5,
        max: 6,
        hasta: 380,
        color: "#fde68a",
      });
    }

    // Nombres de las avenidas de alrededor, para orientarse
    for (const nombre of ["Avenida Teherán", "Autopista Gran Cacique Guaicaipuro"]) {
      const tramo = vias
        .filter((v) => v.nombre === nombre && v.trazado?.length > 4)
        .sort((a, b) => b.trazado.length - a.trazado.length)[0];
      if (!tramo) continue;
      const m = tramo.trazado[Math.floor(tramo.trazado.length / 2)];
      crearEtiqueta(nombre, new THREE.Vector3(m.x, alturaEn(m.x, m.z) + 4, m.z), {
        factor: 0.016,
        max: 18,
        hasta: 2000,
        color: "#cbd5e1",
        fondo: "rgba(30, 41, 59, 0.75)",
      });
    }

    // 9. Garita de Entrada UCAB (talanquera real de OSM, Av. Teherán)
    const llegada = GARITA.llegada.map(([lat, lon]) => gpsAMetros(lat, lon));
    const salida = GARITA.salida.map(([lat, lon]) => gpsAMetros(lat, lon));
    const puntoGarita = gpsAMetros(...GARITA.posicion);
    const grupoGarita = new THREE.Group();
    {
      const previo = llegada.at(-2);
      grupoGarita.position.set(puntoGarita.x, alturaEn(puntoGarita.x, puntoGarita.z) + 0.16, puntoGarita.z);
      // El eje z local de la garita sigue la vía de entrada; la talanquera la cruza.
      grupoGarita.rotation.y = Math.atan2(puntoGarita.x - previo.x, puntoGarita.z - previo.z);
    }
    const brazoGarita = new THREE.Group();
    let luzSemaforoGarita;
    {
      // Caseta de vigilancia
      const caseta = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2.8, 2.5),
        new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 })
      );
      caseta.position.set(4, 1.4, 0);
      caseta.castShadow = true;
      grupoGarita.add(caseta);

      // Ventana caseta
      const ventana = new THREE.Mesh(
        new THREE.PlaneGeometry(1.4, 1),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 })
      );
      ventana.position.set(2.98, 1.6, 0);
      ventana.rotation.y = -Math.PI / 2;
      grupoGarita.add(ventana);

      // Techo de la caseta
      const techoCaseta = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.25, 3.1),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a })
      );
      techoCaseta.position.set(4, 2.92, 0);
      grupoGarita.add(techoCaseta);

      // Poste de la barrera
      const posteBarrera = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 1.2, 0.4),
        new THREE.MeshStandardMaterial({ color: 0xf97316 })
      );
      posteBarrera.position.set(2.2, 0.6, 0);
      posteBarrera.castShadow = true;
      grupoGarita.add(posteBarrera);

      // Semáforo de la garita
      const posteSemaforo = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
      );
      posteSemaforo.position.set(2.2, 1, 1.8);
      grupoGarita.add(posteSemaforo);

      const cabezaSemaforo = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.8, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      cabezaSemaforo.position.set(2.2, 2.2, 1.8);
      grupoGarita.add(cabezaSemaforo);

      luzSemaforoGarita = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xef4444 }) // Rojo por defecto
      );
      luzSemaforoGarita.position.set(2.04, 2.2, 1.8);
      grupoGarita.add(luzSemaforoGarita);

      // Brazo móvil de la talanquera
      brazoGarita.position.set(2.2, 1.1, 0);
      const brazo = new THREE.Mesh(
        new THREE.BoxGeometry(4.4, 0.14, 0.14),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      brazo.position.set(-2.2, 0, 0); // pivote en el extremo
      brazo.castShadow = true;
      brazoGarita.add(brazo);

      // Franjas rojas de la talanquera
      for (let f = -3.8; f <= -0.5; f += 0.8) {
        const franja = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.15, 0.15),
          new THREE.MeshBasicMaterial({ color: 0xef4444 })
        );
        franja.position.set(f, 0, 0);
        brazoGarita.add(franja);
      }
      grupoGarita.add(brazoGarita);
      escena.add(grupoGarita);
    }
    crearEtiqueta(GARITA.nombre, new THREE.Vector3(puntoGarita.x, grupoGarita.position.y + 6, puntoGarita.z), {
      factor: 0.018,
      max: 16,
      hasta: 2000,
      color: "#fde68a",
      borde: "#f97316",
    });

    // 10. Función creadora de un carro estilizado
    function crearCarro3D(color = 0x2563eb) {
      const carro = new THREE.Group();

      // Chasis inferior
      const chasis = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.6, 1.4),
        new THREE.MeshStandardMaterial({ color, roughness: 0.3 })
      );
      chasis.position.y = 0.45;
      chasis.castShadow = true;
      carro.add(chasis);

      // Cabina superior
      const cabina = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.55, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 })
      );
      cabina.position.set(-0.2, 0.9, 0);
      cabina.castShadow = true;
      carro.add(cabina);

      // Parabrisas
      const parabrisas = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 0.4),
        new THREE.MeshBasicMaterial({ color: 0x93c5fd })
      );
      parabrisas.position.set(0.56, 0.88, 0);
      parabrisas.rotation.y = Math.PI / 2;
      carro.add(parabrisas);

      // Luces delanteras
      const faroDer = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.15, 0.25),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      faroDer.position.set(1.3, 0.5, 0.45);
      carro.add(faroDer);

      const faroIzq = faroDer.clone();
      faroIzq.position.z = -0.45;
      carro.add(faroIzq);

      // 4 Ruedas
      const geoRueda = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 16);
      const matRueda = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });

      const ruedaPos = [
        [0.8, 0.28, 0.72],
        [-0.8, 0.28, 0.72],
        [0.8, 0.28, -0.72],
        [-0.8, 0.28, -0.72],
      ];

      ruedaPos.forEach(([x, y, z]) => {
        const rueda = new THREE.Mesh(geoRueda, matRueda);
        rueda.rotation.x = Math.PI / 2;
        rueda.position.set(x, y, z);
        rueda.castShadow = true;
        carro.add(rueda);
      });

      // Marcador flotante para ubicar el carro desde lejos
      const marcador = new THREE.Mesh(
        new THREE.ConeGeometry(0.7, 1.6, 4),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.9 })
      );
      marcador.rotation.x = Math.PI;
      marcador.position.y = 4;
      carro.add(marcador);
      carro.userData.marcador = marcador;

      carro.scale.setScalar(ESCALA_CARRO);
      carro.rotation.order = "YXZ";
      return carro;
    }

    // 11. Los 14 estacionamientos con su forma real
    const geoCarroceria = new THREE.BoxGeometry(4.3, 1.0, 1.8).translate(0, 0.75, 0);
    const geoCabinaFija = new THREE.BoxGeometry(2.2, 0.6, 1.6).translate(-0.2, 1.55, 0);
    const matCabinaFija = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });
    const matColumna = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.8 });
    const matConcreto = new THREE.MeshStandardMaterial({ color: 0x8b9099, roughness: 0.85 });
    const geoPoste = new THREE.CylinderGeometry(0.25, 0.3, ALTO_TOTEM, 8).translate(0, ALTO_TOTEM / 2, 0);
    const matPoste = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const ocupacionInicial = (id) => {
      const desdeProps = estacionamientosRef.current.find((e) => e?.id === id);
      if (desdeProps && Number.isFinite(desdeProps.capacidad)) return desdeProps;
      return CAPACIDAD_DE_EJEMPLO[id] ?? CAPACIDAD_POR_DEFECTO;
    };

    const zonasEnEscena = {};
    for (const z of zonasDatos) {
      const { est, pts } = z;
      const tope = z.nivel + ESPESOR_LOSA;
      const pisos = est.pisos ?? 1;
      const esProfesores = Boolean(est.soloProfesores);

      // Plataforma de asfalto con la forma exacta del polígono
      const plataforma = new THREE.Mesh(
        losa(pts, z.nivel - 2, tope),
        new THREE.MeshStandardMaterial({ color: esProfesores ? 0x1e3a5f : 0x1f2937, roughness: 0.85 })
      );
      plataforma.receiveShadow = true;
      escena.add(plataforma);

      // Borde: violeta en los de profesores
      escena.add(
        new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, tope + 0.05, p.z))),
          new THREE.LineBasicMaterial({ color: esProfesores ? 0xa78bfa : 0xcbd5e1 })
        )
      );

      // Puestos (en cada piso si es un edificio)
      const reparto = distribuirPuestos(pts);
      const alturaDePiso = (k) => tope + k * ALTO_PISO_SAMBILITO;
      const puestos = [];
      for (let k = 0; k < pisos; k++) {
        for (const p of reparto.puestos) puestos.push({ ...p, piso: k, y: alturaDePiso(k) });
      }
      const lineas = { posiciones: [], indices: [] };
      for (const p of puestos) {
        for (const [a, b] of [p.lineaIzquierda, p.lineaDerecha]) {
          const dx = b.x - a.x;
          const dz = b.z - a.z;
          const largo = Math.hypot(dx, dz) || 1;
          const nx = (-dz / largo) * 0.07;
          const nz = (dx / largo) * 0.07;
          const k0 = lineas.posiciones.length / 3;
          const y = p.y + 0.03;
          lineas.posiciones.push(a.x + nx, y, a.z + nz, a.x - nx, y, a.z - nz, b.x + nx, y, b.z + nz, b.x - nx, y, b.z - nz);
          lineas.indices.push(k0, k0 + 2, k0 + 1, k0 + 1, k0 + 2, k0 + 3);
        }
      }
      if (lineas.indices.length > 0) {
        escena.add(
          new THREE.Mesh(
            geometriaDe(lineas),
            new THREE.MeshBasicMaterial({ color: esProfesores ? 0xc4b5fd : 0xe5e7eb, side: THREE.DoubleSide })
          )
        );
      }

      // Sambilito: edificio de estacionamiento con losas, columnas y antepechos
      if (pisos > 1) {
        for (let k = 1; k <= pisos; k++) {
          const piso = new THREE.Mesh(losa(pts, alturaDePiso(k) - ESPESOR_LOSA, alturaDePiso(k)), matConcreto);
          piso.castShadow = true;
          piso.receiveShadow = true;
          escena.add(piso);
          for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            const a = pts[j];
            const b = pts[i];
            const largo = Math.hypot(b.x - a.x, b.z - a.z);
            const antepecho = new THREE.Mesh(new THREE.BoxGeometry(largo, 1, 0.25), matConcreto);
            antepecho.position.set((a.x + b.x) / 2, alturaDePiso(k) + 0.5, (a.z + b.z) / 2);
            antepecho.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
            antepecho.castShadow = true;
            escena.add(antepecho);
          }
        }
        const { u, v } = reparto;
        const us = pts.map((p) => p.x * u.x + p.z * u.z);
        const vs = pts.map((p) => p.x * v.x + p.z * v.z);
        const columnas = [];
        for (let cu = Math.min(...us) + 1.5; cu < Math.max(...us) - 1; cu += 7.5) {
          for (let cv = Math.min(...vs) + 1.5; cv < Math.max(...vs) - 1; cv += 7.5) {
            const x = cu * u.x + cv * v.x;
            const zc = cu * u.z + cv * v.z;
            if (puntoEnPoligono(x, zc, pts) && distanciaAlBorde(x, zc, pts) > 0.8) columnas.push({ x, z: zc });
          }
        }
        const altoColumna = ALTO_PISO_SAMBILITO - ESPESOR_LOSA;
        const mallaColumnas = new THREE.InstancedMesh(
          new THREE.BoxGeometry(0.6, altoColumna, 0.6),
          matColumna,
          columnas.length * pisos
        );
        const m = new THREE.Matrix4();
        let n = 0;
        for (let k = 0; k < pisos; k++) {
          for (const c of columnas) mallaColumnas.setMatrixAt(n++, m.makeTranslation(c.x, alturaDePiso(k) + altoColumna / 2, c.z));
        }
        mallaColumnas.castShadow = true;
        escena.add(mallaColumnas);
      }

      // Carros estacionados (InstancedMesh): tantos como diga la ocupación
      const orden = mezclar(
        puestos.map((_, i) => i),
        generadorAleatorio(semillaDeTexto(est.id))
      );
      const carrocerias = new THREE.InstancedMesh(
        geoCarroceria,
        new THREE.MeshStandardMaterial({ roughness: 0.4 }),
        Math.max(1, puestos.length)
      );
      const cabinas = new THREE.InstancedMesh(geoCabinaFija, matCabinaFija, Math.max(1, puestos.length));
      const giro = Math.atan2(-reparto.v.z, reparto.v.x); // trompa hacia el fondo del puesto
      const matriz = new THREE.Matrix4();
      const cuaternion = new THREE.Quaternion();
      const unidad = new THREE.Vector3(1, 1, 1);
      const colorCarro = new THREE.Color();
      const aleatorioColor = generadorAleatorio(semillaDeTexto(`${est.id}-color`));
      orden.forEach((indicePuesto, i) => {
        const p = puestos[indicePuesto];
        cuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), giro + (p.haciaPasillo > 0 ? Math.PI : 0));
        matriz.compose(new THREE.Vector3(p.x, p.y, p.z), cuaternion, unidad);
        carrocerias.setMatrixAt(i, matriz);
        cabinas.setMatrixAt(i, matriz);
        carrocerias.setColorAt(
          i,
          colorCarro.setHex(COLORES_CARROS[Math.floor(aleatorioColor() * COLORES_CARROS.length)])
        );
      });
      carrocerias.count = 0;
      cabinas.count = 0;
      escena.add(carrocerias, cabinas);

      // Tótem con cartel del semáforo (sobre el techo si es edificio)
      const interior = puntoInterior(pts);
      const baseTotem = pisos > 1 ? alturaDePiso(pisos) : tope;
      const poste = new THREE.Mesh(geoPoste, matPoste);
      poste.position.set(interior.x, baseTotem, interior.z);
      escena.add(poste);

      const baliza = new THREE.Mesh(
        new THREE.SphereGeometry(1.3, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.8 })
      );
      baliza.position.set(interior.x, baseTotem + ALTO_TOTEM + 1.3, interior.z);
      escena.add(baliza);

      const cartel = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true }));
      cartel.center.set(0.5, 0);
      escena.add(cartel);

      let distintivo = null;
      if (esProfesores) {
        const { textura, aspecto } = crearTexturaEtiqueta("SOLO PROFESORES", {
          color: "#ede9fe",
          fondo: "rgba(76, 29, 149, 0.92)",
          borde: "#a78bfa",
        });
        distintivo = new THREE.Sprite(new THREE.SpriteMaterial({ map: textura, transparent: true }));
        distintivo.center.set(0.5, 0);
        distintivo.userData.aspecto = aspecto;
        escena.add(distintivo);
      }

      const zona = {
        est,
        pts,
        nombreCartel: nombreParaCartel(est, z.etiqueta),
        puestos,
        orden,
        reparto,
        carrocerias,
        cabinas,
        cartel,
        baliza,
        distintivo,
        baseCartel: baseTotem + ALTO_TOTEM + 2.8,
        visibles: 0,
        reservados: 0,
        ocupacion: null,
      };

      zona.mostrarCarros = (cantidad) => {
        zona.visibles = limitar(Math.round(cantidad), 0, puestos.length);
        carrocerias.count = zona.visibles;
        cabinas.count = zona.visibles;
      };

      zona.fijarOcupacion = ({ capacidad, ocupados }, { carros = true } = {}) => {
        zona.ocupacion = { capacidad, ocupados };
        const libres = puestosLibres({ capacidad, ocupados });
        const porcentaje = capacidad > 0 ? Math.round((ocupados / capacidad) * 100) : 100;
        cartel.material.map?.dispose();
        const textura = crearTexturaCartel(zona.nombreCartel, libres, porcentaje);
        textura.colorSpace = THREE.SRGBColorSpace;
        cartel.material.map = textura;
        cartel.material.needsUpdate = true;
        const colorLuz = obtenerColorSemaforo(porcentaje);
        baliza.material.color.setHex(colorLuz);
        baliza.material.emissive.setHex(colorLuz);
        if (carros && capacidad > 0) zona.mostrarCarros((puestos.length * Math.min(ocupados, capacidad)) / capacidad);
      };

      zona.fijarOcupacion(ocupacionInicial(est.id));
      zonasEnEscena[est.id] = zona;
    }

    refsScene.current.actualizarOcupacion = (id, ocupacion, opciones) => {
      zonasEnEscena[id]?.fijarOcupacion(ocupacion, opciones);
    };

    // 12. Vegetación: árboles en las áreas verdes (posiciones decorativas)
    {
      const aleatorio = generadorAleatorio(20261013);
      const caja = cajaDe(contorno);
      const obstaculos = [
        ...edificios.map((e) => ({ pts: e.pts, margen: 5 })),
        ...zonasDatos.map((z) => ({ pts: z.pts, margen: 3 })),
        ...canchas.map((c) => ({ pts: c.pts, margen: 2 })),
        ...plazas.map((p) => ({ pts: p.pts, margen: 2 })),
      ].map((o) => ({ ...o, caja: cajaDe(o.pts, o.margen) }));
      const caminos = vias
        .filter((v) => v.trazado && v.pts.some((p) => puntoEnPoligono(p.x, p.z, contorno)))
        .map((v) => ({ pts: v.trazado, margen: VIA[v.tipo].ancho / 2 + 2.5, caja: cajaDe(v.trazado, 8) }));
      const dentroDeCaja = (c, x, z) => x >= c.xmin && x <= c.xmax && z >= c.zmin && z <= c.zmax;

      const arboles = [];
      for (let intento = 0; arboles.length < CANTIDAD_ARBOLES && intento < 40000; intento++) {
        const x = caja.xmin + aleatorio() * (caja.xmax - caja.xmin);
        const z = caja.zmin + aleatorio() * (caja.zmax - caja.zmin);
        if (!puntoEnPoligono(x, z, contorno) || distanciaAlBorde(x, z, contorno) < 4) continue;
        const choca = obstaculos.some(
          (o) => dentroDeCaja(o.caja, x, z) && (puntoEnPoligono(x, z, o.pts) || distanciaAlBorde(x, z, o.pts) < o.margen)
        );
        if (choca) continue;
        if (caminos.some((c) => dentroDeCaja(c.caja, x, z) && distanciaAPolilinea(x, z, c.pts) < c.margen)) continue;
        if (arboles.some((a) => Math.hypot(a.x - x, a.z - z) < 10)) continue;
        arboles.push({ x, z, escala: 0.8 + aleatorio() * 0.6, tono: aleatorio() });
      }

      const troncos = new THREE.InstancedMesh(
        new THREE.CylinderGeometry(0.35, 0.5, 5, 6).translate(0, 2.5, 0),
        new THREE.MeshStandardMaterial({ color: 0x5b4636, roughness: 1 }),
        arboles.length
      );
      const copas = new THREE.InstancedMesh(
        new THREE.IcosahedronGeometry(3.6, 1).translate(0, 7.2, 0),
        new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }),
        arboles.length
      );
      const verdes = [0x2f6b2f, 0x3a7d34, 0x285c2a, 0x4a8a3c];
      const matriz = new THREE.Matrix4();
      const color = new THREE.Color();
      arboles.forEach((a, i) => {
        matriz.compose(
          new THREE.Vector3(a.x, alturaEn(a.x, a.z) - 0.2, a.z),
          new THREE.Quaternion(),
          new THREE.Vector3(a.escala, a.escala, a.escala)
        );
        troncos.setMatrixAt(i, matriz);
        copas.setMatrixAt(i, matriz);
        copas.setColorAt(i, color.setHex(verdes[Math.floor(a.tono * verdes.length)]));
      });
      troncos.castShadow = true;
      copas.castShadow = true;
      escena.add(troncos, copas);
    }

    // 13. Rutas del carro por las vías reales (grafo de OSM, con sus sentidos únicos)
    const grafo = crearGrafo(VIAS);
    const nodoGarita = nodoMasCercano(grafo, puntoGarita);

    function alturaDeRodado(x, z) {
      const enLosa = zonasDatos.some((zd) => puntoEnPoligono(x, z, zd.pts));
      return alturaEn(x, z) + (enLosa ? ESPESOR_LOSA + 0.02 : VIA.principal.elevacion + 0.02);
    }

    function planificarRecorrido(tipo, zona, puesto) {
      const destino = puesto ?? { ...puntoInterior(zona.pts), y: null, haciaPasillo: 1 };
      const despeje = zona.reparto.largoPuesto / 2 + 3.5;
      const frente = {
        x: destino.x + zona.reparto.v.x * despeje * (destino.haciaPasillo ?? 1),
        z: destino.z + zona.reparto.v.z * despeje * (destino.haciaPasillo ?? 1),
      };
      let puntos;
      if (tipo === "ENTRADA") {
        const ruta = rutaDesdeGarita(grafo, nodoGarita, zona.pts, destino);
        puntos = [...llegada.slice(0, -1), ...ruta.puntos, frente, destino];
      } else {
        const ruta = rutaHaciaGarita(grafo, nodoGarita, zona.pts, destino);
        puntos = [destino, frente, ...ruta.puntos, ...salida.slice(1)];
      }

      const muestras = suavizar(puntos, 1.5);
      const alturas = muestras.map((p) => alturaDeRodado(p.x, p.z));
      // Pisos altos del Sambilito: la última (o primera) parte del trayecto sube/baja la rampa.
      if (destino.y != null && destino.piso > 0) {
        const tramo = 12;
        const n = muestras.length;
        for (let i = 0; i < n; i++) {
          const desdePuesto = (tipo === "ENTRADA" ? n - 1 - i : i) * 1.5;
          if (desdePuesto < tramo) {
            const t = 1 - desdePuesto / tramo;
            alturas[i] = alturas[i] + (destino.y + 0.02 - alturas[i]) * t;
          }
        }
      }
      const acumulado = [0];
      for (let i = 1; i < muestras.length; i++) {
        acumulado.push(acumulado[i - 1] + Math.hypot(muestras[i].x - muestras[i - 1].x, muestras[i].z - muestras[i - 1].z));
      }
      let sGarita = 0;
      let mejor = Infinity;
      muestras.forEach((p, i) => {
        const d = Math.hypot(p.x - puntoGarita.x, p.z - puntoGarita.z);
        if (d < mejor) {
          mejor = d;
          sGarita = acumulado[i];
        }
      });
      const largo = acumulado.at(-1);
      return { muestras, alturas, acumulado, largo, sGarita, velocidad: limitar(largo / 12, 18, 60) };
    }

    // 14. Carros en movimiento (uno por evento; varios a la vez en hora pico)
    const carrosActivos = [];
    const reserva = [];
    let semillaColor = 0;

    function iniciarCarro(evento) {
      const zona = zonasEnEscena[evento.estacionamientoId];
      if (!zona) {
        setInfoOverlay(`⚠️ El estacionamiento «${evento.estacionamientoId}» no está en el mapa.`);
        return;
      }
      if (carrosActivos.length >= MAX_CARROS_EN_MOVIMIENTO) terminarCarro(carrosActivos.shift());

      let puesto = null;
      if (evento.tipo === "ENTRADA") {
        const indice = zona.visibles + zona.reservados;
        if (indice < zona.orden.length) puesto = zona.puestos[zona.orden[indice]];
        zona.reservados++;
      } else if (zona.visibles > 0) {
        puesto = zona.puestos[zona.orden[zona.visibles - 1]];
        zona.mostrarCarros(zona.visibles - 1); // el carro sale de ese puesto
      }

      const recorrido = planificarRecorrido(evento.tipo, zona, puesto);
      const malla = reserva.pop() ?? crearCarro3D();
      malla.children[0].material.color.setHex(COLORES_CARROS[semillaColor++ % COLORES_CARROS.length]);
      malla.visible = true;
      if (!malla.parent) escena.add(malla);
      carrosActivos.push({ ...recorrido, evento, zona, malla, s: 0, espera: 0, paso: false, tiempo: 0, rumbo: null });
    }

    function terminarCarro(carro) {
      const { evento, zona, malla } = carro;
      malla.visible = false;
      reserva.push(malla);
      if (evento.tipo === "ENTRADA") zona.reservados = Math.max(0, zona.reservados - 1);
      if (evento.ocupacion) zona.fijarOcupacion(evento.ocupacion);
      else zona.mostrarCarros(zona.visibles + (evento.tipo === "ENTRADA" ? 1 : 0));
      setInfoOverlay(
        evento.tipo === "ENTRADA"
          ? `✅ ${evento.placa} se estacionó en ${zona.nombreCartel}.`
          : `👋 ${evento.placa} salió por la garita de la Av. Teherán.`
      );
    }

    function moverCarro(carro, delta) {
      const { muestras, alturas, acumulado, largo, sGarita, velocidad, malla } = carro;
      carro.tiempo += delta;
      // Frena al acercarse a la talanquera y al estacionar; arranca suave
      let factor = 0.35 + 0.65 * limitar(Math.abs(carro.s - sGarita) / 60, 0, 1);
      factor *= limitar((largo - carro.s) / 35, 0.15, 1);
      factor *= limitar(0.3 + carro.s / 40, 0.3, 1);
      if (!carro.paso && carro.s >= sGarita - 7) {
        carro.espera += delta;
        if (carro.espera < 1.1) factor = 0;
        else carro.paso = true;
      }
      carro.s = Math.min(largo, carro.s + velocidad * factor * delta);

      let i = 1;
      while (i < acumulado.length - 1 && acumulado[i] < carro.s) i++;
      const tramo = acumulado[i] - acumulado[i - 1] || 1;
      const t = limitar((carro.s - acumulado[i - 1]) / tramo, 0, 1);
      const a = muestras[i - 1];
      const b = muestras[i];
      malla.position.set(a.x + (b.x - a.x) * t, alturas[i - 1] + (alturas[i] - alturas[i - 1]) * t, a.z + (b.z - a.z) * t);
      const rumbo = Math.atan2(-(b.z - a.z), b.x - a.x);
      if (carro.rumbo === null) carro.rumbo = rumbo;
      let diferencia = rumbo - carro.rumbo;
      diferencia = Math.atan2(Math.sin(diferencia), Math.cos(diferencia));
      carro.rumbo += diferencia * (1 - Math.exp(-delta * 10));
      malla.rotation.y = carro.rumbo;
      malla.rotation.z = Math.atan2(alturas[i] - alturas[i - 1], tramo);
      return carro.s >= largo;
    }

    // 15. Cámara inicial: el campus completo visto desde el sureste
    controls.target.set(0, 30, -10);
    camara.position.set(390, 560, 640);
    controls.update();

    // 16. Bucle de animación (Render Loop)
    let animationFrameId;
    const timer = new THREE.Timer();
    timer.connect(document);
    const vectorTemporal = new THREE.Vector3();

    const animar = (marcaDeTiempo) => {
      animationFrameId = requestAnimationFrame(animar);
      timer.update(marcaDeTiempo);
      const delta = Math.min(timer.getDelta(), 0.25);

      while (eventosPendientes.current.length > 0) iniciarCarro(eventosPendientes.current.shift());

      // Carros en movimiento
      for (let i = carrosActivos.length - 1; i >= 0; i--) {
        if (moverCarro(carrosActivos[i], delta)) {
          terminarCarro(carrosActivos[i]);
          carrosActivos.splice(i, 1);
        }
      }

      // Talanquera: sube si algún carro está cerca de la garita
      const abierta = carrosActivos.some((c) => Math.abs(c.s - c.sGarita) < 18 && (c.paso || c.s >= c.sGarita - 8));
      brazoGarita.rotation.z = THREE.MathUtils.lerp(brazoGarita.rotation.z, abierta ? Math.PI / 2.3 : 0, 1 - Math.exp(-delta * 6));
      luzSemaforoGarita.material.color.setHex(abierta ? 0x22c55e : 0xef4444); // Verde al abrir

      // Seguir al último carro sin cambiar el ángulo de vista elegido
      const seguido = carrosActivos.at(-1);
      if (seguirRef.current && seguido) {
        const k = 1 - Math.exp(-delta * 3);
        vectorTemporal.copy(seguido.malla.position).sub(controls.target).multiplyScalar(k);
        controls.target.add(vectorTemporal);
        camara.position.add(vectorTemporal);
        if (seguido.tiempo < 2.5) {
          const distancia = camara.position.distanceTo(controls.target);
          const deseada = Math.min(distancia, 240);
          vectorTemporal
            .copy(camara.position)
            .sub(controls.target)
            .setLength(distancia + (deseada - distancia) * k);
          camara.position.copy(controls.target).add(vectorTemporal);
        }
      }
      controls.update();

      // Carteles y etiquetas: tamaño según la distancia, para leerse siempre
      for (const zona of Object.values(zonasEnEscena)) {
        const d = camara.position.distanceTo(zona.baliza.position);
        const alto = limitar(d * 0.03, 7, 34);
        zona.cartel.scale.set(alto * 2, alto, 1);
        zona.cartel.position.set(zona.baliza.position.x, zona.baseCartel, zona.baliza.position.z);
        if (zona.distintivo) {
          const altoD = alto * 0.32;
          zona.distintivo.scale.set(altoD * zona.distintivo.userData.aspecto, altoD, 1);
          zona.distintivo.position.set(zona.baliza.position.x, zona.baseCartel + alto + 0.6, zona.baliza.position.z);
        }
      }
      for (const e of etiquetasEscalables) {
        const d = camara.position.distanceTo(e.sprite.position);
        e.sprite.visible = d < e.hasta;
        const alto = limitar(d * e.factor, e.min, e.max);
        e.sprite.scale.set(alto * e.aspecto, alto, 1);
      }
      for (const carro of carrosActivos) {
        const d = camara.position.distanceTo(carro.malla.position);
        const marcador = carro.malla.userData.marcador;
        marcador.scale.setScalar(limitar(d / 80, 1, 9));
        marcador.position.y = 4 + limitar(d / 80, 1, 9) * 0.6 + Math.sin(timer.getElapsed() * 4) * 0.3;
      }

      // Brújula: gira con la cámara
      if (brujulaRef.current) {
        brujulaRef.current.style.transform = `rotate(${THREE.MathUtils.radToDeg(controls.getAzimuthalAngle())}deg)`;
      }

      renderer.render(escena, camara);
    };

    animationFrameId = requestAnimationFrame(animar);

    // 17. Manejo de redimensionamiento
    const observador = new ResizeObserver(() => {
      const w = contenedor.clientWidth;
      const h = contenedor.clientHeight;
      if (w === 0 || h === 0) return;
      camara.aspect = w / h;
      camara.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    observador.observe(contenedor);

    // Limpieza al desmontar
    return () => {
      cancelAnimationFrame(animationFrameId);
      observador.disconnect();
      timer.dispose();
      controls.dispose();
      refsScene.current.actualizarOcupacion = null;
      const liberados = new Set();
      escena.traverse((objeto) => {
        if (objeto.geometry && !liberados.has(objeto.geometry)) {
          liberados.add(objeto.geometry);
          objeto.geometry.dispose();
        }
        const materiales = Array.isArray(objeto.material) ? objeto.material : objeto.material ? [objeto.material] : [];
        for (const material of materiales) {
          if (liberados.has(material)) continue;
          liberados.add(material);
          material.map?.dispose();
          material.dispose();
        }
      });
      texturaVentanas.dispose();
      renderer.dispose();
      if (contenedor && renderer.domElement) {
        contenedor.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Contenedor del lienzo Three.js */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Overlay de Estado en Pantalla */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(8px)",
          color: "#f8fafc",
          padding: "14px 18px",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          maxWidth: "360px",
          pointerEvents: "none",
          fontFamily: "system-ui, sans-serif",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
              display: "inline-block",
            }}
          />
          <strong style={{ fontSize: "0.95rem", letterSpacing: "0.02em" }}>
            Garita Virtual UCAB · 3D
          </strong>
        </div>
        <div style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.4" }}>{infoOverlay}</div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "8px",
            fontSize: "0.8rem",
            color: "#cbd5e1",
            pointerEvents: "auto",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          <input type="checkbox" checked={seguir} onChange={(e) => setSeguir(e.target.checked)} />
          Seguir al carro con la cámara
        </label>
        <div
          style={{
            fontSize: "0.75rem",
            color: "#64748b",
            marginTop: "8px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "6px",
          }}
        >
          💡 Usa el <strong>ratón</strong> para rotar (click izq), mover (click der) y hacer zoom.
          <br />
          Escala real 1:1 · Mapa © colaboradores de OpenStreetMap · Relieve SRTM (NASA)
        </div>
      </div>

      {/* Brújula: la N apunta al norte real */}
      <div
        aria-label="Brújula"
        style={{
          position: "absolute",
          left: "16px",
          bottom: "16px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "rgba(15, 23, 42, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          pointerEvents: "none",
        }}
      >
        <div
          ref={brujulaRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "3px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span style={{ color: "#ef4444", fontWeight: 800, fontSize: "0.8rem", lineHeight: 1 }}>N</span>
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "16px solid #ef4444",
              marginTop: "1px",
            }}
          />
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "16px solid #cbd5e1",
            }}
          />
        </div>
      </div>
    </div>
  );
}
