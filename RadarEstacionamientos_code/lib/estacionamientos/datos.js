import { obtenerAlmacen } from "../almacen.js";
import { validarCapacidad } from "./reglas.js";

export async function listarEstacionamientos() {
  return obtenerAlmacen().estacionamientos.map((e) => ({ ...e }));
}

export async function listarEstacionamientosActivos() {
  return (await listarEstacionamientos()).filter((e) => e.activo);
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
