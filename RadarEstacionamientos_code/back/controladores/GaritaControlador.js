// @HU-3.2 Simular sensores y placas · Aaron — Recibe las placas del lector de la garita (POST) y las lista al administrador (GET)
// Controlador · Lector de placas de la garita.
//   POST /api/garita/lecturas   encabezado x-clave-sensor   { "placa": "AB123CD", "sentido": "ENTRADA", "idLectura": "opcional, único" }
//   GET  /api/garita/lecturas   (administrador) las placas son datos personales
import { Controlador } from "./Controlador.js";
import { LecturaDePlacaDTO } from "../dto/LecturaDePlacaDTO.js";

export class GaritaControlador extends Controlador {
  #autenticador;
  #acceso;
  #servicio;

  constructor({ autenticadorDeSensores, controlDeAcceso, garitaServicio }) {
    super();
    this.#autenticador = autenticadorDeSensores;
    this.#acceso = controlDeAcceso;
    this.#servicio = garitaServicio;
  }

  // @HU-3.2 Simular sensores y placas · Aaron
  // POST /api/garita/lecturas · Responde 200, 400 o 401. [api] [postman] [simulador] [en-vivo]
  async recibir(peticion) {
    if (!this.#autenticador.verificar(peticion)) {
      return this.error(401, "Falta la clave del sensor o no es válida (encabezado x-clave-sensor).");
    }
    const cuerpo = await this.leerCuerpo(peticion);
    if (!cuerpo) return this.cuerpoInvalido();
    return this.atender(async () => this.responder(await this.#servicio.registrar(LecturaDePlacaDTO.desdeCuerpo(cuerpo))));
  }

  // @HU-3.2 Simular sensores y placas · Aaron
  // GET /api/garita/lecturas · Solo el administrador. Responde 200, 401 o 403. [api] [postman]
  async listar(peticion) {
    const usuario = await this.#acceso.usuarioDe(peticion);
    if (!usuario) return this.sinSesion();
    if (!this.#acceso.esAdministrador(usuario)) return this.sinPermiso("Las placas solo las ve el personal autorizado.");
    return this.responder({ lecturas: await this.#servicio.ultimas(30) });
  }
}
