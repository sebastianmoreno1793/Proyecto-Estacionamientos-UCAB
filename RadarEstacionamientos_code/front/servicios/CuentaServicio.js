// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Crea la cuenta, entra, sale y pregunta quién está conectado (fetch)
// Servicio · Cuenta y sesión: POST /api/cuenta, GET·POST·DELETE /api/sesion.
import { ClienteHttp } from "./ClienteHttp.js";
import { SesionUsuario } from "../modelos/SesionUsuario.js";

export class CuentaServicio extends ClienteHttp {
  // cuenta: CuentaDTO { correo, contrasena }
  crear(cuenta) {
    return this.post("/api/cuenta", cuenta);
  }

  entrar(cuenta) {
    return this.post("/api/sesion", cuenta);
  }

  salir() {
    return this.delete("/api/sesion");
  }

  // La SesionUsuario de quien usa la app, o null si no inició sesión.
  async sesionActual() {
    const r = await this.get("/api/sesion");
    return r.ok ? SesionUsuario.desde(r.datos.usuario) : null;
  }
}
