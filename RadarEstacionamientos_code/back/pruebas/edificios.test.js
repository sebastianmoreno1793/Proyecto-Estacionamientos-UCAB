// HU 6.1 Mantener el catálogo de edificios UCAB.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { EDIFICIOS } from "../campus/edificios.js";
import { reiniciarAlmacen } from "../comun/almacen.js";
import {
  agregarEdificio,
  listarEdificios,
  modificarEdificio,
  quitarEdificio,
} from "../logica/edificios/datos.js";
import { crearId, normalizarNombre, validarEdificio } from "../logica/edificios/reglas.js";

describe("catálogo inicial", () => {
  test("ids únicos, nombres no vacíos y ubicaciones dentro del campus", () => {
    const ids = EDIFICIOS.map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length, "hay ids repetidos");
    for (const e of EDIFICIOS) {
      assert.ok(e.nombre.trim().length > 0, `${e.id} no tiene nombre`);
      if (e.ubicacion) {
        const v = validarEdificio({ nombre: "x" + e.id, latitud: e.ubicacion[0], longitud: e.ubicacion[1] }, []);
        assert.ok(!v.error, `${e.id}: ${v.error}`);
      }
    }
  });
});

describe("validar un edificio", () => {
  const existentes = [{ id: "edif-aulas", nombre: "Edificio de Aulas" }];

  test("limpia los espacios del nombre", () => {
    assert.equal(validarEdificio({ nombre: "  Módulo   1 " }, existentes).nombre, "Módulo 1");
  });

  test("rechaza nombres vacíos o muy largos", () => {
    for (const nombre of ["", " ", "a", "x".repeat(81), null]) {
      assert.ok(validarEdificio({ nombre }, existentes).error, `debería rechazar ${nombre}`);
    }
  });

  test("no deja repetir un nombre aunque cambien mayúsculas, tildes o espacios", () => {
    assert.ok(validarEdificio({ nombre: "edificio  de AULAS" }, existentes).error);
    assert.ok(validarEdificio({ nombre: "Edifício de Aulas" }, existentes).error);
  });

  test("al modificar, el edificio puede conservar su propio nombre", () => {
    assert.ok(!validarEdificio({ nombre: "Edificio de Aulas" }, existentes, "edif-aulas").error);
  });

  test("la ubicación es opcional, pero latitud y longitud van juntas", () => {
    assert.equal(validarEdificio({ nombre: "Módulo 1" }, existentes).ubicacion, null);
    assert.ok(validarEdificio({ nombre: "Módulo 1", latitud: "10.464" }, existentes).error);
  });

  test("acepta coma decimal y rechaza texto o lugares fuera del campus", () => {
    assert.deepEqual(
      validarEdificio({ nombre: "Módulo 1", latitud: "10,4642", longitud: "-66,9762" }, existentes).ubicacion,
      [10.4642, -66.9762]
    );
    assert.ok(validarEdificio({ nombre: "Módulo 1", latitud: "abc", longitud: "-66.97" }, existentes).error);
    assert.ok(validarEdificio({ nombre: "Módulo 1", latitud: "10.50", longitud: "-66.90" }, existentes).error);
  });
});

describe("ids de edificios nuevos", () => {
  test("salen del nombre, sin tildes ni espacios", () => {
    assert.equal(crearId("Módulo José Miranda", []), "edif-modulo-jose-miranda");
  });

  test("no se repiten", () => {
    assert.equal(crearId("Módulo 1", ["edif-modulo-1"]), "edif-modulo-1-2");
  });

  test("normalizar ignora mayúsculas, tildes y espacios", () => {
    assert.equal(normalizarNombre("  Aula   MAGNA "), normalizarNombre("aula magna"));
  });
});

describe("el administrador mantiene el catálogo y el usuario ve esa misma lista", () => {
  beforeEach(() => reiniciarAlmacen());

  test("la lista empieza con el catálogo inicial, ordenada por nombre", async () => {
    const nombres = (await listarEdificios()).map((e) => e.nombre);
    assert.equal(nombres.length, EDIFICIOS.length);
    assert.deepEqual(nombres, [...nombres].sort((a, b) => a.localeCompare(b, "es")));
  });

  test("agregar un edificio lo muestra en la lista", async () => {
    const { edificio } = await agregarEdificio({ nombre: "Módulo de Aulas 2" });
    assert.equal(edificio.id, "edif-modulo-de-aulas-2");
    assert.ok((await listarEdificios()).some((e) => e.nombre === "Módulo de Aulas 2"));
  });

  test("modificar cambia el nombre y la ubicación", async () => {
    await modificarEdificio("edif-aulas", { nombre: "Edificio de Aulas (A)", latitud: "10.4643", longitud: "-66.9763" });
    const aulas = (await listarEdificios()).find((e) => e.id === "edif-aulas");
    assert.equal(aulas.nombre, "Edificio de Aulas (A)");
    assert.deepEqual(aulas.ubicacion, [10.4643, -66.9763]);
  });

  test("quitar lo saca de la lista", async () => {
    await quitarEdificio("edif-aula-magna");
    assert.ok(!(await listarEdificios()).some((e) => e.id === "edif-aula-magna"));
  });

  test("no se puede modificar ni quitar un edificio que no existe", async () => {
    assert.ok((await modificarEdificio("edif-nada", { nombre: "X Y" })).error);
    assert.ok((await quitarEdificio("edif-nada")).error);
  });

  test("un nombre repetido no se guarda", async () => {
    const antes = (await listarEdificios()).length;
    assert.ok((await agregarEdificio({ nombre: "aula magna" })).error);
    assert.equal((await listarEdificios()).length, antes);
  });

  test("lo que devuelve la lista es una copia: cambiarla no toca el catálogo", async () => {
    const lista = await listarEdificios();
    lista[0].nombre = "Cambiado";
    lista[0].ubicacion?.splice(0, 2);
    const otra = await listarEdificios();
    assert.notEqual(otra[0].nombre, "Cambiado");
  });
});
