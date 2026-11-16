"use client";
// @PANTALLA Reportar › Formulario: tipo de problema, estacionamiento y «Enviar reporte»
// @HU-9.1 Crear una incidencia · Sebastian — Formulario: elegir el estacionamiento y el tipo de problema

// HU 9.1 Crear una incidencia (D-007 v2: como armar un pedido en dos toques).
//  1. El tipo de problema: tres mosaicos grandes (un toque).
//  2. El estacionamiento: chips con los abiertos (CA3: los cerrados no aparecen).
//  3. «Enviar reporte». IncidenciaControlador valida en el front (IncidenciaValidador): si falta algo,
//     dice qué falta (CA2); si todo está bien, lo manda por fetch y queda «pendiente» con la hora (CA1)
//     y se muestra MensajeIncidenciaCreada con el tipo, el lugar, la hora y la línea de estado.

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IncidenciaControlador } from "@/controladores/IncidenciaControlador";
import { Icono } from "@/vistas/comunes/Iconos";
import MensajeDatosNoValidos from "@/vistas/comunes/MensajeDatosNoValidos";
import { AspectoIncidencia } from "@/vistas/reportar/AspectoIncidencia";
import MensajeEstacionamientoCerrado from "@/vistas/reportar/MensajeEstacionamientoCerrado";
import MensajeIncidenciaCreada from "@/vistas/reportar/MensajeIncidenciaCreada";

// @HU-9.1 Crear una incidencia · Sebastian
// Vista «interfaz» del formulario Reportar: solo dibuja y le avisa al controlador. Al enviar,
// IncidenciaControlador.reportar() valida, manda el reporte (fetch) y dice qué mensaje mostrar.
// Desde la tarjeta del mapa llega `elegido` (?estacionamiento=<id>) y ese ya viene marcado.
export default function FormularioIncidencia({ elegido = "" }) {
  const navegador = useRouter();
  const controlador = useMemo(() => new IncidenciaControlador({ navegador }), [navegador]);
  const [opciones, setOpciones] = useState(null);
  const [estado, accion, pendiente] = useActionState((_anterior, formulario) => controlador.reportar(formulario), {});
  const [confirmacion, setConfirmacion] = useState(null);
  const [vuelta, setVuelta] = useState(0); // cambia la key del formulario para empezar de cero

  // Pide al controlador los estacionamientos abiertos y los tipos de problema; corre al montar.
  useEffect(() => {
    controlador.cargar().then(setOpciones);
  }, [controlador]);

  useEffect(() => {
    if (estado.interfaz === "MensajeIncidenciaCreada") setConfirmacion(estado.incidencia);
  }, [estado]);

  if (confirmacion) {
    return (
      <MensajeIncidenciaCreada
        incidencia={confirmacion}
        alReportarOtro={() => {
          setConfirmacion(null);
          setVuelta((n) => n + 1);
        }}
      />
    );
  }

  if (!opciones) return <p className="suave">Cargando…</p>;

  const valores = estado.valores ?? {};
  const marcado = valores.estacionamientoId ?? (opciones.estacionamientos.some((e) => e.id === elegido) ? elegido : "");
  return (
    <form key={vuelta} action={accion} noValidate className="pantalla formulario-ancho" style={{ padding: 0, margin: 0 }}>
      <fieldset className="mosaicos">
        <legend className="oculto-visual">Tipo de problema</legend>
        {opciones.tipos.map((t) => {
          const aspecto = AspectoIncidencia.de(t.id);
          return (
            <label key={t.id} className={`mosaico ${aspecto.color}${aspecto.ancho ? " ancho" : ""}`}>
              <input type="radio" name="tipo" value={t.id} defaultChecked={valores.tipo === t.id} required />
              <Icono nombre={aspecto.icono} />
              {t.nombre}
            </label>
          );
        })}
      </fieldset>

      <fieldset className="chips">
        <legend className="oculto-visual">Estacionamiento</legend>
        {opciones.estacionamientos.map((e) => (
          <label key={e.id} className="chip">
            <input type="radio" name="estacionamientoId" value={e.id} defaultChecked={marcado === e.id} required />
            {e.etiqueta}
          </label>
        ))}
      </fieldset>

      {estado.interfaz === "MensajeEstacionamientoCerrado" ? (
        <MensajeEstacionamientoCerrado error={estado.error} />
      ) : (
        <MensajeDatosNoValidos error={estado.error} />
      )}

      <button type="submit" className="accion" disabled={pendiente}>
        {pendiente ? "Enviando…" : "Enviar reporte"}
        <Icono nombre="flecha" />
      </button>
      {/* Paso 6 de la HU 9.1: cerrar el formulario sin registrar nada. */}
      <Link href="/mapa" className="boton-texto" style={{ alignSelf: "center" }}>
        Cancelar
      </Link>
    </form>
  );
}
