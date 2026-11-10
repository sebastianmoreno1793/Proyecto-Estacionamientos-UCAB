// Formato de fechas y horas para mostrar (zona horaria de Caracas).
const formatoHora = new Intl.DateTimeFormat("es-VE", {
  timeZone: "America/Caracas",
  dateStyle: "short",
  timeStyle: "short",
});

// Convierte una fecha ISO en texto corto con fecha y hora de Caracas.
export function formatearFechaHora(iso) {
  return formatoHora.format(new Date(iso));
}
