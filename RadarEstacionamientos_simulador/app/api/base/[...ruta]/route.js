// Puente entre el navegador del simulador y la app base. El simulador NO toca la app por
// dentro: todo pasa por la misma API pública que usarían los sensores, el lector de placas
// o un usuario. La clave de los sensores se agrega aquí, en el servidor, para que nunca
// llegue al navegador.

export const dynamic = "force-dynamic";

const URL_APP_BASE = process.env.URL_APP_BASE ?? "http://localhost:3000";
const CLAVE_SENSORES = process.env.CLAVE_SENSORES ?? "clave-de-desarrollo";

// Solo estas rutas de la app base; el puente no reenvía cualquier cosa.
const RUTAS = [
  { patron: /^estacionamientos$/, metodos: ["GET"] },
  { patron: /^estacionamientos\/[a-z0-9-]+$/, metodos: ["PATCH"] },
  { patron: /^incidencias$/, metodos: ["GET", "POST"] },
  { patron: /^avisos$/, metodos: ["POST"], sensor: true },
  { patron: /^garita\/lecturas$/, metodos: ["POST"], sensor: true },
  { patron: /^eventos$/, metodos: ["GET"] },
  { patron: /^pruebas\/reiniciar$/, metodos: ["POST"] },
];

async function reenviar(request, { params }) {
  const camino = (await params).ruta.join("/");
  const ruta = RUTAS.find((r) => r.patron.test(camino) && r.metodos.includes(request.method));
  if (!ruta) return Response.json({ error: `Ruta no permitida: ${request.method} /api/${camino}` }, { status: 404 });

  const encabezados = { "content-type": "application/json" };
  if (ruta.sensor) encabezados["x-clave-sensor"] = CLAVE_SENSORES;

  try {
    const respuesta = await fetch(new URL(`/api/${camino}`, URL_APP_BASE), {
      method: request.method,
      headers: encabezados,
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
    return Response.json({ error: `No se pudo conectar con la app base en ${URL_APP_BASE}.` }, { status: 502 });
  }
}

export { reenviar as GET, reenviar as POST, reenviar as PATCH };
