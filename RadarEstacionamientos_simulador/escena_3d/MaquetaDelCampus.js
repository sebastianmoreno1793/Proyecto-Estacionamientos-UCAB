// MaquetaDelCampus · Render de la MAQUETA del campus para la app (D-007 › Maqueta): una vista
// desde arriba, con el acabado de una maqueta física de arquitectura (grama de fieltro, árboles
// redondos, techos de teja y concreto, asfalto claro, puestos pintados), estática y en alta resolución.
//
// Sale de los mismos datos reales que la maqueta 3D: edificios, vías, canchas y jardines de
// `datos_campus/campus.js` (OpenStreetMap) y los estacionamientos de la app base (su API pública,
// D-006). El suelo es plano: es una maqueta, no el relieve.
//
// `renderizar()` devuelve la imagen (JPEG) y la proyección: dónde cae cada estacionamiento y cada
// edificio en la imagen, en píxeles. Con eso la app pinta el semáforo encima sin volver a dibujar el campus.
import * as THREE from "three";
import { AREAS, CANCHAS, CONTORNO_CAMPUS, EDIFICIOS, GARITA, PUNTOS_DE_INTERES, VIAS } from "@/datos_campus/campus";
import { Aleatorio } from "@/mapa_3d/Aleatorio";
import { Coordenadas } from "@/mapa_3d/Coordenadas";
import { Poligono } from "@/mapa_3d/Poligono";
import { Piezas3D } from "./Piezas3D.js";
import { TexturasDeMaqueta } from "./TexturasDeMaqueta.js";

export class MaquetaDelCampus {
  static ALTO_PISO = TexturasDeMaqueta.ALTO_PISO;
  static INCLINACION = 34; // grados desde la vertical: se ven techos y fachadas, como una foto de maqueta
  static ALTO_BASE = 2.4; // grosor de la base de la maqueta
  static VIA = {
    autopista: { ancho: 11, afuera: true },
    avenida: { ancho: 10, afuera: true },
    ramal: { ancho: 6, afuera: true },
    principal: { ancho: 7 },
    acceso: { ancho: 5.5 },
    interna: { ancho: 4.5 },
    peatonal: { ancho: 2.4, peatonal: true },
  };
  static VERDES = ["#4f8a3c", "#5f9b45", "#3f7a37", "#6aa84f", "#7cb85a", "#56923f"];
  static FLORES = ["#e48fb3", "#f2c94c", "#b18ad6", "#ef8f4a", "#f3eee3", "#e86a6a"];

  #ancho;
  #alto;
  #renderer;
  #escena = new THREE.Scene();
  #mat;
  #contorno = Coordenadas.poligonoAMetros(CONTORNO_CAMPUS);
  #caja = Poligono.caja(this.#contorno, 140);
  #cajaCampus = Poligono.caja(this.#contorno);
  #ocupado = []; // polígonos donde no van árboles
  #edificios = [];
  #lotes = [];
  #garita = Coordenadas.gpsAMetros(...GARITA.posicion);

  // contenedor: donde se muestra la imagen · ancho y alto: tamaño del render en píxeles
  constructor(contenedor, { ancho = 2400, alto = 1560 } = {}) {
    this.#ancho = ancho;
    this.#alto = alto;
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
    contenedor.appendChild(renderer.domElement);
    this.#renderer = renderer;
    this.#mat = MaquetaDelCampus.#materiales(TexturasDeMaqueta.crear());
  }

  // Arma la maqueta con los estacionamientos de la app base, la dibuja y devuelve { imagen, datos }.
  renderizar(estacionamientos) {
    this.#dibujarBase();
    this.#dibujarVias();
    this.#dibujarAreasYCanchas();
    this.#dibujarEdificios();
    this.#dibujarGaritaYEstatua();
    this.#dibujarEstacionamientos(estacionamientos);
    this.#plantarArboles();
    const centro = { x: (this.#cajaCampus.xmin + this.#cajaCampus.xmax) / 2, z: (this.#cajaCampus.zmin + this.#cajaCampus.zmax) / 2 };
    this.#iluminar(centro);
    const camara = this.#camara(centro);
    this.#renderer.render(this.#escena, camara);
    return { imagen: this.#renderer.domElement.toDataURL("image/jpeg", 0.9), datos: this.#proyeccion(camara) };
  }

  destruir() {
    this.#renderer.dispose();
    this.#renderer.domElement.remove();
    this.#escena.traverse((o) => o.geometry?.dispose());
  }

  static #materiales(tex) {
    return {
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
  }

  #agregar(geo, material, { sombra = true, recibe = true } = {}) {
    const m = new THREE.Mesh(geo, material);
    m.castShadow = sombra;
    m.receiveShadow = recibe;
    this.#escena.add(m);
    return m;
  }

  // Base de la maqueta y suelo: el campus está montado sobre un bloque con borde claro.
  #dibujarBase() {
    const { ALTO_BASE } = MaquetaDelCampus;
    const caja = this.#caja;
    this.#agregar(
      new THREE.PlaneGeometry(caja.xmax - caja.xmin + 1200, caja.zmax - caja.zmin + 1200)
        .rotateX(-Math.PI / 2)
        .translate((caja.xmin + caja.xmax) / 2, -ALTO_BASE, (caja.zmin + caja.zmax) / 2),
      this.#mat.afuera,
      { sombra: false },
    );
    this.#agregar(Piezas3D.losa(this.#contorno, -ALTO_BASE, -0.02), [this.#mat.grama, this.#mat.base]);
    this.#agregar(MaquetaDelCampus.#plano(this.#contorno, 0), this.#mat.grama, { sombra: false });
  }

