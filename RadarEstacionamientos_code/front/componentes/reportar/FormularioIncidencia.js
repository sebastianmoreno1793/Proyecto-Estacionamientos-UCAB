"use client";
// @HU-9.1 Crear una incidencia · Sebastian — formulario: tipo y estacionamiento

// HU 9.1 Crear una incidencia (D-007 v2: como armar un pedido en dos toques).
//  1. El tipo de problema: tres mosaicos grandes (un toque).
//  2. El estacionamiento: chips con los abiertos (CA3: los cerrados no aparecen).
//  3. «Enviar reporte». La acción (acciones/incidencias.js) valida en el servidor: si falta algo, dice qué
//     falta (CA2); si todo está bien, queda «pendiente» con la hora (CA1) y se muestra la
//     confirmación con el tipo, el lugar, la hora y la línea de estado.

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { reportarIncidencia } from "@/acciones/incidencias";
import { TIPOS_DE_INCIDENCIA } from "@back/logica/incidencias/reglas.js";
import { Icono } from "@/componentes/comunes/Iconos";

// Color e ícono de cada tipo. Ninguno es verde ni rojo: esos son del semáforo.
const ASPECTO = {
  conos_atravesados: { color: "coral", icono: "conos" },
  bateria_descargada: { color: "ambar", icono: "bateria" },
  vehiculo_mal_estacionado: { color: "lavanda", icono: "carro", ancho: true },
};

// @HU-9.1 Crear una incidencia · Sebastian
// Muestra el formulario de /reportar: tipo de problema, estacionamiento y «Enviar reporte». HU 9.1.
// Lo envía a la acción reportarIncidencia; si sale bien, muestra la confirmación. [accion]
export default function FormularioIncidencia({ estacionamientos, elegido = "" }) {
  const [estado, accion, pendiente] = useActionState(reportarIncidencia, {});
  const [confirmacion, setConfirmacion] = useState(null);
  const [vuelta, setVuelta] = useState(0); // cambia la key del formulario para empezar de cero

  // Muestra la confirmación cuando la acción devuelve el reporte guardado (CA1).
  // Corre cada vez que cambia el estado que devuelve la acción. [accion]
  useEffect(() => {
    if (estado.reporte) setConfirmacion(estado.reporte);
  }, [estado]);

  if (confirmacion) {
    const aspecto = ASPECTO[confirmacion.tipoId] ?? ASPECTO.vehiculo_mal_estacionado;
    return (
      <section
        className="pantalla formulario-ancho"
        style={{ padding: 0, margin: 0, maxWidth: 520 }}
        aria-live="polite"
        aria-labelledby="reporte-titulo"
      >
        <div className={`tarjeta-grande ${aspecto.color}`}>
          <Icono nombre={aspecto.icono} />
          <span id="reporte-titulo" className="titulo-tarjeta">
            {confirmacion.tipo}
          </span>
          <span>
            {confirmacion.estacionamiento} · {confirmacion.hora}
          </span>
        </div>
        <ol className="linea-estado">
          <li className="hecho">
            <span className="marca">
              <Icono nombre="check" />
            </span>
            Enviado
          </li>
          <li>
            <span className="marca" />
            Pendiente
          </li>
          <li className="futuro">
            <span className="marca" />
            Atendido
          </li>
        </ol>
        <Link href="/" className="accion centrada">
          Listo
        </Link>
        {/* «Reportar otro» quita la confirmación y cambia la key para empezar con el formulario vacío. */}
        <button
          type="button"
          className="fila-enlace"
          onClick={() => {
            setConfirmacion(null);
            setVuelta((n) => n + 1);
          }}
        >
          Reportar otro
          <Icono nombre="flecha" />
        </button>
      </section>
    );
  }

  const valores = estado.valores ?? {};
  return (
    <form key={vuelta} action={accion} noValidate className="pantalla formulario-ancho" style={{ padding: 0, margin: 0 }}>
      <fieldset className="mosaicos">
        <legend className="oculto-visual">Tipo de problema</legend>
        {TIPOS_DE_INCIDENCIA.map((t) => {
          const aspecto = ASPECTO[t.id];
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
        {estacionamientos.map((e) => (
          <label key={e.id} className="chip">
            <input
              type="radio"
              name="estacionamientoId"
              value={e.id}
              defaultChecked={(valores.estacionamientoId ?? elegido) === e.id}
              required
            />
            {e.etiqueta}
          </label>
        ))}
      </fieldset>

      <p className="mensaje-error" role="alert">
        {estado.error}
      </p>

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
