// Comprueba que el mapa 3D del simulador usa distancias y posiciones reales del campus.
// Los estacionamientos son los de la app base: el test lee su archivo de datos (en
// ejecución, el simulador los pide por la API).
// Se corre con: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { CENTRO_CAMPUS as CENTRO_APP_BASE, ESTACIONAMIENTOS } from "../../RadarEstacionamientos_code/back/datos_del_campus/estacionamientos.js";
import { CENTRO_CAMPUS, CONTORNO_CAMPUS, EDIFICIOS, GARITA, RELIEVE, VIAS } from "../datos_campus/campus.js";
import {
  areaPoligono,
  crearRelieve,
  distribuirPuestos,
  gpsAMetros,
  poligonoAMetros,
  puntoEnPoligono,
  puntoInterior,
} from "../mapa_3d/geo.js";
import { crearGrafo, nodoMasCercano, rutaDesdeGarita, rutaHaciaGarita } from "../mapa_3d/rutas.js";

// Distancia real sobre el elipsoide WGS84 (el de los GPS), con sus radios de curvatura
// en la latitud media. Para tramos de 1 km el error es de milímetros. Ojo: una esfera
// (haversine) no sirve de referencia aquí; exagera las distancias norte-sur un 0,5%.
function distanciaReal([lat1, lon1], [lat2, lon2]) {
  const a = 6378137;
  const e2 = 0.00669437999014;
  const rad = Math.PI / 180;
  const sen = Math.sin(((lat1 + lat2) / 2) * rad);
  const meridiano = (a * (1 - e2)) / (1 - e2 * sen * sen) ** 1.5;
  const normal = a / Math.sqrt(1 - e2 * sen * sen);
  const dNorte = (lat2 - lat1) * rad * meridiano;
  const dEste = (lon2 - lon1) * rad * normal * Math.cos(((lat1 + lat2) / 2) * rad);
  return Math.hypot(dNorte, dEste);
}

const centroDe = (e) => {
  const pts = e.poligono;
  return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
};
const porId = (id) => ESTACIONAMIENTOS.find((e) => e.id === id);

test("el origen del simulador es el mismo centro del campus de la app base", () => {
  assert.deepEqual(CENTRO_CAMPUS, CENTRO_APP_BASE);
});

test("el centro del campus es el origen del mundo 3D", () => {
  const { x, z } = gpsAMetros(...CENTRO_CAMPUS);
  assert.ok(Math.abs(x) < 1e-9 && Math.abs(z) < 1e-9);
});

test("las distancias en metros 3D coinciden con las distancias GPS reales (±0,5%)", () => {
  for (const a of ESTACIONAMIENTOS) {
    for (const b of ESTACIONAMIENTOS) {
      if (a === b) continue;
      const real = distanciaReal(centroDe(a), centroDe(b));
      if (real < 50) continue;
      const pa = gpsAMetros(...centroDe(a));
      const pb = gpsAMetros(...centroDe(b));
      const en3d = Math.hypot(pa.x - pb.x, pa.z - pb.z);
      assert.ok(Math.abs(en3d - real) / real < 0.005, `${a.id} ↔ ${b.id}: ${en3d.toFixed(1)} m vs ${real.toFixed(1)} m`);
    }
  }
});

test("orientación: Playa al norte del Sambilito, Postgrado al oeste, Pádel al suroeste", () => {
  const playa = gpsAMetros(...centroDe(porId("est-playa")));
  const sambilito = gpsAMetros(...centroDe(porId("est-sambilito")));
  const postgrado = gpsAMetros(...centroDe(porId("est-postgrado")));
  const padel = gpsAMetros(...centroDe(porId("est-padel")));
  assert.ok(playa.z < sambilito.z, "la Playa debe quedar al norte (z menor)");
  assert.ok(postgrado.x < sambilito.x, "Postgrado debe quedar al oeste (x menor)");
  assert.ok(padel.x < 0 && padel.z > 0, "Pádel debe quedar al suroeste");
});

