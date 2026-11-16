// Texturas3D · Texturas dibujadas en un canvas 2D para poner texto nítido en el mundo 3D.
import * as THREE from "three";
import { Medidas3D } from "./Medidas3D.js";

export class Texturas3D {
  // Cartel del semáforo de un estacionamiento: nombre, libres y % de ocupación.
  static cartel(nombre, libres, porcentaje) {
    const { canvas, ctx } = Texturas3D.#lienzo(512, 256);
    ctx.fillStyle = "#1e293b";
    ctx.roundRect ? ctx.roundRect(0, 0, 512, 256, 24) : ctx.fillRect(0, 0, 512, 256);
    ctx.fill();

    const colorHex = libres > 0 ? "#2f9e57" : "#d93a2e"; // D-009: hay o no hay puesto
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 12;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(nombre, 256, 75);

    ctx.fillStyle = colorHex;
    ctx.font = "bold 68px sans-serif";
    ctx.fillText(`${libres} libres`, 256, 160);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "32px sans-serif";
    ctx.fillText(`${porcentaje}% ocupación`, 256, 215);

    const textura = new THREE.CanvasTexture(canvas);
    textura.needsUpdate = true;
    textura.colorSpace = THREE.SRGBColorSpace;
    return textura;
  }

  // Cartel de un estacionamiento sin semáforo (desactivado por el administrador).
  static cartelEstado(nombre, titulo, detalle) {
    const { canvas, ctx } = Texturas3D.#lienzo(512, 256);
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(0, 0, 512, 256, 24) : ctx.rect(0, 0, 512, 256);
    ctx.fill();
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 12;
    ctx.setLineDash([28, 18]);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText(nombre, 256, 75);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText(titulo, 256, 158);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "30px sans-serif";
    ctx.fillText(detalle, 256, 213);
    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;
    return textura;
  }

  // Etiqueta de texto (nombres de edificios, garita, incidencias, placa leída). → { textura, aspecto }
  static etiqueta(texto, { color = "#f8fafc", fondo = "rgba(15, 23, 42, 0.82)", borde = null } = {}) {
    const alto = 64;
    const medidor = document.createElement("canvas").getContext("2d");
    medidor.font = "bold 34px sans-serif";
    const ancho = Math.ceil(medidor.measureText(texto).width) + 36;
    const { canvas, ctx } = Texturas3D.#lienzo(ancho, alto);
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
  static ventanas() {
    const { canvas, ctx } = Texturas3D.#lienzo(128, 64);
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
    textura.repeat.set(1 / 6, 1 / Medidas3D.ALTO_PISO);
    textura.offset.set(0, -1 / Medidas3D.ALTO_PISO);
    return textura;
  }

  static #lienzo(ancho, alto) {
    const canvas = document.createElement("canvas");
    canvas.width = ancho;
    canvas.height = alto;
    return { canvas, ctx: canvas.getContext("2d") };
  }
}
