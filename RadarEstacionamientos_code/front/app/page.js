// @PANTALLA Inicio (/) — la pantalla de inicio: botones de edificios, «Más cerca» y los estacionamientos con su semáforo
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Pantalla Inicio con el semáforo de cada estacionamiento
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Pantalla Inicio con el atajo «Más cerca»
// @HU-8.1 Activar las notificaciones · Manuel — Pantalla Inicio, donde aparece la invitación a activar notificaciones
// Pantalla de Inicio (/): edificios, sugerencia (HU 7.2), total y estacionamientos (HU 4.2).
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Notificaciones from "@/partes_de_pantallas/notificaciones/Notificaciones";
import Inicio from "@/partes_de_pantallas/inicio/Inicio";
import { listarEdificios } from "@back/reglas_y_datos/edificios/datos.js";
import { obtenerUsuarioActual } from "@/sesion_del_usuario/sesion";

export const metadata = { title: "Radar UCAB" };

// @HU-4.2 Consultar el semáforo de ocupación · Aaron
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
// @HU-8.1 Activar las notificaciones · Manuel
// Arma el Inicio: sin sesión manda a /entrar (HU 1.1); trae los edificios con ubicación (HU 6.1)
// y lo demás lo pide el navegador (partes_de_pantallas/inicio/Inicio.js). Invita a activar notificaciones (HU 8.1). [sesion]
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
