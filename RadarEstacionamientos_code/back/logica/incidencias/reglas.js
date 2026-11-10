// @HU-9.1 Crear una incidencia · Sebastian — reglas del reporte
// Reglas de las incidencias (HU 9.1). Funciones puras: no leen ni guardan datos.

// @HU-9.1 Crear una incidencia · Sebastian — los tres tipos de problema
export const TIPOS_DE_INCIDENCIA = [
  { id: "bateria_descargada", nombre: "Batería descargada" },
  { id: "conos_atravesados", nombre: "Conos atravesados" },
  { id: "vehiculo_mal_estacionado", nombre: "Vehículo mal estacionado" },
];

export const ESTADO_PENDIENTE = "pendiente";

// Devuelve el nombre legible de un tipo de incidencia, o undefined si no existe. [regla]
export function nombreDelTipo(tipo) {
  return TIPOS_DE_INCIDENCIA.find((t) => t.id === tipo)?.nombre;
}

// @HU-9.1 Crear una incidencia · Sebastian — dice qué falta
// Solo se reporta sobre estacionamientos activos: los desactivados no aparecen en la lista.
// CA2: si falta algo, dice todo lo que falta elegir (no solo lo primero).
// Valida el estacionamiento y el tipo del reporte (HU 9.1). [regla]
export function validarReporte({ estacionamientoId, tipo }, estacionamientos) {
  const faltan = [];
  if (!estacionamientos.some((e) => e.id === estacionamientoId && e.activo))
    faltan.push("un estacionamiento de la lista");
  if (!nombreDelTipo(tipo)) faltan.push("el tipo de problema");
  if (faltan.length) return { error: `Elige ${faltan.join(" y ")}.`, faltan };
  return { estacionamientoId, tipo };
}
