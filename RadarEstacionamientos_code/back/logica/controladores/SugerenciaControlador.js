// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Recibe el edificio y responde el estacionamiento sugerido
// Controlador · Sugerencia.
//   GET /api/sugerencia?edificio=edif-aulas
//   200 → { edificio, sugerido: { id, nombre, libres, capacidad, distancia }, alternativas: [...] }
//   404 → el edificio no existe · 409 → sin ubicación, o todo lleno o cerrado
// No pide sesión: como el mapa, solo muestra datos públicos (sin placas ni correos).
import { Controlador } from "./Controlador.js";

export class SugerenciaControlador extends Controlador {
  #servicio;

  constructor({ sugerenciaServicio }) {
    super();
    this.#servicio = sugerenciaServicio;
  }

  estadosPorMotivo() {
    return { no_existe: 404, sin_ubicacion: 409, sin_puestos: 409 };
  }

  // @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
  // GET /api/sugerencia?edificio=<id> · Responde 200, 404 o 409. [api] [postman]
  async sugerir(peticion) {
    const edificio = new URL(peticion.url).searchParams.get("edificio");
    return this.atender(async () => this.responder(await this.#servicio.sugerir(edificio)));
  }
}
