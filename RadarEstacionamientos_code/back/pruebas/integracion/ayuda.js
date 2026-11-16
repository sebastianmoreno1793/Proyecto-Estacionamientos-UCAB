// Ayuda para las pruebas de integración: arma peticiones HTTP como las de Postman o el simulador y
// una Fábrica nueva con los datos de ejemplo. No levanta el servidor: llama directo a cada controlador.
import { AlmacenEnMemoria } from "../../basedatos/AlmacenEnMemoria.js";
import { Fabrica } from "../../Fabrica.js";

export const CLAVE_SENSOR = { "x-clave-sensor": "clave-de-desarrollo" }; // la de desarrollo (sin .env.local)

export class Ayuda {
  constructor() {
    AlmacenEnMemoria.reiniciarTodo();
    this.fabrica = new Fabrica();
  }

  peticion(ruta, metodo = "GET", cuerpo, encabezados = {}) {
    return new Request(`http://localhost${ruta}`, {
      method: metodo,
      headers: { "content-type": "application/json", ...encabezados },
      body: cuerpo === undefined ? undefined : typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo),
    });
  }

  // Entra con POST /api/sesion y devuelve el encabezado Cookie (por defecto, el administrador de prueba).
  async cookieDe(correo = "admin.prueba@ucab.edu.ve", contrasena = "123456789") {
    const r = await this.fabrica.cuentaControlador.entrar(this.peticion("/api/sesion", "POST", { correo, contrasena }));
    return { cookie: r.headers.get("set-cookie").split(";")[0] };
  }

  conId(id) {
    return { params: Promise.resolve({ id }) };
  }
}
