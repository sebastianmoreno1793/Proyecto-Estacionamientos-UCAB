// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Revisa que la petición venga de alguien con sesión iniciada y con qué rol
// Táctica de SEGURIDAD · Autorizar actores. Es la PRECONDICIÓN de cada caso de uso: antes de hacer
// algo, tener la sesión iniciada (401 si no) y, para lo de administración, ser administrador (403).
// No es una validación de datos: esas están en el front. La llaman los controladores del back.
import { Sesion } from "../modelos/Sesion.js";
import { USUARIOS_DE_PRUEBA } from "../../datos/basedatos/datos_iniciales/usuarios_de_prueba.js";

export class ControlDeAcceso {
  #cuentaServicio;

  constructor(cuentaServicio) {
    this.#cuentaServicio = cuentaServicio;
  }

  // Lee el código de la cookie «radar_sesion» del encabezado Cookie (navegador, Postman o simulador).
  static codigoDe(peticion) {
    const cookies = peticion.headers.get("cookie") ?? "";
    return cookies
      .split(/;\s*/)
      .find((c) => c.startsWith(`${Sesion.COOKIE}=`))
      ?.slice(Sesion.COOKIE.length + 1);
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel
  // El usuario de la petición (modelo Usuario) o null si no inició sesión.
  async usuarioDe(peticion) {
    const codigo = ControlDeAcceso.codigoDe(peticion);
    const usuario = codigo ? await this.#cuentaServicio.usuarioDeLaSesion(codigo) : null;
    if (usuario || !ControlDeAcceso.#saltarInicioDeSesion()) return usuario;
    return this.#cuentaServicio.buscarPorCorreo(USUARIOS_DE_PRUEBA[0].correo);
  }

  // Permiso para /admin, PATCH de estacionamientos, edificios y reiniciar.
  esAdministrador(usuario) {
    return Boolean(usuario?.esAdministrador());
  }

  // Atajo de desarrollo: con SALTAR_INICIO_DE_SESION=1 en .env.local, quien no tiene sesión entra
  // como el administrador de prueba. En producción no hace nada.
  static #saltarInicioDeSesion() {
    return process.env.NODE_ENV !== "production" && process.env.SALTAR_INICIO_DE_SESION === "1";
  }
}
