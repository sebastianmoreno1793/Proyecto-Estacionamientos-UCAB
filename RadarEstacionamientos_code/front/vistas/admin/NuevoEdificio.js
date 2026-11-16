"use client";
// @PANTALLA Admin Edificios › Formulario «Agregar un edificio»
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Formulario para agregar un edificio nuevo

// HU 6.1 · Formulario para agregar un edificio al catálogo.
import { useActionState, useEffect, useMemo } from "react";
import { EdificioControlador } from "@/controladores/EdificioControlador";
import CamposEdificio from "@/vistas/admin/CamposEdificio";
import estilos from "@/estilos/formularios.module.css";

// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German
// Muestra el formulario «Agregar un edificio» en /admin/edificios. HU 6.1.
// Lo envía a EdificioControlador.agregar() (valida y hace fetch POST) y muestra el mensaje que devuelve. [fetch]
export default function NuevoEdificio({ alAgregar = () => {} }) {
  const controlador = useMemo(() => new EdificioControlador(), []);
  const [estado, accion, pendiente] = useActionState((_anterior, formulario) => controlador.agregar(formulario), {});

  // Al agregar, la lista se vuelve a pedir.
  useEffect(() => {
    if (estado.interfaz === "MensajeHecho") alAgregar();
  }, [estado, alAgregar]);

  return (
    <section className={estilos.tarjeta}>
      <h2>Agregar un edificio</h2>
      {/* La key cambia al agregar, así el formulario queda vacío para el siguiente.
          noValidate apaga los avisos del navegador: los mensajes los da EdificioValidador. */}
      <form key={estado.edificio?.id ?? "nuevo"} action={accion} className={estilos.campos} noValidate>
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
