// @PANTALLA Sugerir (/sugerencia) — elegir el edificio y ver el estacionamiento libre más cercano
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Pantalla Sugerir
// Ruta /sugerencia · Solo monta su vista. En el Inicio está la misma función con chips.
import BuscadorSugerencia from "@/vistas/sugerencia/BuscadorSugerencia";
import estilos from "@/estilos/formularios.module.css";

export const metadata = { title: "¿Dónde me estaciono?" };

export default function PaginaSugerencia() {
  return (
    <main className={estilos.pagina}>
      <h1>¿Dónde me estaciono?</h1>
      <p className={estilos.ayuda}>
        Elige el edificio al que vas y te decimos el estacionamiento abierto con puestos libres que te queda más cerca.
      </p>
      <BuscadorSugerencia />
    </main>
  );
}
