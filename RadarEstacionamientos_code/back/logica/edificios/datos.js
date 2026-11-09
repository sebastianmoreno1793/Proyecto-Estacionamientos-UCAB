// HU 6.1 · Guarda el catálogo de edificios: agregar, modificar, quitar y listar.
import { obtenerAlmacen } from "../almacen.js";
import { crearId, ordenarPorNombre, validarEdificio } from "./reglas.js";

// HU 6.1: esta es la lista que ve el usuario al elegir el edificio de una materia.
export async function listarEdificios() {
  return ordenarPorNombre(obtenerAlmacen().edificios).map(copiar);
}

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

export async function quitarEdificio(id) {
  const { edificios } = obtenerAlmacen();
  const posicion = edificios.findIndex((e) => e.id === id);
  if (posicion === -1) return { error: "Ese edificio no existe." };
  const [quitado] = edificios.splice(posicion, 1);
  return { edificio: copiar(quitado) };
}

function copiar(edificio) {
  return { ...edificio, ubicacion: edificio.ubicacion ? [...edificio.ubicacion] : null };
}
