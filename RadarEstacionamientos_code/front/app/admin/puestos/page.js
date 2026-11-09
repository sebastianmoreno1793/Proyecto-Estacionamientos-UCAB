// Administrar › Puestos (/admin/puestos): capacidad y abierto o cerrado, HU 5.4. Solo administrador.
import MenuAdmin from "@/componentes/MenuAdmin";
import { connection } from "next/server";
import FilaPuesto from "./FilaPuesto";
import { listarEstacionamientos } from "@back/logica/estacionamientos/datos";
import { esAdministrador, obtenerUsuarioActual } from "@/servidor/sesion";
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
      <MenuAdmin />
      <ul className={estilos.lista}>
        {estacionamientos.map((e) => (
          <FilaPuesto key={e.id} estacionamiento={e} />
        ))}
      </ul>
    </main>
  );
}
