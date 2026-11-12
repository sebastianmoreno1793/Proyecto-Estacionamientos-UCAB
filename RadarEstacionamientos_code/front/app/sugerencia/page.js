// @PANTALLA Sugerir (/sugerencia) — elegir el edificio y ver el estacionamiento libre más cercano
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Pantalla Sugerir
// Pantalla Sugerir (/sugerencia), HU 7.2. En el Inicio está la misma función con chips.
import { connection } from "next/server";
import { redirect } from "next/navigation";
import BuscadorSugerencia from "@/partes_de_pantallas/sugerencia/BuscadorSugerencia";
import { listarEdificios } from "@back/reglas_y_datos/edificios/datos.js";
import { obtenerUsuarioActual } from "@/sesion_del_usuario/sesion";
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
