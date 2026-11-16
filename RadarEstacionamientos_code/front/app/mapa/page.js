// @PANTALLA Mapa (/mapa) — la pantalla del mapa: la maqueta del campus con el semáforo
// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Pantalla Mapa del campus
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Pantalla Mapa con el semáforo de cada estacionamiento
// Ruta /mapa · Solo monta su vista. Llega con ?estacionamiento=<id> desde el Inicio o la sugerencia y
// ese queda elegido. La sesión la revisa front/middleware.js.
import MaquetaCampus from "@/vistas/mapa/MaquetaCampus";
import Notificaciones from "@/vistas/notificaciones/Notificaciones";

export default function PaginaMapa() {
  return (
    <main className="pagina">
      <h1 className="oculto-visual">Maqueta del Campus Montalbán: dónde hay puesto</h1>
      <MaquetaCampus />
      {/* HU 8.1: quien acaba de crear su cuenta llega aquí; si nunca respondió, se le pide permiso. */}
      <Notificaciones modo="invitacion" />
    </main>
  );
}
