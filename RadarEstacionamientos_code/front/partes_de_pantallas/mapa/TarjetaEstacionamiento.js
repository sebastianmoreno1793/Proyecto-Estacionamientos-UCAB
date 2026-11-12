"use client";
// @PANTALLA Mapa › Tarjeta del estacionamiento elegido con «Reportar un problema aquí»
// @HU-9.1 Crear una incidencia · Sebastian — Tarjeta del estacionamiento con el botón «Reportar un problema aquí»

// Tarjeta del estacionamiento elegido: flota sobre el mapa (DESIGN.md › Mapa, D-007).
// Nombre, nivel del semáforo en texto y tres datos en columnas; debajo, una sola acción.

import Link from "next/link";
import { nivelDelSemaforo } from "@back/reglas_y_datos/estacionamientos/reglas.js";
import { Icono } from "@/partes_de_pantallas/comunes/Iconos";

// @HU-9.1 Crear una incidencia · Sebastian
// Muestra la tarjeta del estacionamiento elegido sobre el mapa: nivel, libres, ocupación y capacidad.
// La usa MaquetaCampus; «Cerrar» llama a onCerrar y el enlace lleva a /reportar con ese estacionamiento.
export default function TarjetaEstacionamiento({ estacionamiento: e, onCerrar }) {
  const nivel = nivelDelSemaforo(e);
  return (
    <section className="tarjeta-estacionamiento" aria-labelledby="tarjeta-titulo" aria-live="polite">
      <div className="tarjeta-cabecera">
        <div>
          <h2 id="tarjeta-titulo">{e.etiqueta ?? e.nombre}</h2>
          <p className="nivel">
            <span style={{ background: nivel.color }} aria-hidden="true" />
            {nivel.texto}
            {e.soloProfesores ? " · Solo profesores" : ""}
            {e.pisos ? ` · ${e.pisos} pisos` : ""}
          </p>
        </div>
        <button type="button" className="boton-texto" onClick={onCerrar}>
          Cerrar
        </button>
      </div>

      {e.activo ? (
        <>
          <dl className="tarjeta-datos">
            <div>
              <dt>Libres</dt>
              <dd className="cifra">{e.libres}</dd>
            </div>
            <div>
              <dt>Ocupación</dt>
              <dd className="cifra">{e.porcentaje} %</dd>
            </div>
            <div>
              <dt>Capacidad</dt>
              <dd className="cifra">{e.capacidad}</dd>
            </div>
          </dl>
          {/* @HU-9.1 Crear una incidencia · Sebastian — abre Reportar con este estacionamiento ya elegido */}
          <Link href={`/reportar?estacionamiento=${encodeURIComponent(e.id)}`} className="boton-secundario">
            <Icono nombre="reportar" />
            &nbsp;Reportar un problema aquí
          </Link>
        </>
      ) : (
        <p className="nivel">Planta Física lo cerró por ahora. Busca otro en la lista.</p>
      )}
    </section>
  );
}
