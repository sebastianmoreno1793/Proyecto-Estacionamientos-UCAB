// Comprueba que la lista de estacionamientos sirve para dibujar el mapa (HU 5.1).
// Se corre con: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CENTRO_CAMPUS,
  ESTACIONAMIENTOS,
} from "../campus/estacionamientos.js";

const esCoordenada = ([lat, lng]) =>
  Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

test("hay al menos un estacionamiento", () => {
  assert.ok(ESTACIONAMIENTOS.length > 0);
});

test("cada estacionamiento tiene id único y nombre", () => {
  const ids = ESTACIONAMIENTOS.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, "hay ids repetidos");
  for (const e of ESTACIONAMIENTOS) {
    assert.match(e.id, /^[a-z0-9-]+$/, `id inválido: ${e.id}`);
    assert.ok(e.nombre && e.nombre.trim().length > 0, `${e.id} no tiene nombre`);
  }
});

test("soloProfesores, si aparece, es true o false", () => {
  for (const e of ESTACIONAMIENTOS) {
    if ("soloProfesores" in e) assert.equal(typeof e.soloProfesores, "boolean", `${e.id}: soloProfesores inválido`);
  }
});

test("pisos, si aparece, es un entero mayor que 0", () => {
  for (const e of ESTACIONAMIENTOS) {
    if ("pisos" in e) assert.ok(Number.isInteger(e.pisos) && e.pisos > 0, `${e.id}: pisos inválido`);
  }
});

test("cada estacionamiento es un área con al menos 3 esquinas válidas", () => {
  for (const e of ESTACIONAMIENTOS) {
    assert.ok(e.poligono.length >= 3, `${e.id} tiene menos de 3 esquinas`);
    for (const p of e.poligono) assert.ok(esCoordenada(p), `${e.id}: coordenada inválida ${p}`);
  }
});

test("todos los estacionamientos quedan cerca del campus (menos de 1 km)", () => {
  const [lat0, lng0] = CENTRO_CAMPUS;
  for (const e of ESTACIONAMIENTOS) {
    for (const [lat, lng] of e.poligono) {
      // 0,009° ≈ 1 km a esta latitud
      assert.ok(Math.abs(lat - lat0) < 0.009 && Math.abs(lng - lng0) < 0.009, `${e.id} está lejos del campus`);
    }
  }
});
