"use client";

// HU 2.1 Registrar mis vehículos. Va dentro de Perfil, plegado detrás de «Agregar vehículo»
// (abierto si todavía no tiene ninguno). La acción valida en el servidor (acciones.js).

import { useActionState } from "react";
import { agregarVehiculo } from "./acciones";
import estilos from "../formularios.module.css";

export default function FormularioVehiculo({ abierto = false }) {
  const [estado, accion, pendiente] = useActionState(agregarVehiculo, {});
  const valores = estado.valores ?? {};

  return (
    <details className="tarjeta-grande" open={abierto || Boolean(estado.error)}>
      <summary className="nombre-puesto" style={{ cursor: "pointer", listStyle: "none" }}>
        + Agregar vehículo
      </summary>
      <form action={accion} className={estilos.campos} style={{ marginTop: 12 }}>
        <label className={estilos.campo}>
          Placa
          <input
            type="text"
            name="placa"
            defaultValue={valores.placa ?? ""}
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="AB123CD"
            maxLength={9}
            required
          />
        </label>
        <label className={estilos.campo}>
          Marca
          <input
            type="text"
            name="marca"
            defaultValue={valores.marca ?? ""}
            placeholder="Toyota"
            maxLength={30}
            required
          />
        </label>
        <label className={estilos.campo}>
          Modelo
          <input
            type="text"
            name="modelo"
            defaultValue={valores.modelo ?? ""}
            placeholder="Corolla"
            maxLength={30}
            required
          />
        </label>
        <label className={estilos.campo}>
          Color
          <input
            type="text"
            name="color"
            defaultValue={valores.color ?? ""}
            placeholder="Gris"
            maxLength={30}
            required
          />
        </label>
        <button type="submit" className="accion centrada" disabled={pendiente}>
          {pendiente ? "Guardando…" : "Guardar vehículo"}
        </button>
        <p className="mensaje-error" role="alert" style={{ width: "100%" }}>
          {estado.error}
        </p>
      </form>
    </details>
  );
}
