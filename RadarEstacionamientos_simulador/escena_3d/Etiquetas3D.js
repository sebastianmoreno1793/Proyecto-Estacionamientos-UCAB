// Etiquetas3D · Etiquetas de texto que cambian de tamaño con la distancia para leerse siempre.
import * as THREE from "three";
import { Medidas3D } from "./Medidas3D.js";
import { Texturas3D } from "./Texturas3D.js";

export class Etiquetas3D {
  #escena;
  #lista = [];

  constructor(escena) {
    this.#escena = escena;
  }

  // Pone una etiqueta en `posicion` (THREE.Vector3). `hasta`: distancia a la que deja de verse.
  crear(texto, posicion, { factor = 0.018, min = 3.5, max = 16, hasta = 900, ...estilo } = {}) {
    const { textura, aspecto } = Texturas3D.etiqueta(texto, estilo);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: textura, transparent: true }));
    sprite.center.set(0.5, 0);
    sprite.position.copy(posicion);
    this.#escena.add(sprite);
    const etiqueta = { sprite, aspecto, factor, min, max, hasta };
    this.#lista.push(etiqueta);
    return etiqueta;
  }

  // En cada cuadro: tamaño según la distancia a la cámara.
  actualizar(camara) {
    for (const e of this.#lista) {
      const d = camara.position.distanceTo(e.sprite.position);
      e.sprite.visible = d < e.hasta;
      const alto = Medidas3D.limitar(d * e.factor, e.min, e.max);
      e.sprite.scale.set(alto * e.aspecto, alto, 1);
    }
  }
}
