// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Crea la cuenta, entra, sale y dice quién está conectado (pone y borra la cookie)
// Controlador · Cuenta y sesión.
//   POST   /api/cuenta   { "correo", "contrasena" }   crea la cuenta y abre la sesión (201)
//   GET    /api/sesion                                 el usuario conectado (200) o 401
//   POST   /api/sesion   { "correo", "contrasena" }   entra (200)
//   DELETE /api/sesion                                 sale (200)
import { Controlador } from "./Controlador.js";
import { CredencialesDTO } from "../dto/CredencialesDTO.js";
import { UsuarioDTO } from "../dto/UsuarioDTO.js";
import { Sesion } from "../modelos/Sesion.js";
import { ControlDeAcceso } from "../tacticas/ControlDeAcceso.js";

export class CuentaControlador extends Controlador {
  #acceso;
  #servicio;

  constructor({ controlDeAcceso, cuentaServicio }) {
    super();
    this.#acceso = controlDeAcceso;
    this.#servicio = cuentaServicio;
  }

  estadosPorMotivo() {
    return { ya_existe: 409, solo_ucab: 400, incorrectos: 401 };
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel — crea la cuenta y abre la sesión
  // POST /api/cuenta · Responde 201, 400 o 409. [api] [postman] [sesion]
  async crearCuenta(peticion) {
    const cuerpo = await this.leerCuerpo(peticion);
    if (!cuerpo) return this.cuerpoInvalido();
    return this.atender(async () => {
      const usuario = await this.#servicio.registrar(CredencialesDTO.desdeCuerpo(cuerpo));
      return this.#conSesion(usuario, 201);
    });
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel
  // POST /api/sesion · Responde 200 o 401. [api] [postman] [sesion]
  async entrar(peticion) {
    const cuerpo = await this.leerCuerpo(peticion);
    if (!cuerpo) return this.cuerpoInvalido();
    return this.atender(async () => this.#conSesion(await this.#servicio.comprobar(CredencialesDTO.desdeCuerpo(cuerpo)), 200));
  }

  // GET /api/sesion · Responde 200 { usuario } o 401. [api] [sesion]
  async sesionActual(peticion) {
    const usuario = await this.#acceso.usuarioDe(peticion);
    if (!usuario) return this.sinSesion("No has iniciado sesión.");
    return this.responder({ usuario: UsuarioDTO.desdeModelo(usuario) });
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel
  // DELETE /api/sesion · Cierra la sesión y borra la cookie. Responde 200. [api] [sesion]
  async salir(peticion) {
    await this.#servicio.cerrarSesion(ControlDeAcceso.codigoDe(peticion));
    return this.responder({ ok: true }, 200, { "Set-Cookie": this.#cookie("", 0) });
  }

  async #conSesion(usuario, estado) {
    const codigo = await this.#servicio.abrirSesion(usuario);
    return this.responder({ usuario: UsuarioDTO.desdeModelo(usuario) }, estado, { "Set-Cookie": this.#cookie(codigo) });
  }

  // Cookie httpOnly: el JavaScript del navegador no la puede leer.
  #cookie(valor, maxAge = null) {
    const partes = [`${Sesion.COOKIE}=${valor}`, "Path=/", "HttpOnly", "SameSite=Lax"];
    if (maxAge !== null) partes.push(`Max-Age=${maxAge}`);
    if (process.env.NODE_ENV === "production") partes.push("Secure");
    return partes.join("; ");
  }
}
