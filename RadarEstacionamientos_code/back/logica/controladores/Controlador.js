// Controlador · Clase base de los controladores del back. Un controlador recibe la petición que le
// pasa la ruta (front/app/api/**/route.js), revisa la PRECONDICIÓN con las tácticas, arma el DTO,
// llama al servicio y responde con el código HTTP. NO valida los datos: eso lo hace el front.
import { ErrorDeNegocio } from "../modelos/ErrorDeNegocio.js";

export class Controlador {
  // Código HTTP según el motivo del ErrorDeNegocio. Cada controlador agrega los suyos.
  estadosPorMotivo() {
    return { no_existe: 404 };
  }

  // El cuerpo JSON de la petición si es un objeto; si no, null.
  async leerCuerpo(peticion) {
    const cuerpo = await peticion.json().catch(() => null);
    return cuerpo && typeof cuerpo === "object" && !Array.isArray(cuerpo) ? cuerpo : null;
  }

  responder(datos, estado = 200, encabezados = {}) {
    return Response.json(datos, { status: estado, headers: encabezados });
  }

  error(estado, mensaje, extra = {}) {
    return this.responder({ error: mensaje, ...extra }, estado);
  }

  cuerpoInvalido() {
    return this.error(400, "El cuerpo debe ser un objeto JSON.");
  }

  // Precondición no cumplida: sin sesión (401) o sin permiso de administrador (403).
  sinSesion(mensaje = "Inicia sesión para continuar.") {
    return this.error(401, mensaje);
  }

  sinPermiso(mensaje = "Solo el administrador puede hacer esto.") {
    return this.error(403, mensaje);
  }

  // Ejecuta la acción y convierte un ErrorDeNegocio en su respuesta HTTP.
  async atender(accion) {
    try {
      return await accion();
    } catch (error) {
      if (!(error instanceof ErrorDeNegocio)) throw error;
      return this.error(this.estadosPorMotivo()[error.motivo] ?? 400, error.message, { motivo: error.motivo });
    }
  }
}
