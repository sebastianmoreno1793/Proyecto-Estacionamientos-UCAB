// Piezas3D · Geometrías y objetos de Three.js que se repiten en la maqueta: losas, cintas,
// conos y carros. Los polígonos llegan en metros ({ x, z }, ver mapa_3d/Coordenadas.js).
import * as THREE from "three";
import { Medidas3D } from "./Medidas3D.js";

export class Piezas3D {
  // Polígono en metros → forma de Three.js. La forma vive en el plano XY y se acuesta con
  // rotateX(−π/2), que manda y → −z; por eso se usa −z (si no, el mapa sale espejado N-S).
  static forma(pts) {
    return new THREE.Shape(pts.map((p) => new THREE.Vector2(p.x, -p.z)));
  }

  // Bloque con la forma del polígono, de la altura `abajo` a la altura `arriba`.
  static losa(pts, abajo, arriba) {
    const geo = new THREE.ExtrudeGeometry(Piezas3D.forma(pts), { depth: arriba - abajo, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, abajo, 0);
    return geo;
  }

  // Geometría a partir de listas de posiciones, índices y (opcional) colores por vértice.
  static geometria({ posiciones, indices, colores }) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(posiciones, 3));
    if (colores) geo.setAttribute("color", new THREE.Float32BufferAttribute(colores, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  // Suaviza una polilínea (curvas sin ángulos de 90°) y la remuestrea cada `paso` metros.
  static suavizar(pts, paso) {
    const limpios = pts.filter((p, i) => i === 0 || Math.hypot(p.x - pts[i - 1].x, p.z - pts[i - 1].z) > 0.4);
    if (limpios.length < 2) return limpios;
    const curva = new THREE.CatmullRomCurve3(
      limpios.map((p) => new THREE.Vector3(p.x, 0, p.z)),
      false,
      "centripetal",
    );
    const n = Math.max(2, Math.ceil(curva.getLength() / paso));
    return curva.getSpacedPoints(n).map((v) => ({ x: v.x, z: v.z }));
  }

  // Carro sencillo (carrocería + cabina) para incidencias; mira hacia +x.
  static carroSimple(color) {
    const grupo = new THREE.Group();
    const carroceria = new THREE.Mesh(new THREE.BoxGeometry(4.3, 1, 1.8), new THREE.MeshStandardMaterial({ color, roughness: 0.4 }));
    carroceria.position.y = 0.75;
    const cabina = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 1.6), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 }));
    cabina.position.set(-0.2, 1.55, 0);
    carroceria.castShadow = true;
    grupo.add(carroceria, cabina);
    return grupo;
  }

  // Cono de tránsito.
  static cono() {
    const grupo = new THREE.Group();
    const cuerpo = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.85, 14), new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 }));
    cuerpo.position.y = 0.45;
    const franja = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 0.14, 14), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
    franja.position.y = 0.5;
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.7), new THREE.MeshStandardMaterial({ color: 0x1f2937 }));
    base.position.y = 0.03;
    cuerpo.castShadow = true;
    grupo.add(cuerpo, franja, base);
    return grupo;
  }

  // Carro estilizado que recorre las vías, con un marcador flotante para verlo desde lejos.
  // children[0] es el chasis (su color cambia por carro); userData.marcador, el marcador.
  static carro(color = 0x2563eb) {
    const carro = new THREE.Group();

    const chasis = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 1.4), new THREE.MeshStandardMaterial({ color, roughness: 0.3 }));
    chasis.position.y = 0.45;
    chasis.castShadow = true;
    carro.add(chasis);

    const cabina = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 1.2), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 }));
    cabina.position.set(-0.2, 0.9, 0);
    cabina.castShadow = true;
    carro.add(cabina);

    const parabrisas = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.4), new THREE.MeshBasicMaterial({ color: 0x93c5fd }));
    parabrisas.position.set(0.56, 0.88, 0);
    parabrisas.rotation.y = Math.PI / 2;
    carro.add(parabrisas);

    const faroDer = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.25), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    faroDer.position.set(1.3, 0.5, 0.45);
    carro.add(faroDer);
    const faroIzq = faroDer.clone();
    faroIzq.position.z = -0.45;
    carro.add(faroIzq);

    const geoRueda = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 16);
    const matRueda = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    for (const [x, y, z] of [
      [0.8, 0.28, 0.72],
      [-0.8, 0.28, 0.72],
      [0.8, 0.28, -0.72],
      [-0.8, 0.28, -0.72],
    ]) {
      const rueda = new THREE.Mesh(geoRueda, matRueda);
      rueda.rotation.x = Math.PI / 2;
      rueda.position.set(x, y, z);
      rueda.castShadow = true;
      carro.add(rueda);
    }

    const marcador = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 1.6, 4),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.9 }),
    );
    marcador.rotation.x = Math.PI;
    marcador.position.y = 4;
    carro.add(marcador);
    carro.userData.marcador = marcador;

    carro.scale.setScalar(Medidas3D.ESCALA_CARRO);
    carro.rotation.order = "YXZ";
    return carro;
  }

  // Libera la memoria de la GPU de un objeto y sus hijos.
  static liberar(objeto) {
    objeto.traverse((o) => {
      o.geometry?.dispose();
      const materiales = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of materiales) {
        m.map?.dispose();
        m.dispose();
      }
    });
  }
}
