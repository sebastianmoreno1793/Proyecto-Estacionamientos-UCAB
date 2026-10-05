"use client";

import { useActionState } from "react";
import { reportarIncidencia } from "../acciones";
import { TIPOS_DE_INCIDENCIA } from "@/lib/incidencias/reglas";
import estilos from "../../formularios.module.css";

export default function FormularioIncidencia({ estacionamientos }) {
  const [estado, accion, pendiente] = useActionState(reportarIncidencia, {});

  return (
    <form action={accion} className={estilos.tarjeta}>
      <label className={estilos.campo}>
        Estacionamiento
        <select name="estacionamientoId" defaultValue="" required>
          <option value="" disabled>
            Elige el estacionamiento
          </option>
          {estacionamientos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.etiqueta}
            </option>
          ))}
        </select>
      </label>

      <fieldset className={estilos.opciones}>
        <legend>¿Qué problema hay?</legend>
        {TIPOS_DE_INCIDENCIA.map((t) => (
          <label key={t.id} className={estilos.casilla}>
            <input type="radio" name="tipo" value={t.id} required />
            {t.nombre}
          </label>
        ))}
      </fieldset>

      <button type="submit" className={estilos.boton} disabled={pendiente}>
        {pendiente ? "Enviando…" : "Enviar reporte"}
      </button>

      <div aria-live="polite">
        {estado.error && <p className={estilos.error}>{estado.error}</p>}
        {estado.reporte && (
          <p className={estilos.exito}>
            Reporte enviado ({estado.reporte.hora}): {estado.reporte.tipo} en{" "}
            {estado.reporte.estacionamiento}. Estado: {estado.reporte.estado}.
          </p>
        )}
      </div>
    </form>
  );
}
