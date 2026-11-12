// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Elige el estacionamiento libre más cercano al edificio
// HU 7.2 · Sugerir el estacionamiento libre más cercano.
// Reglas puras: no leen ni guardan datos (se prueban en pruebas_automaticas/sugerencia.test.js).
//
// Criterio de aceptación (Issue #9): «El usuario elige el edificio al que va y el sistema le
// sugiere el estacionamiento con puestos libres más cercano a ese edificio, sin tomar en
// cuenta todavía su horario». El horario es la HU 7.1 y los puestos docentes la 7.3 (R2).

import { estacionamientosSugeribles } from "../estacionamientos/reglas.js";

const RADIO_DE_LA_TIERRA_M = 6371000;

// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
// Distancia en línea recta, en metros, entre dos puntos [latitud, longitud] (fórmula de
// Haversine). La distancia caminando por el campus es la HU 6.2 (R2). [regla]
export function distanciaEnMetros([lat1, lon1], [lat2, lon2]) {
  // Pasa grados a radianes.
  const aRadianes = (grados) => (grados * Math.PI) / 180;
  const dLat = aRadianes(lat2 - lat1);
  const dLon = aRadianes(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * RADIO_DE_LA_TIERRA_M * Math.asin(Math.sqrt(a)));
}

// Centro aproximado de un estacionamiento: el promedio de las esquinas de su polígono. [regla]
export function centroDelPoligono(poligono) {
  const suma = poligono.reduce(([la, lo], [lat, lon]) => [la + lat, lo + lon], [0, 0]);
  return [suma[0] / poligono.length, suma[1] / poligono.length];
}

// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — abiertos, con libres, el más cercano
// Elige la sugerencia.
//   edificio          { id, nombre, ubicacion: [lat, lon] | null }
//   estacionamientos  [{ id, nombre, activo, libres, poligono }]
// Devuelve { sugerido, distancia, alternativas } o { error, motivo } si no hay nada que sugerir.
//   motivo: "no_existe" (no hay tal edificio) · "sin_ubicacion" · "sin_puestos" (todo lleno o cerrado)
// Filtra abiertos y con libres, y ordena por distancia (HU 7.2). [regla]
export function sugerirMasCercano(edificio, estacionamientos) {
  if (!edificio) return { error: "Ese edificio no existe.", motivo: "no_existe" };
  if (!edificio.ubicacion) {
    return { error: `«${edificio.nombre}» todavía no tiene ubicación. Pídele al administrador que la agregue.`, motivo: "sin_ubicacion" };
  }

  // Solo abiertos (HU 5.4) y con al menos un puesto libre (D-009). Considera todos, también los de
  // solo profesores: tener en cuenta el rol es la HU 7.3 (R2).
  const candidatos = estacionamientosSugeribles(estacionamientos)
    .filter((e) => e.libres > 0 && e.poligono?.length)
    .map((e) => ({ ...e, distancia: distanciaEnMetros(edificio.ubicacion, centroDelPoligono(e.poligono)) }))
    // El más cercano primero; si están a la misma distancia, el que tiene más libres.
    .sort((a, b) => a.distancia - b.distancia || b.libres - a.libres);

  if (candidatos.length === 0) {
    return { error: "Ahora mismo no hay puestos libres en ningún estacionamiento abierto.", motivo: "sin_puestos" };
  }

  const [sugerido, ...resto] = candidatos;
  return { sugerido, distancia: sugerido.distancia, alternativas: resto.slice(0, 2) };
}
