import { obtenerAlmacen } from "../almacen.js";
import { ESTADO_PENDIENTE, nombreDelTipo, validarReporte } from "./reglas.js";

// Lo que se puede mostrar o emitir de una incidencia: sin el correo de quien la reportó.
export function vistaPublica({ id, estacionamientoId, tipo, estado, reportadaEn }) {
  return { id, estacionamientoId, tipo, nombreTipo: nombreDelTipo(tipo), estado, reportadaEn };
}

// HU 9.1: el reporte queda registrado con la hora y como pendiente.
export async function registrarIncidencia({ estacionamientoId, tipo, reportadaPor }, ahora = new Date()) {
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

export async function listarIncidencias() {
  return obtenerAlmacen().incidencias.map((i) => ({ ...i }));
}
