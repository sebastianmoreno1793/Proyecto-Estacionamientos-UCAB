// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Recibe los avisos de los sensores (POST /api/avisos) y lista los recibidos (GET)
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Con cada aviso, actualiza el aforo; los rechazados responden 404 o 409
// Controlador · Avisos de los sensores. Es el camino de los sensores reales; el simulador y Postman
// entran por aquí igual que un sensor (D-002).
//   POST /api/avisos   encabezado x-clave-sensor   { "estacionamientoId": "est-playa", "tipo": "ENTRADA", "idAviso": "opcional" }
//   GET  /api/avisos   (administrador) últimos movimientos, avisos rechazados y estado de los sensores
import { Controlador } from "./Controlador.js";
import { AvisoDTO } from "../dto/AvisoDTO.js";

export class AvisoControlador extends Controlador {
  #autenticador;
  #acceso;
  #aforo;

  constructor({ autenticadorDeSensores, controlDeAcceso, aforoServicio }) {
    super();
    this.#autenticador = autenticadorDeSensores;
    this.#acceso = controlDeAcceso;
    this.#aforo = aforoServicio;
  }

  estadosPorMotivo() {
    return { no_existe: 404, tipo: 400, lleno: 409, vacio: 409 };
  }

  // @HU-3.1 Recibir avisos de entrada y salida · Aaron
  // @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
  // POST /api/avisos · Responde 200, 400, 401, 404 o 409. [api] [postman] [simulador] [en-vivo]
  async recibir(peticion) {
    if (!this.#autenticador.verificar(peticion)) {
      return this.error(401, "Falta la clave del sensor o no es válida (encabezado x-clave-sensor).");
    }
    const cuerpo = await this.leerCuerpo(peticion);
    if (!cuerpo) return this.cuerpoInvalido();
    return this.atender(async () => this.responder(await this.#aforo.registrar(AvisoDTO.desdeCuerpo(cuerpo))));
  }

  // @HU-3.1 Recibir avisos de entrada y salida · Aaron
  // @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
  // GET /api/avisos · Solo el administrador (Administrar › Garita). Responde 200, 401 o 403. [api] [postman]
  async listar(peticion) {
    const usuario = await this.#acceso.usuarioDe(peticion);
    if (!usuario) return this.sinSesion();
    if (!this.#acceso.esAdministrador(usuario)) return this.sinPermiso();
    const limite = 30;
    return this.responder({
      movimientos: await this.#aforo.ultimosMovimientos(limite),
      rechazados: await this.#aforo.ultimosRechazos(limite),
      sensores: await this.#aforo.estadoDeLosSensores(),
    });
  }
}
