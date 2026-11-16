// @HU-9.1 Crear una incidencia · Sebastian — Prueba que el formulario diga todo lo que falta elegir (CA2)
// Pruebas del validador IncidenciaValidador. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { IncidenciaValidador } from "../../validadores/IncidenciaValidador.js";

const validador = new IncidenciaValidador({ estacionamientos: ["est-playa"], tipos: ["conos_atravesados"] });

test("con un estacionamiento de la lista y un tipo es válido", () => {
  assert.equal(validador.validar({ estacionamientoId: "est-playa", tipo: "conos_atravesados" }).valido, true);
});

test("CA2: sin estacionamiento o sin tipo dice qué falta", () => {
  assert.equal(validador.validar({ tipo: "conos_atravesados" }).error, "Elige un estacionamiento de la lista.");
  assert.equal(validador.validar({ estacionamientoId: "est-playa" }).error, "Elige el tipo de problema.");
});

test("CA2: si faltan los dos, dice los dos", () => {
  assert.equal(validador.validar({}).error, "Elige un estacionamiento de la lista y el tipo de problema.");
});

test("CA3: un estacionamiento que no está en la lista (cerrado) no vale", () => {
  const r = validador.validar({ estacionamientoId: "est-labs", tipo: "conos_atravesados" });
  assert.equal(r.valido, false);
  assert.ok(r.errores.estacionamientoId);
});
