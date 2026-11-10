// HU 7.2 Sugerir el estacionamiento libre más cercano.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { reiniciarAlmacen } from "../comun/almacen.js";
import { cambiarEstacionamiento, listarEstacionamientos } from "../logica/estacionamientos/datos.js";
import { centroDelPoligono, distanciaEnMetros, sugerirMasCercano } from "../logica/sugerencia/reglas.js";
import { sugerirParaEdificio } from "../logica/sugerencia/datos.js";

// Un cuadrito de unos 20 m alrededor de un punto, para armar estacionamientos de prueba.
const cuadro = ([lat, lon]) => [
  [lat - 0.0001, lon - 0.0001],
  [lat - 0.0001, lon + 0.0001],
  [lat + 0.0001, lon + 0.0001],
  [lat + 0.0001, lon - 0.0001],
];
const EDIFICIO = { id: "edif", nombre: "Edificio de prueba", ubicacion: [10.464, -66.976] };
const cerca = { id: "cerca", nombre: "Cerca", activo: true, libres: 5, poligono: cuadro([10.4641, -66.976]) };
const lejos = { id: "lejos", nombre: "Lejos", activo: true, libres: 50, poligono: cuadro([10.47, -66.976]) };

describe("distancias", () => {
  test("0 m entre un punto y él mismo", () => {
    assert.equal(distanciaEnMetros([10.464, -66.976], [10.464, -66.976]), 0);
  });

  test("una milésima de grado de latitud son unos 111 m", () => {
    assert.equal(distanciaEnMetros([10.464, -66.976], [10.465, -66.976]), 111);
  });

  test("el centro de un polígono es el promedio de sus esquinas", () => {
    const [lat, lon] = centroDelPoligono(cuadro([10.5, -66.9]));
    assert.ok(Math.abs(lat - 10.5) < 1e-9 && Math.abs(lon + 66.9) < 1e-9);
  });
});

describe("criterio de aceptación: el más cercano con puestos libres", () => {
  test("sugiere el más cercano al edificio, aunque otro tenga más libres", () => {
    const { sugerido, alternativas } = sugerirMasCercano(EDIFICIO, [lejos, cerca]);
    assert.equal(sugerido.id, "cerca");
    assert.deepEqual(alternativas.map((a) => a.id), ["lejos"]);
  });

  test("salta el más cercano si está lleno (0 libres)", () => {
    const { sugerido } = sugerirMasCercano(EDIFICIO, [{ ...cerca, libres: 0 }, lejos]);
    assert.equal(sugerido.id, "lejos");
  });

  test("salta el más cercano si el administrador lo cerró (HU 5.4)", () => {
    const { sugerido } = sugerirMasCercano(EDIFICIO, [{ ...cerca, activo: false }, lejos]);
    assert.equal(sugerido.id, "lejos");
  });

  test("considera todos los estacionamientos, también los de solo profesores (el rol es la HU 7.3)", () => {
    const { sugerido } = sugerirMasCercano(EDIFICIO, [{ ...cerca, soloProfesores: true }, lejos]);
    assert.equal(sugerido.id, "cerca");
  });

  test("si todo está lleno o cerrado, lo dice en vez de sugerir", () => {
    const { error } = sugerirMasCercano(EDIFICIO, [{ ...cerca, libres: 0 }, { ...lejos, activo: false }]);
    assert.match(error, /no hay puestos libres/);
    assert.equal(sugerirMasCercano(EDIFICIO, [{ ...cerca, libres: 0 }]).motivo, "sin_puestos");
  });

  test("si el edificio no tiene ubicación, lo dice", () => {
    const { error } = sugerirMasCercano({ ...EDIFICIO, ubicacion: null }, [cerca]);
    assert.match(error, /no tiene ubicación/);
  });

  test("si el edificio no existe, lo dice", () => {
    assert.match(sugerirMasCercano(undefined, [cerca]).error, /no existe/);
  });
});

describe("con los datos reales del campus", () => {
  beforeEach(() => reiniciarAlmacen());

  test("para el Edificio de Aulas sugiere un estacionamiento abierto con puestos libres", async () => {
    const resultado = await sugerirParaEdificio("edif-aulas");
    assert.equal(resultado.edificio.nombre, "Edificio de Aulas");
    assert.ok(resultado.sugerido.libres > 0);
    assert.ok(resultado.sugerido.distancia >= 0);
  });

  test("si el administrador cierra el sugerido, sugiere otro", async () => {
    const primero = (await sugerirParaEdificio("edif-aulas")).sugerido;
    const { capacidad } = (await listarEstacionamientos()).find((e) => e.id === primero.id);
    await cambiarEstacionamiento(primero.id, { capacidad, activo: false });
    const segundo = (await sugerirParaEdificio("edif-aulas")).sugerido;
    assert.notEqual(segundo.id, primero.id);
  });

  test("un edificio que no existe da error", async () => {
    assert.ok((await sugerirParaEdificio("no-existe")).error);
  });
});
