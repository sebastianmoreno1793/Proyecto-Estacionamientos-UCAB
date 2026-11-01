import Link from "next/link";
import { connection } from "next/server";
import { listarEstacionamientos } from "@/lib/estacionamientos/datos";
import { listarIncidencias } from "@/lib/incidencias/datos";
import { nombreDelTipo } from "@/lib/incidencias/reglas";
import { formatearFechaHora } from "@/lib/fechas";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";
import estilos from "../formularios.module.css";

export const metadata = { title: "Incidencias" };

// Lista de incidencias reportadas (épica 9), la más reciente primero. Solo personal autorizado.
export default async function PaginaIncidencias() {
  await connection();
  if (!esAdministrador(await obtenerUsuarioActual())) {
    return (
      <main className={estilos.pagina}>
        <h1>Incidencias</h1>
        <p>Esta página es solo para el personal autorizado.</p>
      </main>
    );
  }

  const etiquetas = Object.fromEntries((await listarEstacionamientos()).map((e) => [e.id, e.etiqueta]));
  const incidencias = (await listarIncidencias()).reverse();

  return (
    <main className={estilos.pagina}>
      <h1>Incidencias</h1>
      <p className={estilos.ayuda}>
        {incidencias.length === 0
          ? "No hay incidencias reportadas."
          : `${incidencias.length} reportada${incidencias.length === 1 ? "" : "s"}, la más reciente primero.`}{" "}
        <Link href="/incidencias/nueva">Reportar una incidencia</Link>
      </p>
      <ul className={estilos.lista}>
        {incidencias.map((i) => (
          <li key={i.id} className={estilos.tarjeta}>
            <div className={estilos.encabezado}>
              <h2>{nombreDelTipo(i.tipo)}</h2>
              <span className={estilos.etiqueta}>{i.estado}</span>
            </div>
            <p>
              {etiquetas[i.estacionamientoId] ?? i.estacionamientoId} · {formatearFechaHora(i.reportadaEn)}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
