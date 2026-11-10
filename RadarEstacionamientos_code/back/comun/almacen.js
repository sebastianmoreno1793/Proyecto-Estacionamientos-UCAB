// Almacén en memoria, TEMPORAL mientras el equipo elige la base de datos
// (preguntas_abiertas.md). Los datos vuelven a los de ejemplo al reiniciar el servidor.
// Solo lo usan los módulos `datos.js`; al llegar la base de datos se cambian ellos y nada más.
import { ESTACIONAMIENTOS } from "../campus/estacionamientos.js";
import { CAPACIDAD_DE_EJEMPLO, CAPACIDAD_POR_DEFECTO } from "../campus/capacidad_inicial.js";
import { etiquetasUnicas } from "../logica/estacionamientos/reglas.js";
import { EDIFICIOS } from "../campus/edificios.js";

// Copia el catálogo inicial de edificios para no cambiar el original (HU 6.1).
function copiarEdificios() {
  return EDIFICIOS.map((e) => ({ ...e, ubicacion: e.ubicacion ? [...e.ubicacion] : null }));
}

// Arma el almacén con los datos de ejemplo: estacionamientos, edificios y listas vacías.
function crearAlmacen() {
  const etiquetas = etiquetasUnicas(ESTACIONAMIENTOS);
  return {
    estacionamientos: ESTACIONAMIENTOS.map(({ id, nombre, soloProfesores = false }, i) => ({
      id,
      nombre,
      etiqueta: etiquetas[i],
      soloProfesores,
      ...(CAPACIDAD_DE_EJEMPLO[id] ?? CAPACIDAD_POR_DEFECTO),
      activo: true,
    })),
    incidencias: [],
    movimientos: [], // HU 3.1: avisos de entrada y salida de los sensores
    avisosRechazados: [], // HU 4.1: avisos que no cambiaron el aforo (rechazados o anomalías)
    lecturasDePlaca: [], // HU 3.2: placas que lee el lector de la garita
    edificios: copiarEdificios(), // HU 6.1: catálogo de edificios UCAB
  };
}

// En globalThis para que sobreviva a las recargas de `next dev`.
// Devuelve el almacén en memoria; lo crea la primera vez y completa las listas que falten.
export function obtenerAlmacen() {
  globalThis.__radarAlmacen ??= crearAlmacen();
  // Si `next dev` ya tenía un almacén de antes de agregar una lista, se completa.
  globalThis.__radarAlmacen.movimientos ??= [];
  globalThis.__radarAlmacen.avisosRechazados ??= [];
  globalThis.__radarAlmacen.lecturasDePlaca ??= [];
  globalThis.__radarAlmacen.edificios ??= copiarEdificios();
  return globalThis.__radarAlmacen;
}

// Borra todo lo guardado y vuelve a los datos de ejemplo (lo usa POST /api/pruebas/reiniciar).
export function reiniciarAlmacen() {
  globalThis.__radarAlmacen = crearAlmacen();
}
