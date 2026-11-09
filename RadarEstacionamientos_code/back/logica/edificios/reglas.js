// Reglas del catálogo de edificios (HU 6.1). Funciones puras: no leen ni guardan datos.

import { CENTRO_CAMPUS } from "../../campus/estacionamientos.js";

export const LARGO_MINIMO_NOMBRE = 2;
export const LARGO_MAXIMO_NOMBRE = 80;

// 0,015° ≈ 1,6 km a esta latitud: más lejos ya no es el Campus Montalbán.
const DISTANCIA_MAXIMA_GRADOS = 0.015;

// Dos nombres son el mismo si solo cambian mayúsculas, tildes o espacios.
export function normalizarNombre(nombre) {
  return String(nombre ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// "Edificio de Aulas" → "edif-edificio-de-aulas"; si ya existe, le agrega -2, -3…
export function crearId(nombre, idsExistentes) {
  const base =
    "edif-" +
    normalizarNombre(nombre)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  let id = base;
  for (let n = 2; idsExistentes.includes(id); n += 1) id = `${base}-${n}`;
  return id;
}

function leerCoordenada(valor) {
  const texto = String(valor ?? "").trim().replace(",", ".");
  if (texto === "") return { vacia: true };
  if (!/^-?\d+(\.\d+)?$/.test(texto)) return { error: true };
  return { numero: Number(texto) };
}

// Valida lo que escribe el administrador. `idActual` es el edificio que se está
// modificando (para no chocar con su propio nombre); al agregar uno nuevo es null.
export function validarEdificio({ nombre, latitud, longitud }, edificios, idActual = null) {
  const limpio = String(nombre ?? "").replace(/\s+/g, " ").trim();
  if (limpio.length < LARGO_MINIMO_NOMBRE) {
    return { error: "Escribe el nombre del edificio." };
  }
  if (!/[a-z0-9]/.test(normalizarNombre(limpio))) {
    return { error: "El nombre debe tener letras o números." };
  }
  if (limpio.length > LARGO_MAXIMO_NOMBRE) {
    return { error: `El nombre no puede pasar de ${LARGO_MAXIMO_NOMBRE} caracteres.` };
  }
  const repetido = edificios.some(
    (e) => e.id !== idActual && normalizarNombre(e.nombre) === normalizarNombre(limpio)
  );
  if (repetido) return { error: "Ya hay un edificio con ese nombre." };

  const lat = leerCoordenada(latitud);
  const lon = leerCoordenada(longitud);
  if (lat.error || lon.error) {
    return { error: "La latitud y la longitud deben ser números, por ejemplo 10.4642 y -66.9762." };
  }
  if (lat.vacia !== lon.vacia) {
    return { error: "Escribe la latitud y la longitud juntas, o deja las dos vacías." };
  }
  if (lat.vacia) return { nombre: limpio, ubicacion: null };

  const lejos =
    Math.abs(lat.numero - CENTRO_CAMPUS[0]) > DISTANCIA_MAXIMA_GRADOS ||
    Math.abs(lon.numero - CENTRO_CAMPUS[1]) > DISTANCIA_MAXIMA_GRADOS;
  if (lejos) return { error: "Esa ubicación queda fuera del Campus Montalbán." };

  return { nombre: limpio, ubicacion: [lat.numero, lon.numero] };
}

// La lista que ve el usuario al elegir el edificio de una materia: ordenada por nombre.
export function ordenarPorNombre(edificios) {
  return [...edificios].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}
