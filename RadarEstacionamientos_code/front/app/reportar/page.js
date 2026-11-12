// @PANTALLA Reportar (/reportar) — la pantalla para reportar un problema (incidencia)
// @HU-9.1 Crear una incidencia · Sebastian — Pantalla «Reportar»
// Pantalla Reportar (/reportar): crear una incidencia, HU 9.1.
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { obtenerUsuarioActual } from "@/sesion_del_usuario/sesion";
import FormularioIncidencia from "@/partes_de_pantallas/reportar/FormularioIncidencia";
import { listarEstacionamientosActivos } from "@back/reglas_y_datos/estacionamientos/datos.js";

export const metadata = { title: "Reportar una incidencia" };

// @HU-9.1 Crear una incidencia · Sebastian
// Arma la pantalla Reportar con FormularioIncidencia (HU 9.1); sin sesión manda a /entrar.
// Desde la tarjeta del mapa llega con `?estacionamiento=<id>` y ese ya viene elegido. [sesion]
export default async function PaginaNuevaIncidencia({ searchParams }) {
  await connection();
  if (!(await obtenerUsuarioActual())) redirect("/entrar"); // sin sesión el reporte no se puede enviar
  const estacionamientos = await listarEstacionamientosActivos();
  const { estacionamiento } = await searchParams;
  const elegido = estacionamientos.some((e) => e.id === estacionamiento) ? estacionamiento : "";

  return (
    <main className="pantalla">
      <h1>Reportar</h1>
      <FormularioIncidencia estacionamientos={estacionamientos} elegido={elegido} />
    </main>
  );
}
