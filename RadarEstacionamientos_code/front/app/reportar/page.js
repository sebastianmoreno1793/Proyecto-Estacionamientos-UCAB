// @PANTALLA Reportar (/reportar) — la pantalla para reportar un problema (incidencia)
// @HU-9.1 Crear una incidencia · Sebastian — Pantalla «Reportar»
// Ruta /reportar · Solo monta su vista. Desde la tarjeta del mapa llega con ?estacionamiento=<id> y ese
// ya viene elegido. La sesión la revisa front/middleware.js.
import FormularioIncidencia from "@/vistas/reportar/FormularioIncidencia";

export const metadata = { title: "Reportar una incidencia" };

export default async function PaginaReportar({ searchParams }) {
  const { estacionamiento = "" } = await searchParams;
  return (
    <main className="pantalla">
      <h1>Reportar</h1>
      <FormularioIncidencia elegido={estacionamiento} />
    </main>
  );
}
