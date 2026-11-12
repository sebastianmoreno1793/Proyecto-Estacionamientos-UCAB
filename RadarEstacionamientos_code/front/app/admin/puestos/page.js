// @PANTALLA Admin Puestos (/admin/puestos) — capacidad y abierto o cerrado de cada estacionamiento
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Pantalla Administrar › Puestos
// Administrar › Puestos (/admin/puestos): capacidad y abierto o cerrado, HU 5.4. Solo administrador.
import MenuAdmin from "@/partes_de_pantallas/menu/MenuAdmin";
import { connection } from "next/server";
import FilaPuesto from "@/partes_de_pantallas/admin/FilaPuesto";
import { listarEstacionamientos } from "@back/reglas_y_datos/estacionamientos/datos.js";
import { esAdministrador, obtenerUsuarioActual } from "@/sesion_del_usuario/sesion";
import estilos from "@/estilos/formularios.module.css";

export const metadata = { title: "Estacionamientos · Administración" };

// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
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
