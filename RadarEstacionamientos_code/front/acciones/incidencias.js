"use server";

// HU 9.1 · Acción del servidor que recibe el formulario de Reportar y la guarda en el back.
import { revalidatePath } from "next/cache";
import { listarEstacionamientos } from "@back/logica/estacionamientos/datos.js";
import { emitir } from "@back/comun/eventos_en_vivo.js";
import { registrarIncidencia, vistaPublica } from "@back/logica/incidencias/datos.js";
import { nombreDelTipo } from "@back/logica/incidencias/reglas.js";
import { formatearFechaHora } from "@back/comun/fechas.js";
import { obtenerUsuarioActual } from "@/servidor/sesion";

// Recibe el formulario de Reportar y guarda la incidencia con registrarIncidencia del back;
// luego la avisa por el canal en vivo. La llama FormularioIncidencia (HU 9.1). [accion] [sesion] [en-vivo]
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
      estacionamiento: estacionamientos.find((e) => e.id === incidencia.estacionamientoId)?.etiqueta ?? incidencia.estacionamientoId,
      tipoId: incidencia.tipo,
      tipo: nombreDelTipo(incidencia.tipo),
      hora: formatearFechaHora(incidencia.reportadaEn),
      estado: incidencia.estado,
    },
  };
}
