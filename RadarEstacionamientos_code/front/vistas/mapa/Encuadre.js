// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Calcula qué parte de la maqueta se ve y con qué zoom
// Vista · Encuadre de la maqueta: cajas de puntos de la imagen y la escala y posición para que una
// caja quepa en el área visible (no decide nada del negocio). La usa MaquetaCampus.
export class Encuadre {
  static ESCALA_MAXIMA = 1.4; // la imagen mide 2400 px: más allá se ve borrosa
  static MARGEN = 16;
  static ARRIBA = 64; // espacio de la barra «Alejar · Acercar · Ver todo»

  // La caja (mínimos y máximos de x e y) que encierra una lista de puntos de la imagen.
  static cajaDe(puntos) {
    const xs = puntos.map((p) => p[0]);
    const ys = puntos.map((p) => p[1]);
    return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
  }

  // La misma caja con `aire` píxeles de más por cada lado.
  static conAire(caja, aire) {
    return { x0: caja.x0 - aire, y0: caja.y0 - aire, x1: caja.x1 + aire, y1: caja.y1 + aire };
  }

  // La escala `s` y la posición `x`, `y` para que la caja quepa en el área visible.
  // area: { ancho, alto, tapado } (tapado: lo que cubre la hoja de abajo en el celular).
  static de(caja, area) {
    const disponibleAlto = area.alto - area.tapado - Encuadre.ARRIBA;
    const s = Math.min(
      Encuadre.ESCALA_MAXIMA,
      (area.ancho - 2 * Encuadre.MARGEN) / (caja.x1 - caja.x0),
      (disponibleAlto - Encuadre.MARGEN) / (caja.y1 - caja.y0),
    );
    return {
      s,
      x: (area.ancho - (caja.x1 - caja.x0) * s) / 2 - caja.x0 * s,
      y: Encuadre.ARRIBA + (disponibleAlto - (caja.y1 - caja.y0) * s) / 2 - caja.y0 * s,
    };
  }
}
