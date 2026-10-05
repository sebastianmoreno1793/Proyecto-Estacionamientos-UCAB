// Almacén en memoria, TEMPORAL mientras el equipo elige la base de datos
// (preguntas_abiertas.md). Los datos vuelven a los de ejemplo al reiniciar el servidor.
// Solo lo usan los módulos `datos.js`; al llegar la base de datos se cambian ellos y nada más.
import { ESTACIONAMIENTOS } from "../data/estacionamientos.js";
import { CAPACIDAD_DE_EJEMPLO, CAPACIDAD_POR_DEFECTO } from "./datos_de_ejemplo.js";
import { etiquetasUnicas } from "./estacionamientos/reglas.js";
import { EDIFICIOS } from "../data/edificios.js";

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
    edificios: EDIFICIOS.map((e) => ({ ...e, ubicacion: e.ubicacion ? [...e.ubicacion] : null })),
  };
}

// En globalThis para que sobreviva a las recargas de `next dev`.
export function obtenerAlmacen() {
  globalThis.__radarAlmacen ??= crearAlmacen();
  return globalThis.__radarAlmacen;
}

export function reiniciarAlmacen() {
  globalThis.__radarAlmacen = crearAlmacen();
}
