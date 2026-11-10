// HU 6.1 · Guarda el catálogo de edificios: agregar, modificar, quitar y listar.
import { obtenerAlmacen } from "../../comun/almacen.js";
import { crearId, ordenarPorNombre, validarEdificio } from "./reglas.js";

// HU 6.1: esta es la lista que ve el usuario al elegir el edificio de una materia.
// Devuelve copias de los edificios ordenadas por nombre. [datos]
export async function listarEdificios() {
  return ordenarPorNombre(obtenerAlmacen().edificios).map(copiar);
}

// Valida y guarda un edificio nuevo con id único (HU 6.1). Devuelve { edificio } o { error }. [datos]
export async function agregarEdificio(datos) {
  const { edificios } = obtenerAlmacen();
  const validacion = validarEdificio(datos, edificios);
  if (validacion.error) return { error: validacion.error };

  const edificio = {
    id: crearId(validacion.nombre, edificios.map((e) => e.id)),
    nombre: validacion.nombre,
    ubicacion: validacion.ubicacion,
  };
  edificios.push(edificio);
  return { edificio: copiar(edificio) };
}

// Cambia el nombre y la ubicación de un edificio existente (HU 6.1). [datos]
export async function modificarEdificio(id, datos) {
  const { edificios } = obtenerAlmacen();
  const edificio = edificios.find((e) => e.id === id);
  if (!edificio) return { error: "Ese edificio no existe." };

  const validacion = validarEdificio(datos, edificios, id);
  if (validacion.error) return { error: validacion.error };

  edificio.nombre = validacion.nombre;
  edificio.ubicacion = validacion.ubicacion;
  return { edificio: copiar(edificio) };
}

// Quita un edificio del catálogo y devuelve el que se quitó (HU 6.1). [datos]
export async function quitarEdificio(id) {
  const { edificios } = obtenerAlmacen();
  const posicion = edificios.findIndex((e) => e.id === id);
  if (posicion === -1) return { error: "Ese edificio no existe." };
  const [quitado] = edificios.splice(posicion, 1);
  return { edificio: copiar(quitado) };
}

// Devuelve una copia del edificio para que nadie cambie el almacén por fuera.
function copiar(edificio) {
  return { ...edificio, ubicacion: edificio.ubicacion ? [...edificio.ubicacion] : null };
}
