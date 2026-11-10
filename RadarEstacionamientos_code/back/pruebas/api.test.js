// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Prueba la API completa con peticiones reales (avisos)
// @HU-3.2 Simular sensores y placas · Aaron — Prueba la API completa con peticiones reales (lector de placas)
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Prueba la API completa con peticiones reales (aforo)
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Prueba la API completa con peticiones reales (semáforo)
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Prueba la API completa con peticiones reales (capacidad y estado)
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Prueba la API completa con peticiones reales (sugerencia)
// @HU-9.1 Crear una incidencia · Sebastian — Prueba la API completa con peticiones reales (incidencias)
// Pruebas de los endpoints (back/api): lo que responde cada uno, con su código HTTP,
// igual que lo vería Postman o el simulador. No levanta el servidor: llama directo a la
// función GET/POST/PATCH de cada archivo con un Request armado a mano.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { reiniciarAlmacen } from "../comun/almacen.js";
import { crearSesion } from "../logica/usuarios/datos.js";
import * as avisos from "../api/avisos.js";
import * as estacionamientos from "../api/estacionamientos.js";
import * as garita from "../api/garita.js";
import * as incidencias from "../api/incidencias.js";
import * as sugerencia from "../api/sugerencia.js";

const CLAVE_SENSOR = { "x-clave-sensor": "clave-de-desarrollo" }; // la de desarrollo (sin .env.local)

// Arma una petición HTTP como la que manda Postman.
function peticion(ruta, metodo = "GET", cuerpo, encabezados = {}) {
  return new Request(`http://localhost${ruta}`, {
    method: metodo,
    headers: { "content-type": "application/json", ...encabezados },
    body: cuerpo === undefined ? undefined : typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo),
  });
}

// Cookie de sesión del usuario de prueba (administrador en desarrollo).
async function cookieAdmin() {
  return { cookie: `radar_sesion=${await crearSesion("admin.prueba@ucab.edu.ve")}` };
}

const enId = (id) => ({ params: Promise.resolve({ id }) });

beforeEach(() => reiniciarAlmacen());

// @HU-3.1 Recibir avisos de entrada y salida · Aaron
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
describe("POST /api/avisos (HU 3.1, 3.2 y 4.1)", () => {
  test("sin la clave del sensor responde 401", async () => {
    const r = await avisos.POST(peticion("/api/avisos", "POST", { estacionamientoId: "est-playa", tipo: "ENTRADA" }));
    assert.equal(r.status, 401);
  });

  test("con un cuerpo que no es objeto responde 400", async () => {
    const r = await avisos.POST(peticion("/api/avisos", "POST", [], CLAVE_SENSOR));
    assert.equal(r.status, 400);
  });

  test("con un tipo distinto de ENTRADA o SALIDA responde 400", async () => {
    const r = await avisos.POST(peticion("/api/avisos", "POST", { estacionamientoId: "est-playa", tipo: "X" }, CLAVE_SENSOR));
    assert.equal(r.status, 400);
  });

  test("con un estacionamiento que no existe responde 404", async () => {
    const r = await avisos.POST(peticion("/api/avisos", "POST", { estacionamientoId: "zzz", tipo: "ENTRADA" }, CLAVE_SENSOR));
    assert.equal(r.status, 404);
  });

  test("una entrada válida responde 200 y deja registrado estacionamiento, tipo y hora", async () => {
    const r = await avisos.POST(peticion("/api/avisos", "POST", { estacionamientoId: "est-playa", tipo: "ENTRADA" }, CLAVE_SENSOR));
    assert.equal(r.status, 200);
    const { movimiento } = await r.json();
    assert.equal(movimiento.estacionamientoId, "est-playa");
    assert.equal(movimiento.tipo, "ENTRADA");
    assert.ok(movimiento.hora);
  });

  test("el idAviso (texto o número) se guarda como texto", async () => {
    const cuerpo = { estacionamientoId: "est-playa", tipo: "ENTRADA", idAviso: 7 };
    const { movimiento } = await (await avisos.POST(peticion("/api/avisos", "POST", cuerpo, CLAVE_SENSOR))).json();
    assert.equal(movimiento.idAviso, "7");
  });
});

