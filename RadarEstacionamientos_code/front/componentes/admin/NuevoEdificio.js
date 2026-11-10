"use client";
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — formulario para agregar

// HU 6.1 · Formulario para agregar un edificio al catálogo.
import { useActionState } from "react";
import { guardarEdificioNuevo } from "@/acciones/edificios";
import CamposEdificio from "@/componentes/admin/CamposEdificio";
import estilos from "@/estilos/formularios.module.css";

// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German
// Muestra el formulario «Agregar un edificio» en /admin/edificios. HU 6.1.
// Lo envía a la acción guardarEdificioNuevo y muestra el error o el mensaje que devuelve. [accion]
export default function NuevoEdificio() {
  const [estado, accion, pendiente] = useActionState(guardarEdificioNuevo, {});

  return (
    <section className={estilos.tarjeta}>
      <h2>Agregar un edificio</h2>
      {/* La key cambia al agregar, así el formulario queda vacío para el siguiente. */}
      <form key={estado.version ?? "nuevo"} action={accion} className={estilos.campos}>
        <CamposEdificio valores={estado.valores} />
        <button type="submit" className={estilos.boton} disabled={pendiente}>
          {pendiente ? "Agregando…" : "Agregar"}
        </button>
      </form>
      <p aria-live="polite" className={estado.error ? estilos.error : estilos.exito}>
        {estado.error ?? estado.mensaje}
      </p>
    </section>
  );
}
