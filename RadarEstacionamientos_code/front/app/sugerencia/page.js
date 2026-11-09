// Pantalla Sugerir (/sugerencia), HU 7.2. En el Inicio está la misma función con chips.
import { connection } from "next/server";
import { redirect } from "next/navigation";
import BuscadorSugerencia from "./BuscadorSugerencia";
import { listarEdificios } from "@back/logica/edificios/datos";
import { obtenerUsuarioActual } from "@/servidor/sesion";
import estilos from "../formularios.module.css";

export const metadata = { title: "¿Dónde me estaciono?" };

// HU 7.2 · Sugerir el estacionamiento libre más cercano (Manuel).
// El servidor arma la página con la lista de edificios (HU 6.1); la búsqueda la hace el
// navegador con fetch a /api/sugerencia (ver BuscadorSugerencia.js).
export default async function PaginaSugerencia() {
  await connection();
  if (!(await obtenerUsuarioActual())) redirect("/entrar");
  const edificios = await listarEdificios();

  return (
    <main className={estilos.pagina}>
      <h1>¿Dónde me estaciono?</h1>
      <p className={estilos.ayuda}>
        Elige el edificio al que vas y te decimos el estacionamiento abierto con puestos libres
        que te queda más cerca.
      </p>
      <BuscadorSugerencia edificios={edificios} />
    </main>
  );
}
