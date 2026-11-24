// MundoVirtual3D · La maqueta 3D del Campus Montalbán con dimensiones reales: el "mundo virtual"
// del simulador. 1 unidad de Three.js = 1 metro; origen = CENTRO_CAMPUS (mapa_3d/Coordenadas.js).
//
// Arma la escena con sus partes y la anima:
//   TerrenoDelCampus   relieve, vías, edificios, árboles
//   Garita3D           talanquera y lector de placas
//   Estacionamiento3D  uno por estacionamiento de la app base
//   TraficoDeCarros    los carros que entran y salen
// No habla con la app base: lee el EstadoDelMapa y cuenta lo que pasa por `disparar(evento)`:
//   { tipo: "SELECCIONAR", estacionamientoId }          clic en el mapa
//   { tipo: "LECTURA_PLACA", placa, sentido, idLectura } el carro pasa la garita
//   { tipo: "AVISO", estacionamientoId, movimiento, idAviso } el sensor lo ve
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { VIAS } from "@/datos_campus/campus";
import { GrafoDeVias } from "@/mapa_3d/GrafoDeVias";
import { Estacionamiento3D } from "./Estacionamiento3D.js";
import { Etiquetas3D } from "./Etiquetas3D.js";
import { Garita3D } from "./Garita3D.js";
import { TerrenoDelCampus } from "./TerrenoDelCampus.js";
import { TraficoDeCarros } from "./TraficoDeCarros.js";

export class MundoVirtual3D {
  #contenedor;
  #estado;
  #disparar;
  #brujula;
  #escena = new THREE.Scene();
  #camara;
  #renderer;
  #controles;
  #etiquetas;
  #terreno;
  #garita;
  #estacionamientos = {}; // id → Estacionamiento3D
  #trafico;
  #seleccionables = [];
  #enfoque = null;
  #reloj = 0;
  #timer = new THREE.Timer();
  #cuadro = 0;
  #observador;
  #raycaster = new THREE.Raycaster();
  #puntero = new THREE.Vector2();
  #inicioClic = null;
  #vectorTemporal = new THREE.Vector3();

