// Garita3D · Garita de Entrada UCAB (talanquera real de OSM, Av. Teherán): caseta, talanquera que
// sube cuando pasa un carro, semáforo y la pantalla del lector de placas.
import * as THREE from "three";
import { GARITA } from "@/datos_campus/campus";
import { Coordenadas } from "@/mapa_3d/Coordenadas";
import { Medidas3D } from "./Medidas3D.js";
import { Texturas3D } from "./Texturas3D.js";

export class Garita3D {
  static SEGUNDOS_PLACA = 3; // cuánto se ve la última placa leída

  #grupo = new THREE.Group();
  #brazo = new THREE.Group();
  #luzSemaforo;
  #lector;
  #pantalla = { aspecto: 1, hasta: 0 };

  // terreno: TerrenoDelCampus · etiquetas: Etiquetas3D
  constructor(escena, terreno, etiquetas) {
    // Tramos por la Av. Teherán antes y después de la talanquera.
    this.llegada = GARITA.llegada.map(([lat, lon]) => Coordenadas.gpsAMetros(lat, lon));
    this.salida = GARITA.salida.map(([lat, lon]) => Coordenadas.gpsAMetros(lat, lon));
    this.punto = Coordenadas.gpsAMetros(...GARITA.posicion);

    const previo = this.llegada.at(-2);
    this.#grupo.position.set(this.punto.x, terreno.alturaEn(this.punto.x, this.punto.z) + 0.16, this.punto.z);
    // El eje z local de la garita sigue la vía de entrada; la talanquera la cruza.
    this.#grupo.rotation.y = Math.atan2(this.punto.x - previo.x, this.punto.z - previo.z);
    this.#construir();
    escena.add(this.#grupo);

    etiquetas.crear(GARITA.nombre, new THREE.Vector3(this.punto.x, this.#grupo.position.y + 6, this.punto.z), {
      factor: 0.018,
      max: 16,
      hasta: 2000,
      color: "#fde68a",
      borde: "#f97316",
    });

    // Pantalla del lector de placas: muestra la última placa leída unos segundos.
    this.#lector = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true }));
    this.#lector.center.set(0.5, 0);
    this.#lector.position.set(this.punto.x, this.#grupo.position.y + 11, this.punto.z);
    this.#lector.visible = false;
    escena.add(this.#lector);
  }

  // El lector muestra la placa del carro que pasa (reloj: segundos de la escena).
  mostrarPlaca(placa, reloj) {
    const { textura, aspecto } = Texturas3D.etiqueta(`📷 ${placa}`, {
      color: "#bbf7d0",
      fondo: "rgba(6, 78, 59, 0.94)",
      borde: "#34d399",
    });
    this.#lector.material.map?.dispose();
    this.#lector.material.map = textura;
    this.#lector.material.needsUpdate = true;
    this.#lector.visible = true;
    this.#pantalla.aspecto = aspecto;
    this.#pantalla.hasta = reloj + Garita3D.SEGUNDOS_PLACA;
  }

  // En cada cuadro: la talanquera sube si `abierta`, el semáforo cambia y la placa se apaga a tiempo.
  actualizar(delta, abierta, reloj, camara) {
    this.#brazo.rotation.z = THREE.MathUtils.lerp(this.#brazo.rotation.z, abierta ? Math.PI / 2.3 : 0, 1 - Math.exp(-delta * 6));
    this.#luzSemaforo.material.color.setHex(abierta ? 0x22c55e : 0xef4444); // verde al abrir
    if (this.#lector.visible && reloj > this.#pantalla.hasta) this.#lector.visible = false;
    if (this.#lector.visible) {
      const alto = Medidas3D.limitar(camara.position.distanceTo(this.#lector.position) * 0.022, 3, 18);
      this.#lector.scale.set(alto * this.#pantalla.aspecto, alto, 1);
    }
  }

  #construir() {
    const grupo = this.#grupo;

    // Caseta de vigilancia, con ventana y techo
    const caseta = new THREE.Mesh(new THREE.BoxGeometry(2, 2.8, 2.5), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 }));
    caseta.position.set(4, 1.4, 0);
    caseta.castShadow = true;
    grupo.add(caseta);
    const ventana = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 }));
    ventana.position.set(2.98, 1.6, 0);
    ventana.rotation.y = -Math.PI / 2;
    grupo.add(ventana);
    const techoCaseta = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.25, 3.1), new THREE.MeshStandardMaterial({ color: 0x1e3a8a }));
    techoCaseta.position.set(4, 2.92, 0);
    grupo.add(techoCaseta);

    // Poste de la barrera
    const posteBarrera = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 0.4), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
    posteBarrera.position.set(2.2, 0.6, 0);
    posteBarrera.castShadow = true;
    grupo.add(posteBarrera);

    // Semáforo de la garita (rojo por defecto)
    const posteSemaforo = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    posteSemaforo.position.set(2.2, 1, 1.8);
    grupo.add(posteSemaforo);
    const cabezaSemaforo = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    cabezaSemaforo.position.set(2.2, 2.2, 1.8);
    grupo.add(cabezaSemaforo);
    this.#luzSemaforo = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    this.#luzSemaforo.position.set(2.04, 2.2, 1.8);
    grupo.add(this.#luzSemaforo);

    // Brazo móvil de la talanquera, con su pivote en el extremo y franjas rojas
    this.#brazo.position.set(2.2, 1.1, 0);
    const brazo = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.14, 0.14), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    brazo.position.set(-2.2, 0, 0);
    brazo.castShadow = true;
    this.#brazo.add(brazo);
    for (let f = -3.8; f <= -0.5; f += 0.8) {
      const franja = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.15), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      franja.position.set(f, 0, 0);
      this.#brazo.add(franja);
    }
    grupo.add(this.#brazo);
  }
}
