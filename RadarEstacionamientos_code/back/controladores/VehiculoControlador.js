// @HU-2.1 Registrar mis vehículos · Samuel — Lista los vehículos del usuario con sesión y registra uno nuevo
// Controlador · Vehículos («Mis vehículos» en Perfil).
//   GET  /api/vehiculos
//   POST /api/vehiculos   { "placa": "AB123CD", "marca": "Toyota", "modelo": "Corolla", "color": "Gris" }
import { Controlador } from "./Controlador.js";
import { VehiculoDTO } from "../dto/VehiculoDTO.js";

export class VehiculoControlador extends Controlador {
  #acceso;
  #servicio;

  constructor({ controlDeAcceso, vehiculoServicio }) {
    super();
    this.#acceso = controlDeAcceso;
    this.#servicio = vehiculoServicio;
  }

  estadosPorMotivo() {
    return { repetida: 409 };
  }

  // @HU-2.1 Registrar mis vehículos · Samuel — cada usuario ve solo los suyos
  // GET /api/vehiculos · Responde 200 o 401. [api] [postman] [sesion]
  async listar(peticion) {
    const usuario = await this.#acceso.usuarioDe(peticion);
    if (!usuario) return this.sinSesion("Inicia sesión para ver tus vehículos.");
    return this.responder({ vehiculos: await this.#servicio.listarDe(usuario.correo) });
  }

  // @HU-2.1 Registrar mis vehículos · Samuel
  // POST /api/vehiculos · Responde 201, 400, 401 o 409. [api] [postman] [sesion]
  async registrar(peticion) {
    const usuario = await this.#acceso.usuarioDe(peticion);
    if (!usuario) return this.sinSesion("Inicia sesión para registrar tus vehículos.");
    const cuerpo = await this.leerCuerpo(peticion);
    if (!cuerpo) return this.cuerpoInvalido();
    return this.atender(async () =>
      this.responder({ vehiculo: await this.#servicio.registrar(usuario.correo, VehiculoDTO.desdeCuerpo(cuerpo)) }, 201),
    );
  }
}
