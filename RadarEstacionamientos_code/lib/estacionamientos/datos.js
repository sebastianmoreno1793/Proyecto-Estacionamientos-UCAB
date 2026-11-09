import { obtenerAlmacen } from "../almacen.js";
import { aplicarMovimiento, porcentajeDeOcupacion, puestosLibres, validarCapacidad } from "./reglas.js";

export async function listarEstacionamientos() {
  return obtenerAlmacen().estacionamientos.map((e) => ({ ...e }));
}

export async function listarEstacionamientosActivos() {
  return (await listarEstacionamientos()).filter((e) => e.activo);
}

// Lo que cualquiera puede ver de un estacionamiento (mapa, API, canal en vivo).
export function vistaPublica(estacionamiento) {
  const { id, nombre, etiqueta, soloProfesores, capacidad, ocupados, activo } = estacionamiento;
  return {
    id,
    nombre,
    etiqueta,
    soloProfesores,
    capacidad,
    ocupados,
    libres: puestosLibres(estacionamiento),
    porcentaje: porcentajeDeOcupacion(estacionamiento),
    activo,
  };
}

// HU 5.4 (antes 10.1): el administrador cambia la capacidad y si el estacionamiento está abierto.
// `activo` es opcional: si no viene, se queda como estaba.
export async function cambiarEstacionamiento(id, { capacidad, activo }) {
  const estacionamiento = obtenerAlmacen().estacionamientos.find((e) => e.id === id);
  if (!estacionamiento) return { error: "Ese estacionamiento no existe." };

  const validacion = validarCapacidad(capacidad);
  if (validacion.error) return { error: validacion.error };

  if (activo !== undefined && typeof activo !== "boolean") return { error: "«activo» debe ser true o false." };

  estacionamiento.capacidad = validacion.capacidad;
  if (activo !== undefined) estacionamiento.activo = activo;
  return { estacionamiento: { ...estacionamiento } };
}

// HU 3.1 + 4.1: el sensor de un estacionamiento avisa una entrada o salida; queda registrada
// con la hora y cambia los puestos libres. `idAviso` lo pone el sensor: si reintenta el mismo
// aviso (p. ej. por un corte de red), no se cuenta dos veces.
// HU 4.1 (RN3 y RN4): un aviso rechazado no cambia el aforo, pero queda registrado con la hora y
// el motivo («no_existe» = rechazado; «lleno», «vacio», «desactivado», «tipo» = anomalía).
function registrarRechazo(almacen, { estacionamientoId, tipo, idAviso }, motivo, ahora) {
  const rechazo = { id: crypto.randomUUID(), idAviso, estacionamientoId, tipo, motivo, hora: ahora.toISOString() };
  almacen.avisosRechazados.push(rechazo);
  return rechazo;
}

export async function registrarAviso({ estacionamientoId, tipo, idAviso = null }, ahora = new Date()) {
  const almacen = obtenerAlmacen();
  const estacionamiento = almacen.estacionamientos.find((e) => e.id === estacionamientoId);
  if (!estacionamiento) {
    registrarRechazo(almacen, { estacionamientoId, tipo, idAviso }, "no_existe", ahora);
    return { error: `El estacionamiento «${estacionamientoId}» no existe.`, motivo: "no_existe" };
  }

  if (idAviso) {
    // El mismo aviso del mismo sensor (no basta el id: otro estacionamiento podría repetirlo).
    const repetido = almacen.movimientos.find(
      (m) => m.idAviso === idAviso && m.estacionamientoId === estacionamientoId,
    );
    if (repetido) return { movimiento: { ...repetido }, estacionamiento: { ...estacionamiento }, repetido: true };
  }

  const tipoNormalizado = String(tipo ?? "")
    .toUpperCase()
    .trim();
  const resultado = aplicarMovimiento(estacionamiento, tipoNormalizado);
  if (resultado.error) {
    registrarRechazo(almacen, { estacionamientoId, tipo: tipoNormalizado, idAviso }, resultado.motivo, ahora);
    return resultado;
  }

  estacionamiento.ocupados = resultado.ocupados;
  const movimiento = {
    id: crypto.randomUUID(),
    idAviso,
    estacionamientoId,
    tipo: tipoNormalizado,
    hora: ahora.toISOString(),
  };
  almacen.movimientos.push(movimiento);
  return { movimiento: { ...movimiento }, estacionamiento: { ...estacionamiento } };
}

// Los avisos rechazados más recientes primero (HU 4.1, CA3 a CA5).
export async function listarAvisosRechazados(limite = 50) {
  return obtenerAlmacen()
    .avisosRechazados.slice(-limite)
    .reverse()
    .map((a) => ({ ...a }));
}

export async function listarMovimientos(limite = 50) {
  return obtenerAlmacen()
    .movimientos.slice(-limite)
    .reverse()
    .map((m) => ({ ...m }));
}