  #dibujarVias() {
    for (const via of VIAS) {
      const estilo = MaquetaDelCampus.VIA[via.tipo];
      if (!estilo) continue;
      const pts = MaquetaDelCampus.#remuestrear(Coordenadas.poligonoAMetros(via.puntos), 2);
      // Los caminos peatonales de afuera del campus ensucian la base: solo van los de adentro.
      const medio = pts[Math.floor(pts.length / 2)];
      if (estilo.peatonal && !Poligono.contiene(medio.x, medio.z, this.#contorno)) continue;
      const y = estilo.afuera ? -MaquetaDelCampus.ALTO_BASE + 0.05 : estilo.peatonal ? 0.06 : 0.04;
      const material = estilo.afuera ? this.#mat.asfaltoAfuera : estilo.peatonal ? this.#mat.adoquin : this.#mat.asfalto;
      this.#agregar(MaquetaDelCampus.#cinta(pts, estilo.ancho, y), material, { sombra: false });
    }
  }

  // Jardines, plazas y canchas (con su borde blanco y el rombo del béisbol).
  #dibujarAreasYCanchas() {
    for (const area of AREAS) {
      const pts = Coordenadas.poligonoAMetros(area.poligono);
      const esPlaza = area.tipo === "plaza";
      this.#agregar(MaquetaDelCampus.#plano(pts, esPlaza ? 0.08 : 0.03), esPlaza ? this.#mat.adoquin : this.#mat.gramaJardin, { sombra: false });
      if (esPlaza) this.#ocupado.push(pts);
    }
    for (const cancha of CANCHAS) {
      const pts = Coordenadas.poligonoAMetros(cancha.poligono);
      const material = cancha.deporte === "baloncesto" ? this.#mat.baloncesto : this.#mat.cancha;
      this.#agregar(MaquetaDelCampus.#plano(pts, 0.09), material, { sombra: false });
      this.#agregar(MaquetaDelCampus.#cinta(MaquetaDelCampus.#remuestrear([...pts, pts[0]], 3), 0.35, 0.11), this.#mat.blanco, { sombra: false });
      if (cancha.deporte === "béisbol") {
        const c = Poligono.puntoInterior(pts);
        const r = 14;
        const rombo = [
          { x: c.x, z: c.z + r },
          { x: c.x + r, z: c.z },
          { x: c.x, z: c.z - r },
          { x: c.x - r, z: c.z },
        ];
        this.#agregar(MaquetaDelCampus.#plano(rombo, 0.1), this.#mat.tierra, { sombra: false });
      }
      this.#ocupado.push(pts);
    }
  }

