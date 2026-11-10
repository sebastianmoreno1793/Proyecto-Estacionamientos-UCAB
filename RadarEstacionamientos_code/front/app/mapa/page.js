// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — pantalla Mapa
// @HU-4.2 Consultar el semáforo de ocupación · Aaron
// Pantalla Mapa (/mapa): la maqueta del campus con el semáforo (HU 5.1 y 4.2).
import { redirect } from "next/navigation";
import MaquetaCampus from "@/componentes/mapa/MaquetaCampus";
import Notificaciones from "@/componentes/notificaciones/Notificaciones";
import { obtenerUsuarioActual } from "@/servidor/sesion";

// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German
// @HU-4.2 Consultar el semáforo de ocupación · Aaron
// Muestra la maqueta del campus con el semáforo (HU 5.1 y 4.2); sin sesión manda a /entrar.
// Llega con ?estacionamiento=<id> desde el Inicio o la sugerencia y ese queda elegido. [sesion]
export default async function PaginaMapa() {
  if (!(await obtenerUsuarioActual())) redirect("/entrar");

  return (
    <main className="pagina">
      <h1 className="oculto-visual">Maqueta del Campus Montalbán: dónde hay puesto</h1>
      <MaquetaCampus />
      {/* HU 8.1: quien acaba de crear su cuenta llega aquí; si nunca respondió, se le pide permiso. */}
      <Notificaciones modo="invitacion" />
    </main>
  );
}
