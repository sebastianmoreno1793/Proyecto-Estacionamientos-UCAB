// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Los tres estados del semáforo: «Hay puesto», «No hay puesto» y «Cerrado» (D-009)
// Modelo · Semáforo de dos estados (D-009): verde si hay al menos un puesto libre, rojo si no hay
// ninguno. El porcentaje no decide el color. Un estacionamiento cerrado no tiene semáforo: está
// cerrado. Los colores son de la vista (front/vistas/comunes/ColoresSemaforo.js).

export class Semaforo {
  static HAY_PUESTO = new Semaforo("hay", "Hay puesto");
  static NO_HAY_PUESTO = new Semaforo("no-hay", "No hay puesto");
  static CERRADO = new Semaforo("cerrado", "Cerrado");

  #nivel;
  #texto;

  constructor(nivel, texto) {
    this.#nivel = nivel;
    this.#texto = texto;
  }

  get nivel() {
    return this.#nivel;
  }

  get texto() {
    return this.#texto;
  }

  // @HU-4.2 Consultar el semáforo de ocupación · Aaron — decide el estado con los libres, no con el porcentaje
  // REGLA DE NEGOCIO: cerrado si no está activo; si no, hay o no hay puesto según los libres.
  static segun({ libres, activo = true }) {
    if (!activo) return Semaforo.CERRADO;
    return libres > 0 ? Semaforo.HAY_PUESTO : Semaforo.NO_HAY_PUESTO;
  }

  // Lo que viaja por la API: { nivel, texto }.
  aJSON() {
    return { nivel: this.#nivel, texto: this.#texto };
  }
}
