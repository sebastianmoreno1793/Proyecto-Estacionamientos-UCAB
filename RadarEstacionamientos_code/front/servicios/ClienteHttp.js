// Servicio · Clase base de los servicios del front: hablan con el back SOLO por fetch, a las mismas
// URL /api/... que usan Postman y el simulador. Envía y recibe JSON. La cookie de sesión la manda el
// navegador sola (same-origin). Nunca lanza por un error HTTP: devuelve { ok, estado, datos, error }.
export class ClienteHttp {
  #base;
  #encabezados;

  // base: "" en el navegador; la URL de la app cuando corre en el servidor (middleware).
  // encabezados: por ejemplo { cookie } en el middleware.
  constructor({ base = "", encabezados = {} } = {}) {
    this.#base = base;
    this.#encabezados = encabezados;
  }

  get(ruta) {
    return this.pedir("GET", ruta);
  }

  post(ruta, cuerpo) {
    return this.pedir("POST", ruta, cuerpo);
  }

  patch(ruta, cuerpo) {
    return this.pedir("PATCH", ruta, cuerpo);
  }

  delete(ruta) {
    return this.pedir("DELETE", ruta);
  }

  // [fetch] Hace la petición y devuelve { ok, estado, datos, error }. Sin conexión: estado 0.
  async pedir(metodo, ruta, cuerpo) {
    try {
      const respuesta = await fetch(`${this.#base}${ruta}`, {
        method: metodo,
        cache: "no-store",
        credentials: "same-origin",
        headers: { ...(cuerpo === undefined ? {} : { "content-type": "application/json" }), ...this.#encabezados },
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      });
      const datos = await respuesta.json().catch(() => ({}));
      return { ok: respuesta.ok, estado: respuesta.status, datos, error: respuesta.ok ? null : (datos.error ?? "Algo salió mal. Inténtalo de nuevo.") };
    } catch {
      return { ok: false, estado: 0, datos: {}, error: "No hay conexión con el Radar. Revisa tu internet e inténtalo de nuevo." };
    }
  }
}
