"use client";

import { useActionState } from "react";
import { agregarVehiculo } from "./acciones";
import estilos from "../formularios.module.css";

export default function FormularioVehiculo() {
  const [estado, accion, pendiente] = useActionState(agregarVehiculo, {});

  return (
    <form action={accion} className={estilos.tarjeta}>
      <h2>Agregar un vehículo</h2>
      <div className={estilos.campos}>
        <label className={estilos.campo}>
          Placa
          <input name="placa" placeholder="AB123CD" maxLength={9} required />
        </label>
        <label className={estilos.campo}>
          Marca
          <input name="marca" placeholder="Toyota" maxLength={30} required />
        </label>
        <label className={estilos.campo}>
          Modelo
          <input name="modelo" placeholder="Corolla" maxLength={30} required />
        </label>
        <label className={estilos.campo}>
          Color
          <input name="color" placeholder="Gris" maxLength={30} required />
        </label>
      </div>

      <button type="submit" className={estilos.boton} disabled={pendiente}>
        {pendiente ? "Guardando…" : "Registrar vehículo"}
      </button>

      <div aria-live="polite">
        {estado.error && <p className={estilos.error}>{estado.error}</p>}
        {estado.mensaje && <p className={estilos.exito}>{estado.mensaje}</p>}
      </div>
    </form>
  );
}
