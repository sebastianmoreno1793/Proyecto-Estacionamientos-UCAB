// @HU-9.1 Crear una incidencia · Sebastian — Prueba las reglas y el guardado de las incidencias
// HU 9.1 Reportar una incidencia.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { reiniciarAlmacen } from "../comun/almacen.js";
import { cambiarEstacionamiento } from "../logica/estacionamientos/datos.js";
import { listarIncidencias, registrarIncidencia } from "../logica/incidencias/datos.js";
import { TIPOS_DE_INCIDENCIA } from "../logica/incidencias/reglas.js";

describe("reportar una incidencia", () => {
  beforeEach(() => reiniciarAlmacen());

  test("ofrece los tres tipos de problema del Brief", () => {
    assert.deepEqual(
      TIPOS_DE_INCIDENCIA.map((t) => t.nombre),
      ["Batería descargada", "Conos atravesados", "Vehículo mal estacionado"],
    );
  });

  test("queda registrada con la hora y como pendiente", async () => {
    const ahora = new Date("2026-10-12T13:45:00Z");
    const { incidencia } = await registrarIncidencia(
      { estacionamientoId: "est-playa", tipo: "conos_atravesados", reportadaPor: "admin.prueba@ucab.edu.ve" },
      ahora,
    );
    assert.equal(incidencia.estacionamientoId, "est-playa");
    assert.equal(incidencia.tipo, "conos_atravesados");
    assert.equal(incidencia.estado, "pendiente");
    assert.equal(incidencia.reportadaEn, ahora.toISOString());
    assert.equal((await listarIncidencias()).length, 1);
  });

  test("no se registra sin un tipo de problema válido", async () => {
    const resultado = await registrarIncidencia({ estacionamientoId: "est-playa", tipo: "otro" });
    assert.ok(resultado.error);
    assert.equal((await listarIncidencias()).length, 0);
  });

  test("no se registra en un estacionamiento que no existe", async () => {
    const resultado = await registrarIncidencia({ estacionamientoId: "no-existe", tipo: "bateria_descargada" });
    assert.ok(resultado.error);
    assert.equal((await listarIncidencias()).length, 0);
  });

  test("no se registra en un estacionamiento desactivado", async () => {
    await cambiarEstacionamiento("est-labs", { capacidad: "40", activo: false });
    const resultado = await registrarIncidencia({ estacionamientoId: "est-labs", tipo: "bateria_descargada" });
    assert.ok(resultado.error);
    assert.equal((await listarIncidencias()).length, 0);
  });
});
