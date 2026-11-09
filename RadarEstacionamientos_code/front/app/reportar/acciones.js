"use server";

// HU 9.1 · Acción del servidor que recibe el formulario de Reportar y la guarda en el back.
import { revalidatePath } from "next/cache";
import { listarEstacionamientos } from "@back/logica/estacionamientos/datos";
import { emitir } from "@back/logica/eventos_en_vivo";
import { registrarIncidencia, vistaPublica } from "@back/logica/incidencias/datos";
import { nombreDelTipo } from "@back/logica/incidencias/reglas";
import { formatearFechaHora } from "@back/logica/fechas";
import { obtenerUsuarioActual } from "@/servidor/sesion";

export async function reportarIncidencia(_estadoAnterior, formData) {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) return { error: "Inicia sesión para reportar una incidencia." };

  const resultado = await registrarIncidencia({
    estacionamientoId: formData.get("estacionamientoId"),
    tipo: formData.get("tipo"),
    reportadaPor: usuario.correo,
  });
  // Con el error vuelven los valores elegidos (React 19 vacía el formulario tras enviar).
  if (resultado.error) return { error: resultado.error, valores: Object.fromEntries(formData) };

  const { incidencia } = resultado;
  emitir("INCIDENCIA", { incidencia: vistaPublica(incidencia) });
  const estacionamientos = await listarEstacionamientos();
  revalidatePath("/admin/incidencias");
  return {
    reporte: {
      estacionamiento: estacionamientos.find((e) => e.id === incidencia.estacionamientoId).etiqueta,
      tipoId: incidencia.tipo,
      tipo: nombreDelTipo(incidencia.tipo),
      hora: formatearFechaHora(incidencia.reportadaEn),
      estado: incidencia.estado,
    },
  };
}