// @HU-4.2 Consultar el semáforo de ocupación · Aaron
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
describe("GET y PATCH /api/estacionamientos (HU 4.2 y 5.4)", () => {
  test("GET responde 200 con la lista de estacionamientos y sus puestos libres", async () => {
    const r = await estacionamientos.GET(peticion("/api/estacionamientos"));
    assert.equal(r.status, 200);
    const { estacionamientos: lista } = await r.json();
    assert.ok(lista.length > 0);
    assert.ok(lista.every((e) => typeof e.libres === "number"));
  });

  test("PATCH sin sesión de administrador responde 403", async () => {
    const r = await estacionamientos.PATCH(peticion("/x", "PATCH", { activo: false }), enId("est-labs"));
    assert.equal(r.status, 403);
  });

  test("PATCH con «activo» entre comillas o capacidad 0 responde 400", async () => {
    const c = await cookieAdmin();
    assert.equal((await estacionamientos.PATCH(peticion("/x", "PATCH", { activo: "false" }, c), enId("est-labs"))).status, 400);
    assert.equal((await estacionamientos.PATCH(peticion("/x", "PATCH", { capacidad: 0 }, c), enId("est-labs"))).status, 400);
  });

  test("PATCH a un estacionamiento que no existe responde 404", async () => {
    const r = await estacionamientos.PATCH(peticion("/x", "PATCH", {}, await cookieAdmin()), enId("nope"));
    assert.equal(r.status, 404);
  });

  test("PATCH válido cierra el estacionamiento y responde 200", async () => {
    const r = await estacionamientos.PATCH(peticion("/x", "PATCH", { activo: false }, await cookieAdmin()), enId("est-labs"));
    assert.equal(r.status, 200);
    assert.equal((await r.json()).estacionamiento.activo, false);
  });
});

// @HU-3.2 Simular sensores y placas · Aaron
describe("POST /api/garita (HU 3.2, placas)", () => {
  test("una lectura válida responde 200 con la placa normalizada", async () => {
    const r = await garita.POST(peticion("/g", "POST", { placa: "ab-123 cd", sentido: "entrada", idLectura: "L1" }, CLAVE_SENSOR));
    assert.equal(r.status, 200);
    assert.equal((await r.json()).lectura.placa, "AB123CD");
  });

  test("sin la clave del sensor responde 401", async () => {
    const r = await garita.POST(peticion("/g", "POST", { placa: "AB123CD", sentido: "ENTRADA" }));
    assert.equal(r.status, 401);
  });
});

// @HU-9.1 Crear una incidencia · Sebastian
describe("GET y POST /api/incidencias (HU 9.1)", () => {
  test("sin sesión responde 401", async () => {
    assert.equal((await incidencias.GET(peticion("/i"))).status, 401);
  });

  test("con sesión crea la incidencia (201) y aparece en la lista", async () => {
    const c = await cookieAdmin();
    const r = await incidencias.POST(peticion("/i", "POST", { estacionamientoId: "est-playa", tipo: "conos_atravesados" }, c));
    assert.equal(r.status, 201);
    const { incidencias: lista } = await (await incidencias.GET(peticion("/i", "GET", undefined, c))).json();
    assert.ok(lista.some((i) => i.estacionamientoId === "est-playa" && i.tipo === "conos_atravesados"));
  });
});

// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
describe("GET /api/sugerencia (HU 7.2)", () => {
  test("con un edificio que existe responde 200 con el sugerido", async () => {
    const r = await sugerencia.GET(peticion("/api/sugerencia?edificio=edif-aulas"));
    assert.equal(r.status, 200);
    assert.ok((await r.json()).sugerido);
  });

  test("con un edificio que no existe responde 404", async () => {
    assert.equal((await sugerencia.GET(peticion("/api/sugerencia?edificio=x"))).status, 404);
  });
});
