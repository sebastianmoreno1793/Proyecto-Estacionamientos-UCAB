// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Pantalla Sugerir
// Pantalla Sugerir (/sugerencia), HU 7.2. En el Inicio está la misma función con chips.
import { connection } from "next/server";
import { redirect } from "next/navigation";
import BuscadorSugerencia from "@/componentes/sugerencia/BuscadorSugerencia";
import { listarEdificios } from "@back/logica/edificios/datos.js";
import { obtenerUsuarioActual } from "@/servidor/sesion";
import estilos from "@/estilos/formularios.module.css";

export const metadata = { title: "¿Dónde me estaciono?" };

// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
// Arma la pantalla Sugerir (HU 7.2) con la lista de edificios (HU 6.1); sin sesión manda a /entrar.
// La búsqueda la hace el navegador con fetch a /api/sugerencia (BuscadorSugerencia.js). [sesion]
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
