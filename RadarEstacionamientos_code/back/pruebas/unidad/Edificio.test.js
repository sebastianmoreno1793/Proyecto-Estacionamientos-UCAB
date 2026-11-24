// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Prueba el id, el nombre normalizado y los cambios
// Pruebas de unidad del modelo Edificio. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { Edificio } from "../../logica/modelos/Edificio.js";

test("el id sale del nombre, sin tildes ni espacios", () => {
  assert.equal(Edificio.crearId("Módulo José Miranda", []), "edif-modulo-jose-miranda");
});

test("el id no se repite", () => {
  assert.equal(Edificio.crearId("Módulo 1", ["edif-modulo-1"]), "edif-modulo-1-2");
});

test("dos nombres son el mismo si solo cambian mayúsculas, tildes o espacios", () => {
  const aulas = new Edificio({ id: "edif-aulas", nombre: "Edificio de Aulas" });
  assert.ok(aulas.tieneElMismoNombreQue("edificio  de AULAS"));
  assert.ok(aulas.tieneElMismoNombreQue("Edifício de Aulas"));
  assert.ok(!aulas.tieneElMismoNombreQue("Aula Magna"));
});

test("modificar cambia el nombre y la ubicación, y lo devuelto es una copia", () => {
  const e = new Edificio({ id: "edif-x", nombre: "X" });
  assert.equal(e.tieneUbicacion(), false);
  e.cambiar({ nombre: "Y", ubicacion: [10.4643, -66.9763] });
  e.ubicacion.splice(0, 2);
  assert.deepEqual(e.aRegistro(), { id: "edif-x", nombre: "Y", ubicacion: [10.4643, -66.9763] });
});
