"use server";

import { revalidatePath } from "next/cache";
import { agregarEdificio, modificarEdificio, quitarEdificio } from "@/lib/edificios/datos";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";

const SOLO_ADMIN = { error: "Solo el administrador puede cambiar los edificios." };

function leerFormulario(formData) {
  return {
    nombre: formData.get("nombre"),
    latitud: formData.get("latitud"),
    longitud: formData.get("longitud"),
  };
}

export async function guardarEdificioNuevo(_estadoAnterior, formData) {
  if (!esAdministrador(await obtenerUsuarioActual())) return SOLO_ADMIN;

  const resultado = await agregarEdificio(leerFormulario(formData));
  // Con el error vuelven los valores escritos (React 19 vacía el formulario tras enviar).
  if (resultado.error) return { error: resultado.error, valores: leerFormulario(formData) };

  revalidatePath("/admin/edificios");
  return { mensaje: `Se agregó "${resultado.edificio.nombre}".`, version: Date.now() };
}

export async function guardarEdificio(_estadoAnterior, formData) {
  if (!esAdministrador(await obtenerUsuarioActual())) return SOLO_ADMIN;

  const resultado = await modificarEdificio(formData.get("id"), leerFormulario(formData));
  if (resultado.error) return { error: resultado.error, valores: leerFormulario(formData) };

  revalidatePath("/admin/edificios");
  return { mensaje: "Cambios guardados." };
}

export async function borrarEdificio(_estadoAnterior, formData) {
  if (!esAdministrador(await obtenerUsuarioActual())) return SOLO_ADMIN;

  const resultado = await quitarEdificio(formData.get("id"));
  if (resultado.error) return { error: resultado.error };

  revalidatePath("/admin/edificios");
  return { mensaje: `Se quitó "${resultado.edificio.nombre}".` };
}
