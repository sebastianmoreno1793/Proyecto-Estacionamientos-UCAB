// Reglas de las incidencias (HU 9.1). Funciones puras: no leen ni guardan datos.

export const TIPOS_DE_INCIDENCIA = [
  { id: "bateria_descargada", nombre: "Batería descargada" },
  { id: "conos_atravesados", nombre: "Conos atravesados" },
  { id: "vehiculo_mal_estacionado", nombre: "Vehículo mal estacionado" },
];

export const ESTADO_PENDIENTE = "pendiente";

export function nombreDelTipo(tipo) {
  return TIPOS_DE_INCIDENCIA.find((t) => t.id === tipo)?.nombre;
}

// Solo se reporta sobre estacionamientos activos: los desactivados no aparecen en la lista.
export function validarReporte({ estacionamientoId, tipo }, estacionamientos) {
  const existe = estacionamientos.some((e) => e.id === estacionamientoId && e.activo);
  if (!existe) return { error: "Elige un estacionamiento de la lista." };
  if (!nombreDelTipo(tipo)) return { error: "Elige el tipo de problema." };
  return { estacionamientoId, tipo };
}
