// TexturasDeMaqueta · Texturas hechas a mano (canvas) con el acabado de una maqueta física:
// grama de fieltro, asfalto claro, adoquín, teja, concreto y fachadas.
import * as THREE from "three";
import { Aleatorio } from "@/mapa_3d/Aleatorio";

export class TexturasDeMaqueta {
  static ALTO_PISO = 3.5;

  // Todas las texturas de la maqueta (siempre iguales: semilla fija).
  static crear() {
    const a = new Aleatorio(7);
    const ruido = (base, manchas, cuantas, radio) => (c, t) => TexturasDeMaqueta.#ruido(c, t, base, manchas, cuantas, radio, a);
    const t = TexturasDeMaqueta.#repetida;
    return {
      grama: t(ruido("#86b25f", ["#7aa755", "#93bd69", "#6f9e4c", "#9cc471"], 2600, 1.6), 256, 16),
      gramaJardin: t(ruido("#93c06a", ["#a5cc78", "#86b35f", "#b3d486"], 2200, 1.6), 256, 14),
      afuera: t(ruido("#b3b38a", ["#adae84", "#b9b991", "#a8aa80"], 1800, 2.4), 256, 40),
      asfalto: t(ruido("#a7a9ab", ["#9ea0a3", "#b0b2b4", "#999b9e"], 2400, 1), 256, 12),
      asfaltoEstacionamiento: t(ruido("#8f9396", ["#878b8f", "#979a9d", "#82868a"], 2400, 1), 256, 12),
      adoquin: t(TexturasDeMaqueta.#adoquin, 256, 8),
      teja: t(TexturasDeMaqueta.#teja, 128, 6),
      concreto: t(ruido("#ece6da", ["#e4ddd0", "#f2ede3", "#ddd5c6"], 900, 2), 256, 18),
      pared: TexturasDeMaqueta.#pared(),
      paredParqueo: TexturasDeMaqueta.#paredParqueo(),
    };
  }

  // Textura cuadrada que se repite cada `metros` metros.
  static #repetida(dibujar, tam = 256, metros = 20) {
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

  // Fondo de un color con manchas al azar (fieltro, asfalto, concreto).
  static #ruido(ctx, tam, base, manchas, cuantas, radio, aleatorio) {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, tam, tam);
    for (let i = 0; i < cuantas; i++) {
      ctx.fillStyle = manchas[Math.floor(aleatorio.siguiente() * manchas.length)];
      const r = radio * (0.4 + aleatorio.siguiente());
      ctx.beginPath();
      ctx.arc(aleatorio.siguiente() * tam, aleatorio.siguiente() * tam, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  static #adoquin(c, t) {
    c.fillStyle = "#e8dcc4";
    c.fillRect(0, 0, t, t);
    c.strokeStyle = "rgba(150, 125, 90, 0.35)";
    c.lineWidth = 2;
    for (let i = 0; i <= t; i += t / 8) {
      c.beginPath();
      c.moveTo(i, 0);
      c.lineTo(i, t);
      c.stroke();
      c.beginPath();
      c.moveTo(0, i);
      c.lineTo(t, i);
      c.stroke();
    }
  }

  static #teja(c, t) {
    c.fillStyle = "#c9764d";
    c.fillRect(0, 0, t, t);
    for (let y = 0; y < t; y += 16) {
      c.fillStyle = y % 32 ? "#bf6c44" : "#d38359";
      c.fillRect(0, y, t, 9);
      c.fillStyle = "rgba(90, 40, 20, 0.25)";
      c.fillRect(0, y + 14, t, 2);
    }
  }

  // Fachada con ventanas (un módulo = 7 m × 1 piso).
  static #pared() {
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
    t.repeat.set(1 / 7, 1 / TexturasDeMaqueta.ALTO_PISO);
    return t;
  }

  // Fachada de un edificio de estacionamiento (franjas abiertas).
  static #paredParqueo() {
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
  }
}
