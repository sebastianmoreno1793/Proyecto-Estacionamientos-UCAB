"use server";

import { revalidatePath } from "next/cache";
import { cambiarEstacionamiento, vistaPublica } from "@/lib/estacionamientos/datos";
import { emitir } from "@/lib/eventos_en_vivo";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";

export async function guardarEstacionamiento(_estadoAnterior, formData) {
  const usuario = await obtenerUsuarioActual();
  if (!esAdministrador(usuario)) {
    return { error: "Solo el administrador puede cambiar los estacionamientos." };
  }

  const resultado = await cambiarEstacionamiento(formData.get("id"), {
    capacidad: formData.get("capacidad"),
    activo: formData.get("activo") === "on",
  });
  if (resultado.error) return { error: resultado.error };

  emitir("ESTACIONAMIENTO", { estacionamiento: vistaPublica(resultado.estacionamiento) });
  revalidatePath("/admin/estacionamientos");
  return { mensaje: "Cambios guardados." };
}
