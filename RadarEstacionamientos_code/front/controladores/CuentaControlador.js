// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Control de Crear cuenta, Entrar y Salir: valida, llama a la API y lleva al mapa
// Controlador (front) · Cuenta.
//   FormularioCuenta → registrarse()/entrar() → valida (CuentaValidador) → CuentaServicio (fetch) → redirige a /mapa
import { Controlador } from "./Controlador.js";
import { CuentaDTO } from "../dto/CuentaDTO.js";
import { CuentaServicio } from "../servicios/CuentaServicio.js";
import { CuentaValidador } from "../validadores/CuentaValidador.js";

export class CuentaControlador extends Controlador {
  #servicio;

  constructor({ navegador, servicio = new CuentaServicio() } = {}) {
    super({ navegador });
    this.#servicio = servicio;
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel — CA1: crea la cuenta, abre la sesión y va al mapa
  async registrarse(formulario) {
    return this.#enviar("registro", formulario, (dto) => this.#servicio.crear(dto));
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel — HU 5.1 CA1: con sesión ve el mapa del campus
  async entrar(formulario) {
    return this.#enviar("entrar", formulario, (dto) => this.#servicio.entrar(dto));
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel — botón Salir de Perfil
  async salir() {
    await this.#servicio.salir();
    return this.redirige("/entrar");
  }

  // La SesionUsuario de quien usa la app, o null.
  sesion() {
    return this.#servicio.sesionActual();
  }

  async #enviar(modo, formulario, llamar) {
    const datos = this.leer(formulario);
    const validacion = this.valida(new CuentaValidador(modo), datos);
    if (!validacion.valido) return this.muestra("MensajeDatosNoValidos", { error: validacion.error, errores: validacion.errores, correo: datos.correo });

    const r = await llamar(new CuentaDTO(validacion.datos));
    if (!r.ok) return this.muestra("MensajeDatosNoValidos", { error: r.error, correo: datos.correo });
    return this.redirige("/mapa");
  }
}
