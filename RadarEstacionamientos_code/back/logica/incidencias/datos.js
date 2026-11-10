// @HU-9.1 Crear una incidencia · Sebastian — Aquí se guardan las incidencias como «pendiente», con fecha y hora
// HU 9.1 · Guarda y lista las incidencias reportadas por los conductores.
import { obtenerAlmacen } from "../../comun/almacen.js";
import { ESTADO_PENDIENTE, nombreDelTipo, validarReporte } from "./reglas.js";

// Lo que se puede mostrar o emitir de una incidencia: sin el correo de quien la reportó.
export function vistaPublica({ id, estacionamientoId, tipo, estado, reportadaEn }) {
  return { id, estacionamientoId, tipo, nombreTipo: nombreDelTipo(tipo), estado, reportadaEn };
}

// @HU-9.1 Crear una incidencia · Sebastian — con la hora y como pendiente
// HU 9.1: el reporte queda registrado con la hora y como pendiente.
// Valida y guarda la incidencia; exige el correo de quien reporta (RN4). Devuelve { incidencia } o { error }. [datos]
export async function registrarIncidencia({ estacionamientoId, tipo, reportadaPor }, ahora = new Date()) {
  if (!reportadaPor) return { error: "Inicia sesión para reportar una incidencia." }; // RN4
  const almacen = obtenerAlmacen();
  const validacion = validarReporte({ estacionamientoId, tipo }, almacen.estacionamientos);
  if (validacion.error) return { error: validacion.error };

  const incidencia = {
    id: crypto.randomUUID(),
    estacionamientoId,
    tipo,
    estado: ESTADO_PENDIENTE,
    reportadaEn: ahora.toISOString(),
    reportadaPor,
  };
  almacen.incidencias.push(incidencia);
  return { incidencia: { ...incidencia } };
}

// Devuelve copias de todas las incidencias guardadas (HU 9.1). [datos]
export async function listarIncidencias() {
  return obtenerAlmacen().incidencias.map((i) => ({ ...i }));
}
