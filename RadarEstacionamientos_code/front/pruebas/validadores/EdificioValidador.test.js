// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Prueba la validación del nombre y la ubicación del edificio
// Pruebas del validador EdificioValidador. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { EdificioValidador } from "../../validadores/EdificioValidador.js";

const validador = new EdificioValidador();
const validar = (datos) => validador.validar(datos);

test("limpia los espacios del nombre", () => {
  assert.equal(validar({ nombre: "  Módulo   1 " }).datos.nombre, "Módulo 1");
});

test("rechaza nombres vacíos, muy largos o sin letras ni números", () => {
  for (const nombre of ["", " ", "a", "x".repeat(81), null, "¡¡"]) {
    assert.ok(validar({ nombre }).errores.nombre, `debería rechazar ${nombre}`);
  }
});

test("la ubicación es opcional, pero latitud y longitud van juntas", () => {
  assert.equal(validar({ nombre: "Módulo 1" }).datos.ubicacion, null);
  assert.ok(validar({ nombre: "Módulo 1", latitud: "10.464" }).errores.ubicacion);
});

test("acepta coma decimal y rechaza texto o lugares fuera del campus", () => {
  assert.deepEqual(validar({ nombre: "Módulo 1", latitud: "10,4642", longitud: "-66,9762" }).datos.ubicacion, [10.4642, -66.9762]);
  assert.ok(validar({ nombre: "Módulo 1", latitud: "abc", longitud: "-66.97" }).errores.ubicacion);
  assert.ok(validar({ nombre: "Módulo 1", latitud: "10.50", longitud: "-66.90" }).errores.ubicacion);
});