  // contenedor: el <div> donde va el lienzo · estacionamientos: la primera lista con polígonos
  // estado: EstadoDelMapa · disparar(evento) · informar(texto) · brujula(): el <div> que gira con la cámara
  constructor(contenedor, { estacionamientos, estado, disparar, informar, brujula }) {
    this.#contenedor = contenedor;
    this.#estado = estado;
    this.#disparar = disparar;
    this.#brujula = brujula;

    this.#prepararEscena();
    this.#etiquetas = new Etiquetas3D(this.#escena);
    this.#terreno = new TerrenoDelCampus(this.#escena, estacionamientos, this.#etiquetas);
    this.#garita = new Garita3D(this.#escena, this.#terreno, this.#etiquetas);

    // Grafo de las vías reales (OSM, con sus sentidos únicos), para las rutas del carro
    const grafo = new GrafoDeVias(VIAS);
    const recursos = Estacionamiento3D.recursosCompartidos();
    for (const zona of this.#terreno.zonas) {
      this.#estacionamientos[zona.est.id] = new Estacionamiento3D(this.#escena, zona, {
        estado,
        grafo,
        recursos,
        seleccionables: this.#seleccionables,
      });
    }
    for (const e of Object.values(this.#estacionamientos)) e.aplicar();

    this.#trafico = new TraficoDeCarros(this.#escena, {
      terreno: this.#terreno,
      garita: this.#garita,
      grafo,
      estacionamientos: this.#estacionamientos,
      estado,
      disparar,
      informar,
    });

    this.#escucharClics();
    // Cámara inicial: el campus completo visto desde el sureste
    this.#controles.target.set(0, 30, -10);
    this.#camara.position.set(390, 560, 640);
    this.#controles.update();

    this.#timer.connect(document);
    this.#cuadro = requestAnimationFrame(this.#animar);
    this.#observador = new ResizeObserver(() => this.#redimensionar());
    this.#observador.observe(contenedor);
  }

  // Pone al día un estacionamiento con lo último del EstadoDelMapa.
  aplicar(id) {
    this.#estacionamientos[id]?.aplicar();
  }

  // Libera todo lo que usa la escena (al desmontar el componente).
  destruir() {
    cancelAnimationFrame(this.#cuadro);
    this.#observador.disconnect();
    this.#renderer.domElement.removeEventListener("pointerdown", this.#alPresionar);
    this.#renderer.domElement.removeEventListener("pointerup", this.#alSoltar);
    this.#timer.dispose();
    this.#controles.dispose();
    const liberados = new Set();
    this.#escena.traverse((objeto) => {
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
    this.#terreno.destruir();
    this.#renderer.dispose();
    this.#renderer.domElement.remove();
  }

  // Escena, cámara, renderer, controles de órbita y luces.
  #prepararEscena() {
    const escena = this.#escena;
    escena.background = new THREE.Color(0x0b1329);
    escena.fog = new THREE.Fog(0x0b1329, 1500, 3400);

    const ancho = this.#contenedor.clientWidth;
    const alto = this.#contenedor.clientHeight;
    this.#camara = new THREE.PerspectiveCamera(45, ancho / alto, 1, 6000);

    this.#renderer = new THREE.WebGLRenderer({ antialias: true });
    this.#renderer.setSize(ancho, alto);
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.#renderer.shadowMap.enabled = true;
    this.#renderer.shadowMap.type = THREE.PCFShadowMap;
    this.#contenedor.appendChild(this.#renderer.domElement);

    const controles = new OrbitControls(this.#camara, this.#renderer.domElement);
    controles.enableDamping = true;
    controles.dampingFactor = 0.06;
    controles.maxPolarAngle = Math.PI / 2.15; // para no pasar por debajo del suelo
    controles.minDistance = 12;
    controles.maxDistance = 1900;
    controles.screenSpacePanning = false;
    this.#controles = controles;

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
    escena.add(luzSol, luzSol.target);
  }

  // Clic sobre un estacionamiento (sin arrastrar): se selecciona en el menú.
  #escucharClics() {
    this.#renderer.domElement.addEventListener("pointerdown", this.#alPresionar);
    this.#renderer.domElement.addEventListener("pointerup", this.#alSoltar);
  }

  #alPresionar = (e) => {
    this.#inicioClic = { x: e.clientX, y: e.clientY };
  };

  #alSoltar = (e) => {
    const inicio = this.#inicioClic;
    if (!inicio || e.button !== 0 || Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) > 6) return;
    const r = this.#renderer.domElement.getBoundingClientRect();
    this.#puntero.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.#raycaster.setFromCamera(this.#puntero, this.#camara);
    const golpe = this.#raycaster.intersectObjects(this.#seleccionables, false)[0];
    const id = golpe?.object.userData.estacionamientoId;
    if (id) this.#disparar({ tipo: "SELECCIONAR", estacionamientoId: id });
  };

  // Lleva la cámara a un estacionamiento (selección en el menú o una incidencia nueva).
  #enfocar(id) {
    const estacionamiento = this.#estacionamientos[id];
    if (estacionamiento) this.#enfoque = { objetivo: estacionamiento.objetivo(), tiempo: 0 };
  }

  #redimensionar() {
    const w = this.#contenedor.clientWidth;
    const h = this.#contenedor.clientHeight;
    if (w === 0 || h === 0) return;
    this.#camara.aspect = w / h;
    this.#camara.updateProjectionMatrix();
    this.#renderer.setSize(w, h);
  }

  // Bucle de animación: un cuadro.
  #animar = (marcaDeTiempo) => {
    this.#cuadro = requestAnimationFrame(this.#animar);
    this.#timer.update(marcaDeTiempo);
    const delta = Math.min(this.#timer.getDelta(), 0.25);
    this.#reloj += delta;
    const reloj = this.#reloj;

    // Órdenes nuevas
    const cola = this.#estado.tomarPendientes();
    for (const comando of cola) if (comando.tipo === "ENFOCAR") this.#enfocar(comando.estacionamientoId);
    this.#trafico.procesar(cola.filter((c) => c.tipo === "ENTRADA" || c.tipo === "SALIDA"));

    this.#trafico.actualizar(delta, reloj);
    this.#garita.actualizar(delta, this.#trafico.talanqueraAbierta(), reloj, this.#camara);
    this.#moverCamara(delta);

    // Carteles, etiquetas y marcadores: tamaño según la distancia, para leerse siempre
    const pulso = 0.55 + 0.45 * Math.sin(reloj * 5);
    const parpadeo = Math.sin(reloj * 9) > 0;
    for (const e of Object.values(this.#estacionamientos)) e.actualizar(this.#camara, reloj, pulso, parpadeo);
    this.#etiquetas.actualizar(this.#camara);
    this.#trafico.actualizarMarcadores(this.#camara, reloj);

    // Brújula: gira con la cámara
    const brujula = this.#brujula();
    if (brujula) brujula.style.transform = `rotate(${THREE.MathUtils.radToDeg(this.#controles.getAzimuthalAngle())}deg)`;

    this.#renderer.render(this.#escena, this.#camara);
  };

  // Primero un enfoque pedido; si no, seguir al último carro sin cambiar el ángulo.
  #moverCamara(delta) {
    const camara = this.#camara;
    const controles = this.#controles;
    const v = this.#vectorTemporal;
    const k = 1 - Math.exp(-delta * 3);
    const acercar = (objetivo, distanciaMaxima) => {
      v.copy(objetivo).sub(controles.target).multiplyScalar(k);
      controles.target.add(v);
      camara.position.add(v);
      const distancia = camara.position.distanceTo(controles.target);
      const deseada = Math.min(distancia, distanciaMaxima);
      v.copy(camara.position).sub(controles.target).setLength(distancia + (deseada - distancia) * k);
      camara.position.copy(controles.target).add(v);
    };
    const seguido = this.#trafico.seguido();
    if (this.#enfoque && this.#enfoque.tiempo < 2.5) {
      this.#enfoque.tiempo += delta;
      acercar(this.#enfoque.objetivo, 320);
    } else if (this.#estado.seguir && seguido) {
      acercar(seguido.malla.position, seguido.tiempo < 2.5 ? 240 : Infinity);
    }
    controles.update();
  }
}
