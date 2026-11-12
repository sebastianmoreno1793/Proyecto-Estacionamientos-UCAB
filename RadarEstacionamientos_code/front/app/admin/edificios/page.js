// @PANTALLA Admin Edificios (/admin/edificios) — agregar, modificar y quitar edificios del catálogo
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Pantalla Administrar › Edificios
// Administrar › Edificios (/admin/edificios), HU 6.1. Solo administrador.
import { connection } from "next/server";
import FilaEdificio from "@/partes_de_pantallas/admin/FilaEdificio";
import NuevoEdificio from "@/partes_de_pantallas/admin/NuevoEdificio";
import MenuAdmin from "@/partes_de_pantallas/menu/MenuAdmin";
import { listarEdificios } from "@back/reglas_y_datos/edificios/datos.js";
import { esAdministrador, obtenerUsuarioActual } from "@/sesion_del_usuario/sesion";
import estilos from "@/estilos/formularios.module.css";

export const metadata = { title: "Edificios · Administración" };

// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German
// Arma /admin/edificios: al administrador le muestra NuevoEdificio y el catálogo de listarEdificios
// del back (son los chips del Inicio); a los demás, un aviso (HU 6.1). [sesion]
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
