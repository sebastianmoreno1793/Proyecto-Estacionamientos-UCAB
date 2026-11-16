// @HU-9.1 Crear una incidencia · Sebastian — Prueba las reglas de negocio de la incidencia
// Pruebas de unidad del modelo Incidencia. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { Estacionamiento } from "../../modelos/Estacionamiento.js";
import { Incidencia } from "../../modelos/Incidencia.js";

const playa = (activo = true) => new Estacionamiento({ id: "est-playa", nombre: "Playa", capacidad: 10, activo });
const quien = "ana@est.ucab.edu.ve";

test("ofrece los tres tipos de problema del Brief", () => {
  assert.deepEqual(Incidencia.TIPOS.map((t) => t.nombre), ["Batería descargada", "Conos atravesados", "Vehículo mal estacionado"]);
});

test("nace «pendiente», con la fecha y la hora y a nombre de quien reporta", () => {
  const ahora = new Date("2026-10-12T13:45:00Z");
  const i = Incidencia.crear({ estacionamiento: playa(), tipo: "conos_atravesados", reportadaPor: quien }, ahora);
  assert.equal(i.estado, "pendiente");
  assert.equal(i.reportadaEn, ahora.toISOString());
  assert.equal(i.reportadaPor, quien);
  assert.equal(i.nombreDelTipo(), "Conos atravesados");
});

test("REGLA: no se reporta en un estacionamiento cerrado", () => {
  assert.throws(() => Incidencia.crear({ estacionamiento: playa(false), tipo: "conos_atravesados", reportadaPor: quien }), { motivo: "cerrado" });
});

test("REGLA: solo existen los tres tipos de problema", () => {
  assert.throws(() => Incidencia.crear({ estacionamiento: playa(), tipo: "otro", reportadaPor: quien }), { motivo: "tipo" });
});

test("REGLA (RN4): sin usuario no se registra", () => {
  assert.throws(() => Incidencia.crear({ estacionamiento: playa(), tipo: "conos_atravesados" }), { motivo: "sin_usuario" });
});
