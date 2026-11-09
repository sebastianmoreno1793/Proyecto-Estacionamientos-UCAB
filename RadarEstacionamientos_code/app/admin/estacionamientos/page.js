import NavAdmin from "@/components/NavAdmin";
import { connection } from "next/server";
import FilaEstacionamiento from "./FilaEstacionamiento";
import { listarEstacionamientos } from "@/lib/estacionamientos/datos";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";
import estilos from "../../formularios.module.css";

export const metadata = { title: "Estacionamientos · Administración" };

// HU 5.4 (antes 10.1) Modificar la capacidad y el estado de un estacionamiento.
export default async function PaginaEstacionamientos() {
  await connection();
  const usuario = await obtenerUsuarioActual();

  if (!esAdministrador(usuario)) {
    return (
      <main className={estilos.pagina}>
        <h1>Estacionamientos</h1>
        <p>Esta página es solo para el administrador.</p>
      </main>
    );
  }

  const estacionamientos = await listarEstacionamientos();

  return (
    <main className={`${estilos.pagina} ancha`}>
      <h1>Administrar</h1>
      <NavAdmin />
      <ul className={estilos.lista}>
        {estacionamientos.map((e) => (
          <FilaEstacionamiento key={e.id} estacionamiento={e} />
        ))}
      </ul>
    </main>
  );
}
