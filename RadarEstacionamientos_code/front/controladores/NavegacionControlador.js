// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Antes de mostrar una pantalla, revisa que haya sesión (y rol de administrador en /admin)
// Controlador (front) · Navegación. Lo usa front/middleware.js antes de cada pantalla: pregunta al
// back quién es el usuario (fetch GET /api/sesion con la cookie) y redirige si hace falta.
//   sin sesión → /entrar · con sesión en /entrar o /registro → / · /admin sin ser administrador → /perfil
import { CuentaServicio } from "../servicios/CuentaServicio.js";

export class NavegacionControlador {
  static PUBLICAS = ["/entrar", "/registro"];

  #servicio;

  // base: la URL de la app · cookie: el encabezado Cookie de la petición
  constructor({ base, cookie = "" }) {
    this.#servicio = new CuentaServicio({ base, encabezados: cookie ? { cookie } : {} });
  }

  // Dice si una pestaña queda marcada: la de la ruta exacta; además Perfil para todo /admin
  // (administración) e Inicio para /sugerencia, que es parte del Inicio. La usa Pestanas.
  static estaActiva(href, ruta) {
    if (ruta === href) return true;
    if (href === "/") return ruta === "/sugerencia";
    if (href === "/perfil") return ruta.startsWith("/admin");
    return false;
  }

  // Devuelve la ruta a la que hay que redirigir, o null si puede ver la pantalla.
  async redirigeA(ruta) {
    const sesion = await this.#servicio.sesionActual();
    const publica = NavegacionControlador.PUBLICAS.includes(ruta);
    if (!sesion) return publica ? null : "/entrar";
    if (publica) return "/";
    if (ruta.startsWith("/admin") && !sesion.esAdministrador()) return "/perfil";
    return null;
  }
}
