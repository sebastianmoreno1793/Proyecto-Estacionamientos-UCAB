// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Entrega la ocupación y el semáforo de cada estacionamiento (GET)
// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Con su forma para dibujarlos (GET)
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Recibe el cambio de capacidad o estado (PATCH, solo administrador)
// Controlador · Estacionamientos.
//   GET   /api/estacionamientos
//   PATCH /api/estacionamientos/est-labs   { "capacidad": 40, "activo": false }   (lo que no se envía se queda igual)
import { Controlador } from "./Controlador.js";
import { EstacionamientoDTO } from "../dto/EstacionamientoDTO.js";

export class EstacionamientoControlador extends Controlador {
  #acceso;
  #servicio;

  constructor({ controlDeAcceso, estacionamientoServicio }) {
    super();
    this.#acceso = controlDeAcceso;
    this.#servicio = estacionamientoServicio;
  }

  // @HU-4.2 Consultar el semáforo de ocupación · Aaron
  // @HU-5.1 Consultar los estacionamientos en el mapa del campus · German
  // GET /api/estacionamientos · Responde 200. [api] [postman] [simulador]
  async listar() {
    return this.responder({ estacionamientos: await this.#servicio.listar() });
  }

  // @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
  // PATCH /api/estacionamientos/:id · Responde 200, 400, 403 o 404. [api] [postman] [simulador] [en-vivo]
  async cambiar(peticion, { params }) {
    if (!this.#acceso.esAdministrador(await this.#acceso.usuarioDe(peticion))) {
      return this.sinPermiso("Solo el administrador puede cambiar los estacionamientos.");
    }
    const { id } = await params;
    const cuerpo = await this.leerCuerpo(peticion);
    if (!cuerpo) return this.cuerpoInvalido();
    return this.atender(async () =>
      this.responder({ estacionamiento: await this.#servicio.cambiar(id, EstacionamientoDTO.cambiosDesdeCuerpo(cuerpo)) }),
    );
  }
}
