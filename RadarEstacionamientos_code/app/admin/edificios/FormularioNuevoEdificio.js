"use client";

import { useActionState } from "react";
import { guardarEdificioNuevo } from "./acciones";
import CamposEdificio from "./CamposEdificio";
import estilos from "../../formularios.module.css";

export default function FormularioNuevoEdificio() {
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
