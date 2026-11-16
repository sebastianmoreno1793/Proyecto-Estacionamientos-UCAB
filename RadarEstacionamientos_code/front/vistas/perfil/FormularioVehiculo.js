"use client";
// @PANTALLA Perfil › Formulario «Agregar vehículo» (la placa)
// @HU-2.1 Registrar mis vehículos · Samuel — Formulario para escribir la placa y agregar el vehículo

// HU 2.1 Registrar mis vehículos. Va dentro de Perfil, plegado detrás de «Agregar vehículo»
// (abierto si todavía no tiene ninguno). VehiculoControlador valida en el front (VehiculoValidador) y lo manda por fetch.

import { useActionState, useEffect, useMemo } from "react";
import { VehiculoControlador } from "@/controladores/VehiculoControlador";
import MensajeDatosNoValidos from "@/vistas/comunes/MensajeDatosNoValidos";
import MensajeVehiculoRegistrado from "@/vistas/perfil/MensajeVehiculoRegistrado";
import estilos from "@/estilos/formularios.module.css";

// @HU-2.1 Registrar mis vehículos · Samuel
// Muestra el formulario «Agregar vehículo» dentro de Perfil (abierto si aún no tiene ninguno). HU 2.1.
// Lo envía a VehiculoControlador.registrar(), que valida y lo manda a POST /api/vehiculos. [fetch] [sesion]
export default function FormularioVehiculo({ abierto = false, alRegistrar = () => {} }) {
  const controlador = useMemo(() => new VehiculoControlador(), []);
  const [estado, accion, pendiente] = useActionState((_anterior, formulario) => controlador.registrar(formulario), {});

  // Al registrar uno, la lista de Mis vehículos se vuelve a pedir.
  useEffect(() => {
    if (estado.interfaz === "MensajeVehiculoRegistrado") alRegistrar(estado.vehiculo);
  }, [estado, alRegistrar]);
  const valores = estado.valores ?? {};

  return (
    <details className="tarjeta-grande" open={abierto || Boolean(estado.error)}>
      <summary className="nombre-puesto" style={{ cursor: "pointer", listStyle: "none" }}>
        + Agregar vehículo
      </summary>
      {/* noValidate apaga los avisos del navegador: los mensajes los da VehiculoValidador. */}
      <form action={accion} className={estilos.campos} style={{ marginTop: 12 }} noValidate>
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
        <div style={{ width: "100%" }}>
          <MensajeDatosNoValidos error={estado.error} />
        </div>
        {/* Confirmación de la HU 2.1: «Vehículo … registrado.» (la arma VehiculoControlador). */}
        {estado.interfaz === "MensajeVehiculoRegistrado" && <MensajeVehiculoRegistrado mensaje={estado.mensaje} />}
      </form>
    </details>
  );
}
