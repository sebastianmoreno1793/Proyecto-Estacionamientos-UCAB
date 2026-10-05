// HU 10.1 Habilitar, inhabilitar y fijar la capacidad de los estacionamientos.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { reiniciarAlmacen } from "../lib/almacen.js";
import { cambiarEstacionamiento, listarEstacionamientos } from "../lib/estacionamientos/datos.js";
import {
  estacionamientosSugeribles,
  puestosLibres,
  validarCapacidad,
} from "../lib/estacionamientos/reglas.js";

describe("puestos libres con la capacidad fijada por el administrador", () => {
  test("son la capacidad menos los ocupados", () => {
    assert.equal(puestosLibres({ capacidad: 100, ocupados: 30 }), 70);
  });

  test("nunca bajan de 0 si la capacidad nueva queda por debajo de los ocupados", () => {
    assert.equal(puestosLibres({ capacidad: 20, ocupados: 30 }), 0);
  });

  test("nunca pasan de la capacidad", () => {
    assert.equal(puestosLibres({ capacidad: 50, ocupados: -5 }), 50);
  });
});

describe("validar la capacidad", () => {
  test("acepta enteros de 1 en adelante", () => {
    for (const valor of ["1", "250", " 40 "]) {
      assert.equal(validarCapacidad(valor).capacidad, Number(valor), `debería aceptar ${valor}`);
    }
  });

  test("rechaza vacíos, ceros, negativos, decimales, texto y valores muy grandes", () => {
    for (const valor of ["", "0", "-3", "12.5", "abc", "2001", null]) {
      assert.ok(validarCapacidad(valor).error, `debería rechazar ${valor}`);
    }
  });
});

describe("cambiar un estacionamiento", () => {
  beforeEach(() => reiniciarAlmacen());

  test("todos los estacionamientos del mapa tienen capacidad y empiezan activos", async () => {
    for (const e of await listarEstacionamientos()) {
      assert.ok(e.capacidad >= 1, `${e.id} no tiene capacidad`);
      assert.equal(e.activo, true);
    }
  });

  test("guarda la capacidad nueva y los puestos libres se calculan con ella", async () => {
    const { estacionamiento } = await cambiarEstacionamiento("est-b", { capacidad: "50", activo: true });
    assert.equal(estacionamiento.capacidad, 50);
    assert.equal(puestosLibres(estacionamiento), Math.max(0, 50 - estacionamiento.ocupados));
  });

  test("un estacionamiento desactivado no se sugiere", async () => {
    await cambiarEstacionamiento("est-b", { capacidad: "80", activo: false });
    const ids = estacionamientosSugeribles(await listarEstacionamientos()).map((e) => e.id);
    assert.ok(!ids.includes("est-b"));
  });

  test("se puede volver a activar", async () => {
    await cambiarEstacionamiento("est-b", { capacidad: "80", activo: false });
    await cambiarEstacionamiento("est-b", { capacidad: "80", activo: true });
    const ids = estacionamientosSugeribles(await listarEstacionamientos()).map((e) => e.id);
    assert.ok(ids.includes("est-b"));
  });

  test("no cambia nada si la capacidad no es válida", async () => {
    const antes = (await listarEstacionamientos()).find((e) => e.id === "est-b");
    const resultado = await cambiarEstacionamiento("est-b", { capacidad: "0", activo: false });
    assert.ok(resultado.error);
    const despues = (await listarEstacionamientos()).find((e) => e.id === "est-b");
    assert.deepEqual(despues, antes);
  });

  test("avisa si el estacionamiento no existe", async () => {
    const resultado = await cambiarEstacionamiento("no-existe", { capacidad: "10", activo: true });
    assert.ok(resultado.error);
  });
});
