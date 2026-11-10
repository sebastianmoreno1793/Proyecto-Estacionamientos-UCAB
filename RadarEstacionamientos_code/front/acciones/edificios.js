"use server";
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — agregar, modificar y quitar

// HU 6.1 · Acciones del servidor para agregar, modificar y quitar edificios (solo administrador).
import { revalidatePath } from "next/cache";
import { agregarEdificio, modificarEdificio, quitarEdificio } from "@back/logica/edificios/datos.js";
import { esAdministrador, obtenerUsuarioActual } from "@/servidor/sesion";

const SOLO_ADMIN = { error: "Solo el administrador puede cambiar los edificios." };

// Saca nombre, latitud y longitud del formulario. La usan las tres acciones de este archivo.
function leerFormulario(formData) {
  return {
    nombre: formData.get("nombre"),
    latitud: formData.get("latitud"),
    longitud: formData.get("longitud"),
  };
}

// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — agregar
// Revisa que sea administrador y agrega el edificio con agregarEdificio del back.
// La llama el formulario NuevoEdificio de /admin/edificios (HU 6.1). [accion] [sesion]
export async function guardarEdificioNuevo(_estadoAnterior, formData) {
  if (!esAdministrador(await obtenerUsuarioActual())) return SOLO_ADMIN;

  const resultado = await agregarEdificio(leerFormulario(formData));
  // Con el error vuelven los valores escritos (React 19 vacía el formulario tras enviar).
  if (resultado.error) return { error: resultado.error, valores: leerFormulario(formData) };

  revalidatePath("/admin/edificios");
  return { mensaje: `Se agregó "${resultado.edificio.nombre}".`, version: Date.now() };
}

// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — modificar
// Revisa que sea administrador y guarda los cambios con modificarEdificio del back.
// La llama el formulario de FilaEdificio en /admin/edificios (HU 6.1). [accion] [sesion]
export async function guardarEdificio(_estadoAnterior, formData) {
  if (!esAdministrador(await obtenerUsuarioActual())) return SOLO_ADMIN;

  const resultado = await modificarEdificio(formData.get("id"), leerFormulario(formData));
  if (resultado.error) return { error: resultado.error, valores: leerFormulario(formData) };

  revalidatePath("/admin/edificios");
  return { mensaje: "Cambios guardados." };
}

// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — quitar
// Revisa que sea administrador y quita el edificio con quitarEdificio del back.
// La llama el botón Quitar de FilaEdificio en /admin/edificios (HU 6.1). [accion] [sesion]
export async function borrarEdificio(_estadoAnterior, formData) {
  if (!esAdministrador(await obtenerUsuarioActual())) return SOLO_ADMIN;

  const resultado = await quitarEdificio(formData.get("id"));
  if (resultado.error) return { error: resultado.error };

  revalidatePath("/admin/edificios");
  return { mensaje: `Se quitó "${resultado.edificio.nombre}".` };
}
