import { connection } from "next/server";
import FilaEstacionamiento from "./FilaEstacionamiento";
import { listarEstacionamientos } from "@/lib/estacionamientos/datos";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";
import estilos from "../../formularios.module.css";

export const metadata = { title: "Estacionamientos · Administración" };

// HU 10.1 Habilitar, inhabilitar y fijar la capacidad de los estacionamientos.
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
    <main className={estilos.pagina}>
      <h1>Estacionamientos</h1>
      <p className={estilos.ayuda}>
        Cambia cuántos puestos tiene cada estacionamiento o desactívalo. Los puestos libres
        se calculan con la nueva capacidad, y un estacionamiento desactivado no se sugiere
        a los conductores.
      </p>
      <ul className={estilos.lista}>
        {estacionamientos.map((e) => (
          <FilaEstacionamiento key={e.id} estacionamiento={e} />
        ))}
      </ul>
    </main>
  );
}
