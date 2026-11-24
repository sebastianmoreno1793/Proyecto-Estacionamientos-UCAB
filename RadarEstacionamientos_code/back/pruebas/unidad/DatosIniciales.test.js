// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Prueba que la lista sirva para dibujar el mapa
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Prueba el catálogo inicial de edificios
// Pruebas de los datos iniciales del campus (back/datos/basedatos/datos_iniciales/). Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { CAPACIDAD_DE_EJEMPLO } from "../../datos/basedatos/datos_iniciales/capacidad_inicial.js";
import { EDIFICIOS } from "../../datos/basedatos/datos_iniciales/edificios.js";
import { CENTRO_CAMPUS, ESTACIONAMIENTOS } from "../../datos/basedatos/datos_iniciales/estacionamientos.js";
import { Estacionamiento } from "../../logica/modelos/Estacionamiento.js";

const esCoordenada = ([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

test("cada estacionamiento tiene id único y nombre", () => {
  const ids = ESTACIONAMIENTOS.map((e) => e.id);
  assert.ok(ids.length > 0);
  assert.equal(new Set(ids).size, ids.length, "hay ids repetidos");
  for (const e of ESTACIONAMIENTOS) {
    assert.match(e.id, /^[a-z0-9-]+$/, `id inválido: ${e.id}`);
    assert.ok(e.nombre && e.nombre.trim().length > 0, `${e.id} no tiene nombre`);
  }
});

test("soloProfesores es true o false y pisos un entero mayor que 0; las zonas de profesores quedan marcadas", () => {
  for (const e of ESTACIONAMIENTOS) {
    if ("soloProfesores" in e) assert.equal(typeof e.soloProfesores, "boolean", `${e.id}: soloProfesores inválido`);
    if ("pisos" in e) assert.ok(Number.isInteger(e.pisos) && e.pisos > 0, `${e.id}: pisos inválido`);
  }
  const profesores = ESTACIONAMIENTOS.filter((e) => e.soloProfesores);
  assert.ok(profesores.length > 0 && profesores.every((e) => e.id.startsWith("prof-")));
});

test("cada estacionamiento es un área con al menos 3 esquinas válidas, a menos de 1 km del campus", () => {
  const [lat0, lng0] = CENTRO_CAMPUS;
  for (const e of ESTACIONAMIENTOS) {
    assert.ok(e.poligono.length >= 3, `${e.id} tiene menos de 3 esquinas`);
    for (const p of e.poligono) {
      assert.ok(esCoordenada(p), `${e.id}: coordenada inválida ${p}`);
      assert.ok(Math.abs(p[0] - lat0) < 0.009 && Math.abs(p[1] - lng0) < 0.009, `${e.id} está lejos del campus`);
    }
  }
});

test("en el campus no quedan dos estacionamientos con la misma etiqueta", () => {
  const etiquetas = Estacionamiento.etiquetasUnicas(ESTACIONAMIENTOS);
  assert.equal(new Set(etiquetas).size, etiquetas.length);
});

test("la capacidad de ejemplo tiene exactamente los estacionamientos del mapa", () => {
  // Si falla, alguien cambió estacionamientos.js: actualiza capacidad_inicial.js.
  assert.deepEqual(Object.keys(CAPACIDAD_DE_EJEMPLO).sort(), ESTACIONAMIENTOS.map((e) => e.id).sort());
});

test("catálogo inicial de edificios: ids únicos, nombres no vacíos y ubicaciones cerca del campus", () => {
  const ids = EDIFICIOS.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, "hay ids repetidos");
  for (const e of EDIFICIOS) {
    assert.ok(e.nombre.trim().length > 0, `${e.id} no tiene nombre`);
    if (e.ubicacion) assert.ok(Math.abs(e.ubicacion[0] - CENTRO_CAMPUS[0]) < 0.015 && Math.abs(e.ubicacion[1] - CENTRO_CAMPUS[1]) < 0.015, e.id);
  }
});