test("el contorno del campus mide ~930 m de este a oeste y ~20 ha (OSM)", () => {
  const pts = poligonoAMetros(CONTORNO_CAMPUS);
  const ancho = Math.max(...pts.map((p) => p.x)) - Math.min(...pts.map((p) => p.x));
  assert.ok(ancho > 850 && ancho < 1000, `ancho ${ancho.toFixed(0)} m`);
  const hectareas = areaPoligono(pts) / 10000;
  assert.ok(hectareas > 18 && hectareas < 23, `${hectareas.toFixed(1)} ha`);
});

test("la garita está en la esquina noreste, sobre la Av. Teherán", () => {
  const garita = gpsAMetros(...GARITA.posicion);
  assert.ok(garita.x > 300 && garita.z < -100, `garita en (${garita.x.toFixed(0)}, ${garita.z.toFixed(0)})`);
  assert.deepEqual(GARITA.llegada.at(-1), GARITA.posicion, "la llegada termina en la talanquera");
  assert.deepEqual(GARITA.salida[0], GARITA.posicion, "la salida empieza en la talanquera");
});

test("cada edificio tiene id único, pisos > 0 y un polígono dentro del campus", () => {
  const contorno = poligonoAMetros(CONTORNO_CAMPUS);
  const ids = EDIFICIOS.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const e of EDIFICIOS) {
    assert.ok(Number.isInteger(e.pisos) && e.pisos > 0, `${e.id}: pisos`);
    assert.ok(["OpenStreetMap", "estimado"].includes(e.fuentePisos), `${e.id}: fuentePisos`);
    const { x, z } = puntoInterior(poligonoAMetros(e.poligono));
    assert.ok(puntoEnPoligono(x, z, contorno), `${e.id} queda fuera del campus`);
  }
});

test("el relieve sube de norte (Playa) a sur (canchas), como dice el SRTM", () => {
  const { alturaBase } = crearRelieve(RELIEVE);
  const playa = gpsAMetros(...centroDe(porId("est-playa")));
  const padel = gpsAMetros(...centroDe(porId("est-padel")));
  assert.ok(alturaBase(padel.x, padel.z) > alturaBase(playa.x, playa.z) + 10);
});

test("cada estacionamiento tiene puestos dibujados dentro de su área", () => {
  for (const e of ESTACIONAMIENTOS) {
    const pts = poligonoAMetros(e.poligono);
    const { puestos } = distribuirPuestos(pts);
    assert.ok(puestos.length > 0, `${e.id} no tiene puestos`);
    for (const p of puestos) assert.ok(puntoEnPoligono(p.x, p.z, pts), `${e.id}: puesto fuera`);
  }
});

test("desde la garita se llega a cada estacionamiento y se vuelve, por las vías reales", () => {
  const grafo = crearGrafo(VIAS);
  const garita = nodoMasCercano(grafo, gpsAMetros(...GARITA.posicion));
  const g = grafo.nodos[garita];
  assert.ok(Math.hypot(g.x - gpsAMetros(...GARITA.posicion).x, g.z - gpsAMetros(...GARITA.posicion).z) < 1);
  for (const e of ESTACIONAMIENTOS) {
    const pts = poligonoAMetros(e.poligono);
    const puesto = puntoInterior(pts);
    const ida = rutaDesdeGarita(grafo, garita, pts, puesto);
    const vuelta = rutaHaciaGarita(grafo, garita, pts, puesto);
    assert.ok(ida.puntos.length >= 2 && Number.isFinite(ida.longitud), `${e.id}: sin ruta de entrada`);
    assert.ok(vuelta.puntos.length >= 2 && Number.isFinite(vuelta.longitud), `${e.id}: sin ruta de salida`);
    const ultimo = ida.puntos.at(-1);
    assert.ok(Math.hypot(ultimo.x - puesto.x, ultimo.z - puesto.z) < 80, `${e.id}: la ruta termina lejos`);
  }
});
