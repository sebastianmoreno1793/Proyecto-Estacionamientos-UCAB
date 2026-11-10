// Pantalla de Inicio (/): edificios, sugerencia (HU 7.2), total y estacionamientos (HU 4.2).
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Notificaciones from "@/componentes/notificaciones/Notificaciones";
import Inicio from "@/componentes/inicio/Inicio";
import { listarEdificios } from "@back/logica/edificios/datos.js";
import { obtenerUsuarioActual } from "@/servidor/sesion";

export const metadata = { title: "Radar UCAB" };

// Arma el Inicio: sin sesión manda a /entrar (HU 1.1); trae los edificios con ubicación (HU 6.1)
// y lo demás lo pide el navegador (componentes/inicio/Inicio.js). Invita a activar notificaciones (HU 8.1). [sesion]
export default async function PaginaInicio() {
  await connection();
  if (!(await obtenerUsuarioActual())) redirect("/entrar");
  const edificios = (await listarEdificios()).filter((e) => e.ubicacion); // sin ubicación no hay sugerencia

  return (
    <>
      <h1 className="oculto-visual">Radar de Estacionamientos UCAB</h1>
      <Inicio edificios={edificios} />
      {/* HU 8.1: la primera vez se pide permiso para las notificaciones. */}
      <Notificaciones modo="invitacion" />
    </>
  );
}
