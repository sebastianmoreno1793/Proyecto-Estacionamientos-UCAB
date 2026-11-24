// @HU-9.1 Crear una incidencia · Sebastian — Recibe el reporte, revisa que haya sesión y devuelve la incidencia creada
// Controlador · Incidencias.
//   GET  /api/incidencias
//   POST /api/incidencias   { "estacionamientoId": "est-playa", "tipo": "conos_atravesados" }
//   tipos: bateria_descargada · conos_atravesados · vehiculo_mal_estacionado
import { Controlador } from "./Controlador.js";
import { IncidenciaDTO } from "../dto/IncidenciaDTO.js";

export class IncidenciaControlador extends Controlador {
  #acceso;
  #servicio;

  constructor({ controlDeAcceso, incidenciaServicio }) {
    super();
    this.#acceso = controlDeAcceso;
    this.#servicio = incidenciaServicio;
  }

  estadosPorMotivo() {
    return { no_existe: 404, cerrado: 409, tipo: 400 };
  }

  // GET /api/incidencias · Sin el correo de quien reporta; pide sesión. Responde 200 o 401. [api] [postman] [simulador]
  async listar(peticion) {
    if (!(await this.#acceso.usuarioDe(peticion))) return this.sinSesion("Inicia sesión para ver las incidencias.");
    return this.responder({ incidencias: await this.#servicio.listar(), tipos: this.#servicio.tipos() });
  }

  // @HU-9.1 Crear una incidencia · Sebastian
  // POST /api/incidencias · A nombre del usuario con sesión. Responde 201, 400, 401, 404 o 409. [api] [postman] [simulador] [en-vivo]
  async crear(peticion) {
    const usuario = await this.#acceso.usuarioDe(peticion); // PRECONDICIÓN: sesión iniciada
    if (!usuario) return this.sinSesion("Inicia sesión para reportar una incidencia.");
    const cuerpo = await this.leerCuerpo(peticion);
    if (!cuerpo) return this.cuerpoInvalido();
    return this.atender(async () =>
      this.responder({ incidencia: await this.#servicio.reportar(IncidenciaDTO.desdeCuerpo(cuerpo), usuario) }, 201),
    );
  }
}
