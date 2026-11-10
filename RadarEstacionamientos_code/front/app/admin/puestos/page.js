// Administrar › Puestos (/admin/puestos): capacidad y abierto o cerrado, HU 5.4. Solo administrador.
import MenuAdmin from "@/componentes/menu/MenuAdmin";
import { connection } from "next/server";
import FilaPuesto from "@/componentes/admin/FilaPuesto";
import { listarEstacionamientos } from "@back/logica/estacionamientos/datos.js";
import { esAdministrador, obtenerUsuarioActual } from "@/servidor/sesion";
import estilos from "@/estilos/formularios.module.css";

export const metadata = { title: "Estacionamientos · Administración" };

// Arma /admin/puestos con una FilaPuesto por estacionamiento para cambiar capacidad y estado
// (HU 5.4, antes 10.1). Solo la ve el administrador. [sesion]
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
