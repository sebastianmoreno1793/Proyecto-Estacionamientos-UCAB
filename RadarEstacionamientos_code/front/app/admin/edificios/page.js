// Administrar › Edificios (/admin/edificios), HU 6.1. Solo administrador.
import { connection } from "next/server";
import FilaEdificio from "./FilaEdificio";
import NuevoEdificio from "./NuevoEdificio";
import MenuAdmin from "@/componentes/MenuAdmin";
import { listarEdificios } from "@back/logica/edificios/datos";
import { esAdministrador, obtenerUsuarioActual } from "@/servidor/sesion";
import estilos from "../../formularios.module.css";

export const metadata = { title: "Edificios · Administración" };

// HU 6.1 Registrar y actualizar el catálogo de edificios UCAB. Son los chips del Inicio.
export default async function PaginaEdificios() {
  await connection();
  const usuario = await obtenerUsuarioActual();

  if (!esAdministrador(usuario)) {
    return (
      <main className={estilos.pagina}>
        <h1>Edificios</h1>
        <p>Esta página es solo para el administrador.</p>
      </main>
    );
  }

  const edificios = await listarEdificios();

  return (
    <main className={`${estilos.pagina} ancha`}>
      <h1>Administrar</h1>
      <MenuAdmin />

      <NuevoEdificio />

      {edificios.length === 0 ? (
        <p className={estilos.ayuda}>Todavía no hay edificios en el catálogo.</p>
      ) : (
        <ul className={estilos.lista}>
          {edificios.map((e) => (
            <FilaEdificio key={e.id} edificio={e} />
          ))}
        </ul>
      )}
    </main>
  );
}
