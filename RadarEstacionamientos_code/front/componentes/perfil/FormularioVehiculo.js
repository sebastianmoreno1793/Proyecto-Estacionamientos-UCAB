"use client";
// @HU-2.1 Registrar mis vehículos · Samuel — Formulario para escribir la placa y agregar el vehículo

// HU 2.1 Registrar mis vehículos. Va dentro de Perfil, plegado detrás de «Agregar vehículo»
// (abierto si todavía no tiene ninguno). La acción valida en el servidor (acciones/vehiculos.js).

import { useActionState } from "react";
import { agregarVehiculo } from "@/acciones/vehiculos";
import estilos from "@/estilos/formularios.module.css";

// @HU-2.1 Registrar mis vehículos · Samuel
// Muestra el formulario «Agregar vehículo» dentro de Perfil (abierto si aún no tiene ninguno). HU 2.1.
// Lo envía a la acción agregarVehiculo, que valida en el servidor. [accion] [sesion]
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
        {/* Confirmación de la HU 2.1: «Vehículo … registrado.» (la devuelve acciones/vehiculos.js). */}
        {estado.mensaje && !estado.error && (
          <p role="status" style={{ width: "100%" }}>
            {estado.mensaje}
          </p>
        )}
      </form>
    </details>
  );
}
