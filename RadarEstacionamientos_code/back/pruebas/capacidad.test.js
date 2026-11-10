// HU 5.4 (antes 10.1) Modificar la capacidad y el estado de un estacionamiento.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { ESTACIONAMIENTOS } from "../campus/estacionamientos.js";
import { reiniciarAlmacen } from "../comun/almacen.js";
import { CAPACIDAD_DE_EJEMPLO } from "../campus/capacidad_inicial.js";
import { cambiarEstacionamiento, listarEstacionamientos } from "../logica/estacionamientos/datos.js";
import {
  etiquetasUnicas,
  estacionamientosSugeribles,
  puestosLibres,
  validarCapacidad,
} from "../logica/estacionamientos/reglas.js";

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

describe("etiquetas para distinguir zonas con el mismo nombre", () => {
  test("un nombre que no se repite queda igual", () => {
    assert.deepEqual(etiquetasUnicas([{ id: "est-labs", nombre: "Labs" }]), ["Labs"]);
  });

  test("las zonas repetidas se distinguen por el id", () => {
    const etiquetas = etiquetasUnicas([
      { id: "est-padel", nombre: "Pádel" },
      { id: "est-padel-norte", nombre: "Pádel" },
    ]);
    assert.deepEqual(etiquetas, ["Pádel (principal)", "Pádel (norte)"]);
  });

  test("en el campus no quedan dos estacionamientos con la misma etiqueta", async () => {
    reiniciarAlmacen();
    const etiquetas = (await listarEstacionamientos()).map((e) => e.etiqueta);
    assert.equal(new Set(etiquetas).size, etiquetas.length);
  });

  test("las zonas de profesores quedan marcadas", async () => {
    reiniciarAlmacen();
    const profesores = (await listarEstacionamientos()).filter((e) => e.soloProfesores);
    assert.ok(profesores.length > 0);
    assert.ok(profesores.every((e) => e.id.startsWith("prof-")));
  });
});

describe("datos de ejemplo alineados con el mapa (HU 5.1)", () => {
  // Si falla, alguien cambió `campus/estacionamientos.js`: actualiza `campus/capacidad_inicial.js`.
  test("cada estacionamiento del mapa tiene capacidad de ejemplo", () => {
    const sinCapacidad = ESTACIONAMIENTOS.map((e) => e.id).filter((id) => !CAPACIDAD_DE_EJEMPLO[id]);
    assert.deepEqual(sinCapacidad, []);
  });

  test("no hay capacidades de ejemplo para estacionamientos que ya no están en el mapa", () => {
    const ids = new Set(ESTACIONAMIENTOS.map((e) => e.id));
    const sobran = Object.keys(CAPACIDAD_DE_EJEMPLO).filter((id) => !ids.has(id));
    assert.deepEqual(sobran, []);
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
    const { estacionamiento } = await cambiarEstacionamiento("est-playa", { capacidad: "50", activo: true });
    assert.equal(estacionamiento.capacidad, 50);
    assert.equal(puestosLibres(estacionamiento), Math.max(0, 50 - estacionamiento.ocupados));
  });

  test("un estacionamiento desactivado no se sugiere", async () => {
    await cambiarEstacionamiento("est-playa", { capacidad: "150", activo: false });
    const ids = estacionamientosSugeribles(await listarEstacionamientos()).map((e) => e.id);
    assert.ok(!ids.includes("est-playa"));
  });

  test("se puede volver a activar", async () => {
    await cambiarEstacionamiento("est-playa", { capacidad: "150", activo: false });
    await cambiarEstacionamiento("est-playa", { capacidad: "150", activo: true });
    const ids = estacionamientosSugeribles(await listarEstacionamientos()).map((e) => e.id);
    assert.ok(ids.includes("est-playa"));
  });

  test("no cambia nada si la capacidad no es válida", async () => {
    const antes = (await listarEstacionamientos()).find((e) => e.id === "est-playa");
    const resultado = await cambiarEstacionamiento("est-playa", { capacidad: "0", activo: false });
    assert.ok(resultado.error);
    const despues = (await listarEstacionamientos()).find((e) => e.id === "est-playa");
    assert.deepEqual(despues, antes);
  });

  test("avisa si el estacionamiento no existe", async () => {
    const resultado = await cambiarEstacionamiento("no-existe", { capacidad: "10", activo: true });
    assert.ok(resultado.error);
  });
});
