// Formato de fechas y horas para mostrar (zona horaria de Caracas).
const formatoHora = new Intl.DateTimeFormat("es-VE", {
  timeZone: "America/Caracas",
  dateStyle: "short",
  timeStyle: "short",
});

export function formatearFechaHora(iso) {
  return formatoHora.format(new Date(iso));
}
