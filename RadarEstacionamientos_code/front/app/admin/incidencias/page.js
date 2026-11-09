// Administrar › Incidencias (/admin/incidencias): lista de lo reportado (HU 9.1). Solo administrador.
import MenuAdmin from "@/componentes/MenuAdmin";
import { connection } from "next/server";
import { listarEstacionamientos } from "@back/logica/estacionamientos/datos";
import { listarIncidencias } from "@back/logica/incidencias/datos";
import { nombreDelTipo } from "@back/logica/incidencias/reglas";
import { formatearFechaHora } from "@back/logica/fechas";
import { esAdministrador, obtenerUsuarioActual } from "@/servidor/sesion";
import estilos from "../../formularios.module.css";

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
    <main className={`${estilos.pagina} ancha`}>
      <h1>Administrar</h1>
      <MenuAdmin />
      {incidencias.length === 0 && <p className={estilos.ayuda}>Sin incidencias.</p>}
      <ul className={estilos.lista}>
        {incidencias.map((i) => (
          <li key={i.id} className={estilos.tarjeta}>
            <div className={estilos.encabezado}>
              <h2>{nombreDelTipo(i.tipo)}</h2>
              <span className={estilos.etiqueta}>{i.estado === "pendiente" ? "Pendiente" : i.estado}</span>
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
