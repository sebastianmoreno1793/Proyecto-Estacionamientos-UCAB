import { connection } from "next/server";
import FilaEdificio from "./FilaEdificio";
import FormularioNuevoEdificio from "./FormularioNuevoEdificio";
import SelectorEdificio from "@/components/SelectorEdificio";
import { listarEdificios } from "@/lib/edificios/datos";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";
import estilos from "../../formularios.module.css";

export const metadata = { title: "Edificios · Administración" };

// HU 6.1 Mantener el catálogo de edificios UCAB.
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
    <main className={estilos.pagina}>
      <h1>Edificios del campus</h1>
      <p className={estilos.ayuda}>
        Agrega, modifica o quita edificios. Esta es la lista que ve el usuario cuando elige el
        edificio de una materia. La ubicación es opcional y sirve para calcular la distancia a pie.
      </p>

      <FormularioNuevoEdificio />

      <section className={estilos.tarjeta}>
        <h2>Así lo ve el usuario</h2>
        <SelectorEdificio edificios={edificios} name="vistaPrevia" />
      </section>

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
