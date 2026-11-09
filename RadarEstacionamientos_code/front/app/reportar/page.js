// Pantalla Reportar (/reportar): crear una incidencia, HU 9.1.
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { obtenerUsuarioActual } from "@/servidor/sesion";
import FormularioIncidencia from "./FormularioIncidencia";
import { listarEstacionamientosActivos } from "@back/logica/estacionamientos/datos";

export const metadata = { title: "Reportar una incidencia" };

// HU 9.1 Crear una incidencia. Desde la tarjeta del mapa llega con
// `?estacionamiento=<id>`: ese estacionamiento ya viene elegido (un toque menos).
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
