// Controlador · SOLO EN DESARROLLO: vuelve a los datos de ejemplo. En producción la ruta no existe (404).
//   POST /api/pruebas/reiniciar   (administrador)
import { Controlador } from "./Controlador.js";

export class PruebasControlador extends Controlador {
  #acceso;
  #servicio;

  constructor({ controlDeAcceso, pruebasServicio }) {
    super();
    this.#acceso = controlDeAcceso;
    this.#servicio = pruebasServicio;
  }

  // POST /api/pruebas/reiniciar · Responde 200, 403 o 404. [api] [postman] [simulador] [en-vivo]
  async reiniciar(peticion) {
    if (process.env.NODE_ENV === "production") return this.error(404, "No encontrado.");
    if (!this.#acceso.esAdministrador(await this.#acceso.usuarioDe(peticion))) {
      return this.sinPermiso("Solo el administrador puede reiniciar.");
    }
    return this.responder({ ok: true, estacionamientos: await this.#servicio.reiniciar() });
  }
}
