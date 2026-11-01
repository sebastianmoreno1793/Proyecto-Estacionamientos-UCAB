// Puente entre el navegador del simulador y la app base: qué encabezados le llegan a la app.
// Se corre con: npm test

import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { GET, POST } from "../app/api/base/[...ruta]/route.js";

const fetchOriginal = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

// Reemplaza fetch y devuelve lo que el puente le mandó a la app base.
function espiarAppBase() {
  const llamadas = [];
  globalThis.fetch = async (url, opciones) => {
    llamadas.push({ url: String(url), encabezados: opciones.headers });
    return Response.json({ ok: true });
  };
  return llamadas;
}

const SESION = "radar_sesion=codigo-de-prueba";

function pedido(metodo, ruta, { cookie, cuerpo } = {}) {
  const request = new Request(`http://localhost:3001/api/base/${ruta}`, {
    method: metodo,
    headers: cookie ? { cookie } : {},
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  return [request, { params: Promise.resolve({ ruta: ruta.split("/") }) }];
}

test("una incidencia lleva la sesión de quien entró a la app", async () => {
  const llamadas = espiarAppBase();
  const cuerpo = { estacionamientoId: "est-playa", tipo: "conos_atravesados" };
  await POST(...pedido("POST", "incidencias", { cookie: SESION, cuerpo }));
  assert.equal(llamadas[0].url, "http://localhost:3000/api/incidencias");
  assert.equal(llamadas[0].encabezados.cookie, SESION);
});

test("la administración y el reinicio también llevan la sesión", async () => {
  const llamadas = espiarAppBase();
  await POST(...pedido("POST", "pruebas/reiniciar", { cookie: SESION }));
  await GET(...pedido("GET", "incidencias", { cookie: SESION }));
  assert.deepEqual(
    llamadas.map((l) => l.encabezados.cookie),
    [SESION, SESION],
  );
});

test("los sensores usan su clave y no la sesión de nadie", async () => {
  const llamadas = espiarAppBase();
  const cuerpo = { estacionamientoId: "est-playa", tipo: "ENTRADA" };
  await POST(...pedido("POST", "avisos", { cookie: SESION, cuerpo }));
  assert.equal(llamadas[0].encabezados["x-clave-sensor"], "clave-de-desarrollo");
  assert.equal(llamadas[0].encabezados.cookie, undefined);
});

test("sin sesión no inventa una: la app base decide", async () => {
  const llamadas = espiarAppBase();
  await GET(...pedido("GET", "incidencias"));
  assert.equal(llamadas[0].encabezados.cookie, undefined);
});
