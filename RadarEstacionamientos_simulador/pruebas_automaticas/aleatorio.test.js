// Aleatorio: con la misma semilla da la misma serie (el mapa se dibuja igual cada vez).
// Se corre con: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { Aleatorio } from "../mapa_3d/Aleatorio.js";

test("la misma semilla da la misma serie, y otra semilla da otra", () => {
  const serie = (a) => Array.from({ length: 5 }, () => a.siguiente());
  assert.deepEqual(serie(new Aleatorio(42)), serie(new Aleatorio(42)));
  assert.notDeepEqual(serie(new Aleatorio(42)), serie(new Aleatorio(43)));
  assert.deepEqual(serie(Aleatorio.desdeTexto("est-playa")), serie(Aleatorio.desdeTexto("est-playa")));
});

test("los números quedan en [0, 1) y mezclar no pierde ni repite elementos", () => {
  const a = new Aleatorio(7);
  for (let i = 0; i < 200; i++) {
    const n = a.siguiente();
    assert.ok(n >= 0 && n < 1);
  }
  const lista = Array.from({ length: 30 }, (_, i) => i);
  assert.deepEqual([...a.mezclar(lista)].sort((x, y) => x - y), lista);
});
