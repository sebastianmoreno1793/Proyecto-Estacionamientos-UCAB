// @HU-9.1 Crear una incidencia · Sebastian — Prueba el control de Reportar: valida, manda por fetch y elige el mensaje
// Pruebas del controlador IncidenciaControlador (front). Se corren con: npm test
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { IncidenciaControlador } from "../../controladores/IncidenciaControlador.js";
import { IncidenciaDTO } from "../../dto/IncidenciaDTO.js";
import { ServicioDePrueba, formulario } from "./ayuda.js";

let servicio;
let controlador;
const incidencia = { id: "1", estacionamiento: "Playa", tipo: "conos_atravesados", nombreTipo: "Conos atravesados", estado: "pendiente" };

beforeEach(async () => {
  servicio = new ServicioDePrueba({
    tipos: [{ id: "conos_atravesados", nombre: "Conos atravesados" }],
    crear: { ok: true, estado: 201, datos: { incidencia } },
  });
  const estacionamientos = new ServicioDePrueba({
    listar: { ok: true, estacionamientos: [{ id: "est-playa", activo: true }, { id: "est-labs", activo: false }] },
  });
  controlador = new IncidenciaControlador({ servicio, estacionamientoServicio: estacionamientos });
  await controlador.cargar();
});

test("CA3: el formulario solo ofrece los estacionamientos abiertos", async () => {
  const { estacionamientos } = await controlador.cargar();
  assert.deepEqual(estacionamientos.map((e) => e.id), ["est-playa"]);
});

test("si falta algo, muestra MensajeDatosNoValidos y no manda nada al back", async () => {
  const r = await controlador.reportar(formulario({ tipo: "conos_atravesados" }));
  assert.equal(r.interfaz, "MensajeDatosNoValidos");
  assert.equal(r.error, "Elige un estacionamiento de la lista.");
  assert.equal(servicio.llamadas.filter((l) => l.metodo === "crear").length, 0);
});

test("con todo elegido manda un IncidenciaDTO y muestra MensajeIncidenciaCreada", async () => {
  const r = await controlador.reportar(formulario({ estacionamientoId: "est-playa", tipo: "conos_atravesados" }));
  const envio = servicio.llamadas.find((l) => l.metodo === "crear").argumentos[0];
  assert.ok(envio instanceof IncidenciaDTO);
  assert.deepEqual({ ...envio }, { estacionamientoId: "est-playa", tipo: "conos_atravesados" });
  assert.equal(r.interfaz, "MensajeIncidenciaCreada");
  assert.equal(r.incidencia.estado, "pendiente");
});

test("si el back responde 409 (lo cerraron), muestra MensajeEstacionamientoCerrado", async () => {
  servicio.respuestas.crear = { ok: false, estado: 409, error: "Playa está cerrado." };
  const r = await controlador.reportar({ estacionamientoId: "est-playa", tipo: "conos_atravesados" });
  assert.equal(r.interfaz, "MensajeEstacionamientoCerrado");
});