  // Edificios: techo de teja o azotea de concreto con pretil y caseta.
  #dibujarEdificios() {
    for (const e of EDIFICIOS) {
      const pts = Coordenadas.poligonoAMetros(e.poligono);
      const pisos = Math.max(2, Math.min(e.pisos ?? 2, 6));
      const altura = pisos * MaquetaDelCampus.ALTO_PISO;
      const aleatorio = Aleatorio.desdeTexto(e.id);
      const conTeja = ["biblioteca", "capilla", "auditorio", "comida"].includes(e.uso) || aleatorio.siguiente() < 0.3;
      this.#agregar(Piezas3D.losa(pts, 0, altura), [conTeja ? this.#mat.teja : this.#mat.concreto, this.#mat.pared]);
      // Pretil y caseta en la azotea de los techos planos: el detalle que hace "maqueta".
      if (!conTeja) {
        this.#agregar(MaquetaDelCampus.#pretil(pts, 0.7, altura, 0.9), [this.#mat.caseta, this.#mat.pared]);
        const c = Poligono.puntoInterior(pts);
        const t = 2.2 + aleatorio.siguiente() * 1.6;
        this.#agregar(new THREE.BoxGeometry(t * 1.6, 2.2, t).translate(c.x, altura + 1.1, c.z), this.#mat.caseta);
      }
      this.#ocupado.push(pts);
      this.#edificios.push({ id: e.id, nombre: e.nombre, uso: e.uso, centro: Poligono.puntoInterior(pts), altura });
    }
  }

  // Garita y estatua de Andrés Bello.
  #dibujarGaritaYEstatua() {
    const { pared, teja, caseta, tronco } = this.#mat;
    const g = this.#garita;
    this.#agregar(new THREE.BoxGeometry(4, 3, 4).translate(g.x, 1.5, g.z), [pared, pared, teja, pared, pared, pared]);
    const estatua = PUNTOS_DE_INTERES.find((p) => p.tipo === "estatua");
    if (estatua) {
      const p = Coordenadas.gpsAMetros(...estatua.posicion);
      this.#agregar(new THREE.CylinderGeometry(1.4, 1.6, 1.2, 16).translate(p.x, 0.6, p.z), caseta);
      this.#agregar(new THREE.CylinderGeometry(0.45, 0.5, 2.4, 10).translate(p.x, 2.4, p.z), tronco);
    }
  }

  // Estacionamientos de la app base, con sus puestos pintados.
  #dibujarEstacionamientos(estacionamientos) {
    for (const est of estacionamientos) {
      if (!est.poligono) continue;
      const pts = Coordenadas.poligonoAMetros(est.poligono);
      const techo = est.pisos ? est.pisos * 3 : 0.07;
      if (est.pisos) this.#agregar(Piezas3D.losa(pts, 0, techo), [this.#mat.estacionamiento, this.#mat.paredParqueo]);
      else this.#agregar(MaquetaDelCampus.#plano(pts, techo), this.#mat.estacionamiento, { sombra: false });
      this.#agregar(MaquetaDelCampus.#lineasDePuestos(pts, techo + 0.03), this.#mat.lineas, { sombra: false });
      this.#ocupado.push(pts);
      this.#lotes.push({ est, pts, techo });
    }
  }

  // Árboles (decorativos, deterministas): adentro del campus y, más apagados, afuera.
  #plantarArboles() {
    const { VIA, VERDES, FLORES, ALTO_BASE } = MaquetaDelCampus;
    const contorno = this.#contorno;
    const viasInternas = VIAS.filter((v) => VIA[v.tipo]).map((v) => ({ pts: Coordenadas.poligonoAMetros(v.puntos), ancho: VIA[v.tipo].ancho }));
    const libreParaArbol = (x, z, dentro) => {
      if (dentro && !Poligono.contiene(x, z, contorno)) return false;
      if (this.#ocupado.some((p) => Poligono.contiene(x, z, p))) return false;
      return viasInternas.every((v) => Poligono.distanciaAPolilinea(x, z, v.pts) > v.ancho / 2 + 2.5);
    };
    const copas = [];
    const aleatorio = new Aleatorio(2026);
    const cajaCampus = this.#cajaCampus;
    for (let i = 0, puestos = 0; i < 9000 && puestos < 1100; i++) {
      const x = cajaCampus.xmin + aleatorio.siguiente() * (cajaCampus.xmax - cajaCampus.xmin);
      const z = cajaCampus.zmin + aleatorio.siguiente() * (cajaCampus.zmax - cajaCampus.zmin);
      if (!libreParaArbol(x, z, true)) continue;
      if (copas.some((c) => Math.hypot(c.x - x, c.z - z) < 4.2)) continue;
      const flor = aleatorio.siguiente() < 0.14;
      const r = 2.1 + aleatorio.siguiente() * 1.9;
      copas.push({ x, z, y: 0, r, color: flor ? aleatorio.elegir(FLORES) : aleatorio.elegir(VERDES) });
      puestos++;
    }
    const caja = this.#caja;
    for (let i = 0, puestos = 0; i < 6000 && puestos < 180; i++) {
      const x = caja.xmin + aleatorio.siguiente() * (caja.xmax - caja.xmin);
      const z = caja.zmin + aleatorio.siguiente() * (caja.zmax - caja.zmin);
      if (Poligono.contiene(x, z, contorno) || !libreParaArbol(x, z, false)) continue;
      const r = 2 + aleatorio.siguiente() * 1.6;
      copas.push({ x, z, y: -ALTO_BASE, r, color: aleatorio.elegir(["#6f8f55", "#7c9a60", "#88a26a"]) });
      puestos++;
    }
    const instCopas = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), this.#mat.copa, copas.length);
    const instTroncos = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.24, 1, 6), this.#mat.tronco, copas.length);
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
      this.#escena.add(inst);
    }
  }

  // Luz: sol de la mañana desde el sureste, cielo cálido.
  #iluminar(centro) {
    this.#escena.add(new THREE.HemisphereLight(0xfff4e2, 0x6d6450, 0.8));
    const sol = new THREE.DirectionalLight(0xfff1dc, 3.1);
    sol.position.set(centro.x + 300, 380, centro.z + 240);
    sol.target.position.set(centro.x, 0, centro.z);
    sol.castShadow = true;
    sol.shadow.mapSize.set(4096, 4096);
    Object.assign(sol.shadow.camera, { left: -680, right: 680, top: 680, bottom: -680, near: 10, far: 1800 });
    sol.shadow.bias = -0.0005;
    sol.shadow.normalBias = 0.6;
    sol.shadow.radius = 4;
    this.#escena.add(sol, sol.target);
  }

  // Cámara ortográfica casi cenital, mirando al norte, que encuadra el campus completo.
  #camara(centro) {
    const angulo = (MaquetaDelCampus.INCLINACION * Math.PI) / 180;
    const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 4000);
    camara.position.set(centro.x, Math.cos(angulo) * 1500, centro.z + Math.sin(angulo) * 1500);
    camara.lookAt(centro.x, 0, centro.z);
    camara.updateMatrixWorld();
    const enVista = this.#contorno.map((p) => new THREE.Vector3(p.x, 0, p.z).applyMatrix4(camara.matrixWorldInverse));
    const xs = enVista.map((v) => v.x);
    const ys = enVista.map((v) => v.y);
    const margen = 14;
    const [x0, x1, y0, y1] = [Math.min(...xs) - margen, Math.max(...xs) + margen, Math.min(...ys) - margen, Math.max(...ys) + margen];
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    let medioAncho = (x1 - x0) / 2;
    let medioAlto = (y1 - y0) / 2;
    if (medioAncho / medioAlto > this.#ancho / this.#alto) medioAlto = (medioAncho * this.#alto) / this.#ancho;
    else medioAncho = (medioAlto * this.#ancho) / this.#alto;
    Object.assign(camara, { left: cx - medioAncho, right: cx + medioAncho, top: cy + medioAlto, bottom: cy - medioAlto });
    camara.updateProjectionMatrix();
    return camara;
  }

  // Dónde cae cada estacionamiento, edificio y la garita en la imagen (píxeles).
  #proyeccion(camara) {
    const proyectar = (x, y, z) => {
      const v = new THREE.Vector3(x, y, z).project(camara);
      return [Math.round(((v.x + 1) / 2) * this.#ancho * 10) / 10, Math.round(((1 - v.y) / 2) * this.#alto * 10) / 10];
    };
    return {
      version: 1,
      generado: new Date().toISOString(),
      ancho: this.#ancho,
      alto: this.#alto,
      inclinacion: MaquetaDelCampus.INCLINACION,
      fuente: "OpenStreetMap (ODbL) y los estacionamientos de la app base",
      estacionamientos: this.#lotes.map(({ est, pts, techo }) => {
        const interior = Poligono.puntoInterior(pts);
        return { id: est.id, puntos: pts.map((p) => proyectar(p.x, techo, p.z)), etiqueta: proyectar(interior.x, techo, interior.z) };
      }),
      edificios: this.#edificios.filter((e) => e.nombre).map((e) => ({ id: e.id, nombre: e.nombre, punto: proyectar(e.centro.x, e.altura, e.centro.z) })),
      garita: proyectar(this.#garita.x, 3, this.#garita.z),
    };
  }

  // ---------- Geometrías de la maqueta ----------

  static #plano(pts, y) {
    const geo = new THREE.ShapeGeometry(Piezas3D.forma(pts));
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, y, 0);
    return geo;
  }

  // Pretil de una azotea: un anillo bajo en el borde del techo (el polígono menos una copia
  // encogida hacia su centro).
  static #pretil(pts, grosor, abajo, alto) {
    const c = Poligono.puntoInterior(pts);
    const caja = Poligono.caja(pts);
    const k = Math.max(0.5, 1 - (2 * grosor) / Math.min(caja.xmax - caja.xmin, caja.zmax - caja.zmin));
    const forma = Piezas3D.forma(pts);
    forma.holes.push(new THREE.Path(pts.map((p) => new THREE.Vector2(c.x + (p.x - c.x) * k, -(c.z + (p.z - c.z) * k)))));
    const geo = new THREE.ExtrudeGeometry(forma, { depth: alto, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, abajo, 0);
    return geo;
  }

  // Cinta plana de `ancho` metros a lo largo de la polilínea, con coordenadas de textura en metros.
  static #cinta(pts, ancho, y) {
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
  static #lineasDePuestos(pts, y) {
    const { puestos } = Poligono.distribuirPuestos(pts);
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

  // Remuestrea la polilínea en tramos rectos de `paso` metros (sin curvar: es una maqueta).
  static #remuestrear(pts, paso) {
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
}
