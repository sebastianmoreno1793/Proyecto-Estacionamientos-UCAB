"use server";

import { revalidatePath } from "next/cache";
import { listarEstacionamientos } from "@/lib/estacionamientos/datos";
import { registrarIncidencia } from "@/lib/incidencias/datos";
import { nombreDelTipo } from "@/lib/incidencias/reglas";
import { formatearFechaHora } from "@/lib/fechas";
import { obtenerUsuarioActual } from "@/lib/sesion";

export async function reportarIncidencia(_estadoAnterior, formData) {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) return { error: "Inicia sesión para reportar una incidencia." };

  const resultado = await registrarIncidencia({
    estacionamientoId: formData.get("estacionamientoId"),
    tipo: formData.get("tipo"),
    reportadaPor: usuario.correo,
  });
  if (resultado.error) return { error: resultado.error };

  const { incidencia } = resultado;
  const estacionamientos = await listarEstacionamientos();
  revalidatePath("/incidencias");
  return {
    reporte: {
      estacionamiento: estacionamientos.find((e) => e.id === incidencia.estacionamientoId).nombre,
      tipo: nombreDelTipo(incidencia.tipo),
      hora: formatearFechaHora(incidencia.reportadaEn),
      estado: incidencia.estado,
    },
  };
}
