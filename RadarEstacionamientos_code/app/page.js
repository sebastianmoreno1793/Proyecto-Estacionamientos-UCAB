import { connection } from "next/server";
import { redirect } from "next/navigation";
import BotonNotificaciones from "@/components/BotonNotificaciones";
import Inicio from "@/components/Inicio";
import { listarEdificios } from "@/lib/edificios/datos";
import { obtenerUsuarioActual } from "@/lib/sesion";

export const metadata = { title: "Radar UCAB" };

// HU 1.1: solo entra quien inició sesión. El servidor arma la lista de edificios (HU 6.1);
// lo demás lo pide el navegador (ver components/Inicio.js).
export default async function PaginaInicio() {
  await connection();
  if (!(await obtenerUsuarioActual())) redirect("/entrar");
  const edificios = (await listarEdificios()).filter((e) => e.ubicacion); // sin ubicación no hay sugerencia

  return (
    <>
      <h1 className="oculto-visual">Radar de Estacionamientos UCAB</h1>
      <Inicio edificios={edificios} />
      {/* HU 8.1: la primera vez se pide permiso para las notificaciones. */}
      <BotonNotificaciones modo="invitacion" />
    </>
  );
}
