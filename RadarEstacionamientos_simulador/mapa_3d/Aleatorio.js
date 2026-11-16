// Aleatorio · Números al azar. Con semilla da siempre la misma serie (así el mapa se dibuja igual
// cada vez); sin semilla usa Math.random.
export class Aleatorio {
  #estado;
  #delSistema;

  // semilla: número entero, o null para usar Math.random.
  constructor(semilla = null) {
    this.#delSistema = semilla === null;
    this.#estado = (semilla ?? 0) >>> 0;
  }

  // Uno con semilla sacada de un texto (el id de un estacionamiento, p. ej.).
  static desdeTexto(texto) {
    return new Aleatorio(Aleatorio.semillaDeTexto(texto));
  }

  // El de Math.random: cambia en cada llamada.
  static delSistema() {
    return new Aleatorio();
  }

  // Semilla estable a partir de un texto (FNV-1a).
  static semillaDeTexto(texto) {
    let h = 2166136261;
    for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return h >>> 0;
  }

  // Un número en [0, 1).
  siguiente() {
    if (this.#delSistema) return Math.random();
    this.#estado = (this.#estado + 0x6d2b79f5) >>> 0; // mulberry32
    let t = this.#estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Un entero en [0, n).
  entero(n) {
    return Math.floor(this.siguiente() * n);
  }

  // Un elemento cualquiera de la lista.
  elegir(lista) {
    return lista[this.entero(lista.length)];
  }

  // Copia de la lista en otro orden (Fisher-Yates).
  mezclar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = this.entero(i + 1);
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }
}
