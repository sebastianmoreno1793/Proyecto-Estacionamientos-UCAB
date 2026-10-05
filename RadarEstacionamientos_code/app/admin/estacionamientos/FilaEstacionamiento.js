"use client";

import { useActionState } from "react";
import { guardarEstacionamiento } from "./acciones";
import { CAPACIDAD_MAXIMA, puestosLibres } from "@/lib/estacionamientos/reglas";
import estilos from "../../formularios.module.css";

export default function FilaEstacionamiento({ estacionamiento }) {
  const { id, nombre, capacidad, ocupados, activo } = estacionamiento;
  const [estado, accion, pendiente] = useActionState(guardarEstacionamiento, {});

  return (
    <li className={`${estilos.tarjeta} ${activo ? "" : estilos.inactivo}`}>
      <div className={estilos.encabezado}>
        <h2>{nombre}</h2>
        <span className={estilos.etiqueta}>{activo ? "Activo" : "Desactivado"}</span>
      </div>
      <p>
        {puestosLibres(estacionamiento)} libres de {capacidad} · {ocupados} ocupados
      </p>

      <form action={accion} className={estilos.campos}>
        <input type="hidden" name="id" value={id} />
        <label className={estilos.campo}>
          Capacidad (puestos)
          <input
            type="number"
            name="capacidad"
            min={1}
            max={CAPACIDAD_MAXIMA}
            step={1}
            defaultValue={capacidad}
            required
          />
        </label>
        <label className={estilos.casilla}>
          <input type="checkbox" name="activo" defaultChecked={activo} />
          Activo
        </label>
        <button type="submit" className={estilos.boton} disabled={pendiente}>
          {pendiente ? "Guardando…" : "Guardar"}
        </button>
      </form>

      <p aria-live="polite" className={estado.error ? estilos.error : estilos.exito}>
        {estado.error ?? estado.mensaje}
      </p>
    </li>
  );
}
