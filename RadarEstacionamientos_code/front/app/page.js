// @PANTALLA Inicio (/) — la pantalla de inicio: botones de edificios, «Más cerca» y los estacionamientos con su semáforo
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Pantalla Inicio con el semáforo de cada estacionamiento
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Pantalla Inicio con el atajo «Más cerca»
// @HU-8.1 Activar las notificaciones · Manuel — Pantalla Inicio, donde aparece la invitación a activar notificaciones
// Ruta / · Solo monta su vista. La sesión la revisa front/middleware.js antes de llegar aquí.
import Inicio from "@/vistas/inicio/Inicio";
import Notificaciones from "@/vistas/notificaciones/Notificaciones";

export const metadata = { title: "Radar UCAB" };

export default function PaginaInicio() {
  return (
    <>
      <h1 className="oculto-visual">Radar de Estacionamientos UCAB</h1>
      <Inicio />
      {/* HU 8.1: la primera vez se pide permiso para las notificaciones. */}
      <Notificaciones modo="invitacion" />
    </>
  );
}
