// HU 4.2 Consultar el semáforo de ocupación.
// Se corre con: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { nivelDelSemaforo, porcentajeDeOcupacion } from "../lib/estacionamientos/reglas.js";

const nivel = (porcentaje, activo = true) => nivelDelSemaforo({ porcentaje, activo }).nivel;

test("verde por debajo de 50 %", () => {
  assert.equal(nivel(0), "verde");
  assert.equal(nivel(49), "verde");
});

test("amarillo de 50 % a menos de 80 %", () => {
  assert.equal(nivel(50), "amarillo");
  assert.equal(nivel(79), "amarillo");
});

test("naranja de 80 % a menos de 95 %", () => {
  assert.equal(nivel(80), "naranja");
  assert.equal(nivel(94), "naranja");
});

test("rojo de 95 % en adelante", () => {
  assert.equal(nivel(95), "rojo");
  assert.equal(nivel(100), "rojo");
});

test("un estacionamiento desactivado sale como cerrado, aunque tenga puestos", () => {
  assert.equal(nivel(10, false), "cerrado");
});

test("el porcentaje redondeado cae en el color correcto (Playa: 120 de 150 = 80 %)", () => {
  assert.equal(nivel(porcentajeDeOcupacion({ capacidad: 150, ocupados: 120 })), "naranja");
});
