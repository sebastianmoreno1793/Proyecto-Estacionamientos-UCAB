// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Prueba que sugiera el abierto con libres más cercano
// Pruebas de unidad del servicio SugerenciaServicio. Se corren con: npm test
import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../basedatos/AlmacenEnMemoria.js";
import { Edificio } from "../../modelos/Edificio.js";
import { Estacionamiento } from "../../modelos/Estacionamiento.js";
import { Fabrica } from "../../Fabrica.js";

let servicios;
beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  servicios = new Fabrica().servicios;
});

// Un cuadrito de unos 20 m alrededor de un punto.
const cuadro = ([lat, lon]) => [[lat - 0.0001, lon - 0.0001], [lat - 0.0001, lon + 0.0001], [lat + 0.0001, lon + 0.0001], [lat + 0.0001, lon - 0.0001]];
const EDIFICIO = new Edificio({ id: "edif", nombre: "Edificio de prueba", ubicacion: [10.464, -66.976] });
const est = (id, centro, datos = {}) => new Estacionamiento({ id, nombre: id, capacidad: 50, ocupados: 45, poligono: cuadro(centro), ...datos });
const cerca = (datos) => est("cerca", [10.4641, -66.976], datos);
const lejos = (datos) => est("lejos", [10.47, -66.976], { ocupados: 0, ...datos });
const ids = (candidatos) => candidatos.map((c) => c.estacionamiento.id);

describe("distancias", () => {
  test("0 m entre un punto y él mismo, y unos 111 m por milésima de grado", () => {
    const s = servicios.sugerenciaServicio;
    assert.equal(s.distanciaEnMetros([10.464, -66.976], [10.464, -66.976]), 0);
    assert.equal(s.distanciaEnMetros([10.464, -66.976], [10.465, -66.976]), 111);
  });

  test("el centro de un polígono es el promedio de sus esquinas", () => {
    const [lat, lon] = servicios.sugerenciaServicio.centroDelPoligono(cuadro([10.5, -66.9]));
    assert.ok(Math.abs(lat - 10.5) < 1e-9 && Math.abs(lon + 66.9) < 1e-9);
  });
});

describe("criterio de aceptación: el más cercano con puestos libres", () => {
  test("sugiere el más cercano al edificio, aunque otro tenga más libres", () => {
    assert.deepEqual(ids(servicios.sugerenciaServicio.candidatos(EDIFICIO, [lejos(), cerca()])), ["cerca", "lejos"]);
  });

  test("salta el lleno (0 libres) y el cerrado (HU 5.4)", () => {
    assert.deepEqual(ids(servicios.sugerenciaServicio.candidatos(EDIFICIO, [cerca({ ocupados: 50 }), lejos()])), ["lejos"]);
    assert.deepEqual(ids(servicios.sugerenciaServicio.candidatos(EDIFICIO, [cerca({ activo: false }), lejos()])), ["lejos"]);
  });

  test("considera también los de solo profesores (el rol es la HU 7.3)", () => {
    assert.equal(ids(servicios.sugerenciaServicio.candidatos(EDIFICIO, [cerca({ soloProfesores: true }), lejos()]))[0], "cerca");
  });

  test("si todo está lleno o cerrado, o el edificio no tiene ubicación o no existe, lo dice", () => {
    const s = servicios.sugerenciaServicio;
    assert.throws(() => s.candidatos(EDIFICIO, [cerca({ ocupados: 50 }), lejos({ activo: false })]), { motivo: "sin_puestos" });
    assert.throws(() => s.candidatos(new Edificio({ id: "x", nombre: "X" }), [cerca()]), /no tiene ubicación/);
    assert.throws(() => s.candidatos(null, [cerca()]), { motivo: "no_existe" });
  });
});

describe("con los datos reales del campus", () => {
  test("para el Edificio de Aulas sugiere uno abierto con puestos y hasta dos alternativas", async () => {
    const r = await servicios.sugerenciaServicio.sugerir("edif-aulas");
    assert.equal(r.edificio.nombre, "Edificio de Aulas");
    assert.ok(r.sugerido.libres > 0 && r.sugerido.distancia >= 0);
    assert.ok(r.alternativas.length <= 2);
  });

  test("si el administrador cierra el sugerido, sugiere otro", async () => {
    const primero = (await servicios.sugerenciaServicio.sugerir("edif-aulas")).sugerido;
    await servicios.estacionamientoServicio.cambiar(primero.id, { activo: false });
    assert.notEqual((await servicios.sugerenciaServicio.sugerir("edif-aulas")).sugerido.id, primero.id);
  });
});
