// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Prueba los colores y textos del semáforo
// HU 4.2 Consultar el semáforo de ocupación (D-009: hay o no hay puesto).
// Se corre con: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { nivelDelSemaforo, puestosLibres } from "../reglas_y_datos/estacionamientos/reglas.js";

const nivel = (libres, activo = true) => nivelDelSemaforo({ libres, activo }).nivel;

test("verde (hay puesto) con al menos un puesto libre", () => {
  assert.equal(nivel(1), "hay");
  assert.equal(nivel(90), "hay");
});

test("rojo (no hay puesto) sin puestos libres", () => {
  assert.equal(nivel(0), "no-hay");
});

test("un estacionamiento desactivado sale como cerrado, aunque tenga puestos", () => {
  assert.equal(nivel(10, false), "cerrado");
});

test("el color lo deciden los libres, no el porcentaje: 1 libre de 300 sigue en verde", () => {
  const libres = puestosLibres({ capacidad: 300, ocupados: 299 });
  assert.equal(nivel(libres), "hay");
});

test("cada estado se dice también en texto", () => {
  assert.equal(nivelDelSemaforo({ libres: 3 }).texto, "Hay puesto");
  assert.equal(nivelDelSemaforo({ libres: 0 }).texto, "No hay puesto");
  assert.equal(nivelDelSemaforo({ libres: 3, activo: false }).texto, "Cerrado");
});
