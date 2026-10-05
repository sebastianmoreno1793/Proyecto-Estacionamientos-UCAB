// HU 9.1 Reportar una incidencia.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { reiniciarAlmacen } from "../lib/almacen.js";
import { cambiarEstacionamiento } from "../lib/estacionamientos/datos.js";
import { listarIncidencias, registrarIncidencia } from "../lib/incidencias/datos.js";
import { TIPOS_DE_INCIDENCIA } from "../lib/incidencias/reglas.js";

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
      { estacionamientoId: "est-b", tipo: "conos_atravesados", reportadaPor: "usuario.prueba@ucab.edu.ve" },
      ahora,
    );
    assert.equal(incidencia.estacionamientoId, "est-b");
    assert.equal(incidencia.tipo, "conos_atravesados");
    assert.equal(incidencia.estado, "pendiente");
    assert.equal(incidencia.reportadaEn, ahora.toISOString());
    assert.equal((await listarIncidencias()).length, 1);
  });

  test("no se registra sin un tipo de problema válido", async () => {
    const resultado = await registrarIncidencia({ estacionamientoId: "est-b", tipo: "otro" });
    assert.ok(resultado.error);
    assert.equal((await listarIncidencias()).length, 0);
  });

  test("no se registra en un estacionamiento que no existe", async () => {
    const resultado = await registrarIncidencia({ estacionamientoId: "no-existe", tipo: "bateria_descargada" });
    assert.ok(resultado.error);
    assert.equal((await listarIncidencias()).length, 0);
  });

  test("no se registra en un estacionamiento desactivado", async () => {
    await cambiarEstacionamiento("est-c", { capacidad: "60", activo: false });
    const resultado = await registrarIncidencia({ estacionamientoId: "est-c", tipo: "bateria_descargada" });
    assert.ok(resultado.error);
    assert.equal((await listarIncidencias()).length, 0);
  });
});
