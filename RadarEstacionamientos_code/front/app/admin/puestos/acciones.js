"use server";

// HU 5.4 · Acción del servidor que guarda la capacidad y el estado de un estacionamiento.
import { revalidatePath } from "next/cache";
import { cambiarEstacionamiento, vistaPublica } from "@back/logica/estacionamientos/datos";
import { emitir } from "@back/logica/eventos_en_vivo";
import { esAdministrador, obtenerUsuarioActual } from "@/servidor/sesion";

export async function guardarEstacionamiento(_estadoAnterior, formData) {
  const usuario = await obtenerUsuarioActual();
  if (!esAdministrador(usuario)) {
    return { error: "Solo el administrador puede cambiar los estacionamientos." };
  }

  const resultado = await cambiarEstacionamiento(formData.get("id"), {
    capacidad: formData.get("capacidad"),
    activo: formData.get("activo") === "on",
  });
  // Con el error vuelven los valores escritos (React 19 vacía el formulario tras enviar).
  if (resultado.error) {
    return {
      error: resultado.error,
      valores: { capacidad: formData.get("capacidad"), activo: formData.get("activo") === "on" },
    };
  }

  emitir("ESTACIONAMIENTO", { estacionamiento: vistaPublica(resultado.estacionamiento) });
  revalidatePath("/admin/puestos");
  return { mensaje: "Cambios guardados." };
}
