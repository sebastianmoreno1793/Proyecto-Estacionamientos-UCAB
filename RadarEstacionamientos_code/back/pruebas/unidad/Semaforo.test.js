// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Prueba los tres estados y sus textos (D-009)
// Pruebas de unidad del modelo Semaforo. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { Estacionamiento } from "../../logica/modelos/Estacionamiento.js";
import { Semaforo } from "../../logica/modelos/Semaforo.js";

const nivel = (libres, activo = true) => Semaforo.segun({ libres, activo }).nivel;

test("verde (hay puesto) con al menos un puesto libre", () => {
  assert.equal(nivel(1), "hay");
  assert.equal(nivel(90), "hay");
});

test("rojo (no hay puesto) sin puestos libres", () => {
  assert.equal(nivel(0), "no-hay");
});

test("un estacionamiento cerrado sale como cerrado, aunque tenga puestos", () => {
  assert.equal(nivel(10, false), "cerrado");
});

test("el color lo deciden los libres, no el porcentaje: 1 libre de 300 sigue en verde", () => {
  const e = new Estacionamiento({ id: "x", nombre: "X", capacidad: 300, ocupados: 299 });
  assert.equal(e.semaforo().nivel, "hay");
});

test("cada estado se dice también en texto", () => {
  assert.equal(Semaforo.segun({ libres: 3 }).texto, "Hay puesto");
  assert.equal(Semaforo.segun({ libres: 0 }).texto, "No hay puesto");
  assert.equal(Semaforo.segun({ libres: 3, activo: false }).texto, "Cerrado");
  assert.deepEqual(Semaforo.HAY_PUESTO.aJSON(), { nivel: "hay", texto: "Hay puesto" });
});
