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

// HU 10.1: el administrador cambia la capacidad y si el estacionamiento está activo.
export async function cambiarEstacionamiento(id, { capacidad, activo }) {
  const estacionamiento = obtenerAlmacen().estacionamientos.find((e) => e.id === id);
  if (!estacionamiento) return { error: "Ese estacionamiento no existe." };

  const validacion = validarCapacidad(capacidad);
  if (validacion.error) return { error: validacion.error };

  estacionamiento.capacidad = validacion.capacidad;
  estacionamiento.activo = Boolean(activo);
  return { estacionamiento: { ...estacionamiento } };
}

// HU 3.1 + 4.1: el sensor de un estacionamiento avisa una entrada o salida; queda registrada
// con la hora y cambia los puestos libres. `idAviso` lo pone el sensor: si reintenta el mismo
// aviso (p. ej. por un corte de red), no se cuenta dos veces.
export async function registrarAviso({ estacionamientoId, tipo, idAviso = null }, ahora = new Date()) {
  const almacen = obtenerAlmacen();
  const estacionamiento = almacen.estacionamientos.find((e) => e.id === estacionamientoId);
  if (!estacionamiento) return { error: `El estacionamiento «${estacionamientoId}» no existe.`, motivo: "no_existe" };

  if (idAviso) {
    const repetido = almacen.movimientos.find((m) => m.idAviso === idAviso);
    if (repetido) return { movimiento: { ...repetido }, estacionamiento: { ...estacionamiento }, repetido: true };
  }

  const tipoNormalizado = String(tipo ?? "").toUpperCase().trim();
  const resultado = aplicarMovimiento(estacionamiento, tipoNormalizado);
  if (resultado.error) return resultado;

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

export async function listarMovimientos(limite = 50) {
  return obtenerAlmacen().movimientos.slice(-limite).reverse().map((m) => ({ ...m }));
}
