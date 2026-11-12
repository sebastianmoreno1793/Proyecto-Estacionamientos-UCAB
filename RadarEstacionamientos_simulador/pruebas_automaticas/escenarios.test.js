// Escenarios de prueba del simulador: deciden qué avisos mandar a la app base.
// Se corre con: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { generadorAleatorio } from "../mapa_3d/geo.js";
import {
  avisosParaLlenar,
  avisosParaVaciar,
  incidenciaAleatoria,
  placaAleatoria,
  repartirLlegadas,
  repartirSalidas,
} from "../escenarios_prueba/escenarios.js";

const CAMPUS = [
  { id: "a", activo: true, capacidad: 10, ocupados: 8 }, // 2 libres
  { id: "b", activo: true, capacidad: 5, ocupados: 0 }, // 5 libres
  { id: "c", activo: false, capacidad: 50, ocupados: 10 }, // cerrado: no cuenta
];

test("la placa de prueba tiene el formato venezolano AB123CD", () => {
  const azar = generadorAleatorio(1);
  for (let i = 0; i < 20; i++) assert.match(placaAleatoria(azar), /^[A-Z]{2}\d{3}[A-Z]{2}$/);
});

test("la hora pico nunca manda más llegadas que puestos libres, ni a un estacionamiento cerrado", () => {
  const ids = repartirLlegadas(CAMPUS, 100, generadorAleatorio(7));
  assert.equal(ids.length, 7);
  assert.equal(ids.filter((id) => id === "a").length, 2);
  assert.equal(ids.filter((id) => id === "b").length, 5);
  assert.ok(!ids.includes("c"));
});

test("el fin de clases nunca saca más carros de los que hay", () => {
  const ids = repartirSalidas(CAMPUS, 100, generadorAleatorio(7));
  assert.equal(ids.length, 8);
  assert.ok(ids.every((id) => id === "a"));
});

test("llenar manda una entrada por puesto libre y vaciar una salida por carro, intercalando estacionamientos", () => {
  const llenar = avisosParaLlenar(CAMPUS);
  assert.equal(llenar.length, 7);
  assert.ok(llenar.every((a) => a.tipo === "ENTRADA"));
  assert.deepEqual(llenar.slice(0, 2).map((a) => a.estacionamientoId), ["a", "b"]);
  const vaciar = avisosParaVaciar(CAMPUS);
  assert.equal(vaciar.length, 8);
  assert.ok(vaciar.every((a) => a.tipo === "SALIDA" && a.estacionamientoId === "a"));
});

test("las incidencias al azar solo caen en estacionamientos abiertos", () => {
  const tipos = [{ id: "conos_atravesados" }];
  const azar = generadorAleatorio(3);
  for (let i = 0; i < 20; i++) {
    const incidencia = incidenciaAleatoria(CAMPUS, tipos, azar);
    assert.notEqual(incidencia.estacionamientoId, "c");
  }
  assert.equal(incidenciaAleatoria([{ id: "x", activo: false }], tipos), null);
});
