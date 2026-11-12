"use server";
// @HU-9.1 Crear una incidencia · Sebastian — Recibe el formulario y registra la incidencia

// HU 9.1 · Acción del servidor que recibe el formulario de Reportar y la guarda en el back.
import { listarEstacionamientos } from "@back/reglas_y_datos/estacionamientos/datos.js";
import { emitir } from "@back/piezas_compartidas/eventos_en_vivo.js";
import { registrarIncidencia, vistaPublica } from "@back/reglas_y_datos/incidencias/datos.js";
import { nombreDelTipo } from "@back/reglas_y_datos/incidencias/reglas.js";
import { formatearFechaHora } from "@back/piezas_compartidas/fechas.js";
import { obtenerUsuarioActual } from "@/sesion_del_usuario/sesion";

// @HU-9.1 Crear una incidencia · Sebastian
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
