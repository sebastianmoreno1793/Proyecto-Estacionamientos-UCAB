// @HU-3.1 Recibir avisos de entrada y salida · Aaron
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
// @HU-4.2 Consultar el semáforo de ocupación · Aaron
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
// HU 3.1, 4.1, 4.2 y 5.4 · Lee y cambia los estacionamientos guardados: avisos de
// entrada y salida, capacidad, abierto o cerrado, y la vista pública (sin datos personales).
import { obtenerAlmacen } from "../../comun/almacen.js";
import { aplicarMovimiento, porcentajeDeOcupacion, puestosLibres, validarCapacidad } from "./reglas.js";

// Devuelve copias de todos los estacionamientos guardados. [datos]
export async function listarEstacionamientos() {
  return obtenerAlmacen().estacionamientos.map((e) => ({ ...e }));
}

// Devuelve solo los estacionamientos abiertos (HU 5.4). [datos]
export async function listarEstacionamientosActivos() {
  return (await listarEstacionamientos()).filter((e) => e.activo);
}

// @HU-4.2 Consultar el semáforo de ocupación · Aaron — libres y porcentaje para el mapa
// Lo que cualquiera puede ver de un estacionamiento (mapa, API, canal en vivo).
// Arma la vista sin datos personales, con libres y porcentaje ya calculados (HU 4.2).
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

// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
// HU 5.4 (antes 10.1): el administrador cambia la capacidad y si el estacionamiento está abierto.
// `activo` es opcional: si no viene, se queda como estaba. [datos]
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
// con la hora y cambia los puestos libres. `idAviso` lo pone el sensor y se guarda tal cual.
// HU 4.1 (RN3 y RN4): un aviso rechazado no cambia el aforo, pero queda registrado con la hora y
// el motivo («no_existe» = rechazado; «lleno», «vacio», «tipo» = anomalía).
// Guarda un aviso rechazado con su motivo y su hora (HU 4.1). [datos]
function registrarRechazo(almacen, { estacionamientoId, tipo, idAviso }, motivo, ahora) {
  const rechazo = { id: crypto.randomUUID(), idAviso, estacionamientoId, tipo, motivo, hora: ahora.toISOString() };
  almacen.avisosRechazados.push(rechazo);
  return rechazo;
}

// @HU-3.1 Recibir avisos de entrada y salida · Aaron — registra el movimiento con la hora
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — cambia los ocupados
// Registra una ENTRADA o SALIDA y actualiza los ocupados; guarda los rechazos (HU 3.1 y 4.1).
// Devuelve { movimiento, estacionamiento } o { error, motivo }. [datos]
export async function registrarAviso({ estacionamientoId, tipo, idAviso = null }, ahora = new Date()) {
  const almacen = obtenerAlmacen();
  const estacionamiento = almacen.estacionamientos.find((e) => e.id === estacionamientoId);
  if (!estacionamiento) {
    registrarRechazo(almacen, { estacionamientoId, tipo, idAviso }, "no_existe", ahora);
    return { error: `El estacionamiento «${estacionamientoId}» no existe.`, motivo: "no_existe" };
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

// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
// Los avisos rechazados más recientes primero (HU 4.1, CA3 a CA5). [datos]
export async function listarAvisosRechazados(limite = 50) {
  return obtenerAlmacen()
    .avisosRechazados.slice(-limite)
    .reverse()
    .map((a) => ({ ...a }));
}

// @HU-3.1 Recibir avisos de entrada y salida · Aaron
// Devuelve los últimos avisos aceptados, el más reciente primero (HU 3.1). [datos]
export async function listarMovimientos(limite = 50) {
  return obtenerAlmacen()
    .movimientos.slice(-limite)
    .reverse()
    .map((m) => ({ ...m }));
}
