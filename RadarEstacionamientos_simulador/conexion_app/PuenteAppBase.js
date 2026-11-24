// PuenteAppBase · Puente entre el navegador del simulador y la app base (corre en el servidor).
// El simulador NO toca la app por dentro: todo pasa por la misma API pública que usarían los
// sensores, el lector de placas o un usuario. La clave de los sensores se agrega aquí, en el
// servidor, para que nunca llegue al navegador. Lo que hace una persona (incidencias,
// administración, reinicio) va con la sesión de quien entró a la app en este navegador (HU 1.1):
// las cookies no distinguen puerto, así que la de localhost:3000 también llega aquí, y se reenvía tal cual.
export class PuenteAppBase {
  static COOKIE_SESION = "radar_sesion";

  // Solo estas rutas de la app base; el puente no reenvía cualquier cosa.
  static RUTAS = [
    { patron: /^estacionamientos$/, metodos: ["GET"] },
    { patron: /^estacionamientos\/[a-z0-9-]+$/, metodos: ["PATCH"] },
    { patron: /^incidencias$/, metodos: ["GET", "POST"] },
    { patron: /^avisos$/, metodos: ["POST"], sensor: true },
    { patron: /^garita\/lecturas$/, metodos: ["POST"], sensor: true },
    { patron: /^eventos$/, metodos: ["GET"] },
    { patron: /^pruebas\/reiniciar$/, metodos: ["POST"] },
  ];

  #urlAppBase;
  #claveSensores;

  constructor({
    urlAppBase = process.env.URL_APP_BASE ?? "http://localhost:3000",
    claveSensores = process.env.CLAVE_SENSORES ?? "clave-de-desarrollo",
  } = {}) {
    this.#urlAppBase = urlAppBase;
    this.#claveSensores = claveSensores;
  }

  // Reenvía a la app la petición de /api/base/<ruta> y devuelve su respuesta tal cual.
  async reenviar(request, { params }) {
    const camino = (await params).ruta.join("/");
    const ruta = PuenteAppBase.RUTAS.find((r) => r.patron.test(camino) && r.metodos.includes(request.method));
    if (!ruta) return Response.json({ error: `Ruta no permitida: ${request.method} /api/${camino}` }, { status: 404 });

    // Solo la página del propio simulador puede usar el puente. Si no, cualquier sitio abierto en el
    // navegador podría mandar avisos falsos firmados con la clave de los sensores.
    const sitio = request.headers.get("sec-fetch-site");
    if (sitio && sitio !== "same-origin") {
      return Response.json({ error: "Origen no permitido." }, { status: 403 });
    }

    try {
      // @FETCH Simulador › puente /api/base/… → app — reenvía a la app (puerto 3000) lo que pide el simulador
      const respuesta = await fetch(new URL(`/api/${camino}`, this.#urlAppBase), {
        method: request.method,
        headers: this.#encabezados(request, ruta),
        body: request.method === "GET" ? undefined : await request.text(),
        cache: "no-store",
        signal: request.signal,
      });
      // El cuerpo se pasa tal cual: también sirve para el canal en vivo (text/event-stream).
      return new Response(respuesta.body, {
        status: respuesta.status,
        headers: {
          "content-type": respuesta.headers.get("content-type") ?? "application/json",
          "cache-control": "no-cache, no-transform",
        },
      });
    } catch {
      // Si la app base no responde, el canal en vivo pide reintentar en 3 s (EventSource lo hace solo).
      // Con un 502 en JSON, el navegador cerraría el canal para siempre.
      if (camino === "eventos") {
        return new Response("retry: 3000\n\n", {
          headers: { "content-type": "text/event-stream", "cache-control": "no-cache" },
        });
      }
      return Response.json({ error: `No se pudo conectar con la app base en ${this.#urlAppBase}.` }, { status: 502 });
    }
  }

  // Los sensores van con su clave; lo demás, con la sesión de la persona (si la hay).
  #encabezados(request, ruta) {
    const encabezados = { "content-type": "application/json" };
    if (ruta.sensor) encabezados["x-clave-sensor"] = this.#claveSensores;
    else {
      const sesion = this.#sesionDe(request);
      if (sesion) encabezados.cookie = sesion;
    }
    return encabezados;
  }

  // Solo la cookie de sesión del Radar, no las de otros proyectos que corran en localhost.
  #sesionDe(request) {
    return (request.headers.get("cookie") ?? "")
      .split(/;\s*/)
      .filter((c) => c.startsWith(`${PuenteAppBase.COOKIE_SESION}=`))
      .join("; ");
  }
}
