// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Prueba la validación de la capacidad nueva y de «activo»
// Pruebas del validador CapacidadValidador. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { CapacidadValidador } from "../../validadores/CapacidadValidador.js";

const validador = new CapacidadValidador();

test("acepta enteros de 1 a 2000 y los devuelve como número", () => {
  for (const capacidad of ["1", "250", " 40 ", "2000"]) {
    const r = validador.validar({ capacidad, activo: true });
    assert.equal(r.valido, true, capacidad);
    assert.equal(r.datos.capacidad, Number(capacidad));
  }
});

test("rechaza vacíos, ceros, negativos, decimales, texto y valores muy grandes", () => {
  for (const capacidad of ["", "0", "-3", "12.5", "abc", "2001", null]) {
    assert.ok(validador.validar({ capacidad, activo: true }).errores.capacidad, `debería rechazar ${capacidad}`);
  }
});

test("«activo» como texto se rechaza (no se abre ni se cierra por error)", () => {
  assert.ok(validador.validar({ capacidad: "40", activo: "false" }).errores.activo);
});
