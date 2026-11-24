// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Lista el catálogo (GET) y deja al administrador agregar, modificar y quitar
// Controlador · Edificios.
//   GET    /api/edificios
//   POST   /api/edificios        { "nombre": "Módulo 1", "ubicacion": [10.4642, -66.9762] }   (administrador)
//   PATCH  /api/edificios/:id    { "nombre", "ubicacion" }                                    (administrador)
//   DELETE /api/edificios/:id                                                                (administrador)
import { Controlador } from "./Controlador.js";
import { EdificioDTO } from "../dto/EdificioDTO.js";

export class EdificioControlador extends Controlador {
  #acceso;
  #servicio;

  constructor({ controlDeAcceso, edificioServicio }) {
    super();
    this.#acceso = controlDeAcceso;
    this.#servicio = edificioServicio;
  }

  estadosPorMotivo() {
    return { no_existe: 404, repetido: 409 };
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — la misma lista para el administrador y el usuario
  // GET /api/edificios · Responde 200. [api] [postman]
  async listar() {
    return this.responder({ edificios: await this.#servicio.listar() });
  }

  // POST /api/edificios · Responde 201, 400, 403 o 409. [api] [postman]
  async agregar(peticion) {
    return this.#comoAdministrador(peticion, async (cuerpo) =>
      this.responder({ edificio: await this.#servicio.agregar(EdificioDTO.desdeCuerpo(cuerpo)) }, 201),
    );
  }

  // PATCH /api/edificios/:id · Responde 200, 400, 403, 404 o 409. [api] [postman]
  async modificar(peticion, { params }) {
    const { id } = await params;
    return this.#comoAdministrador(peticion, async (cuerpo) =>
      this.responder({ edificio: await this.#servicio.modificar(id, EdificioDTO.desdeCuerpo(cuerpo)) }),
    );
  }

  // DELETE /api/edificios/:id · Responde 200, 403 o 404. [api] [postman]
  async quitar(peticion, { params }) {
    const { id } = await params;
    return this.#comoAdministrador(peticion, async () => this.responder({ edificio: await this.#servicio.quitar(id) }), false);
  }

  // PRECONDICIÓN: solo el administrador cambia el catálogo.
  async #comoAdministrador(peticion, accion, conCuerpo = true) {
    if (!this.#acceso.esAdministrador(await this.#acceso.usuarioDe(peticion))) {
      return this.sinPermiso("Solo el administrador puede cambiar los edificios.");
    }
    const cuerpo = conCuerpo ? await this.leerCuerpo(peticion) : {};
    if (!cuerpo) return this.cuerpoInvalido();
    return this.atender(() => accion(cuerpo));
  }
}
