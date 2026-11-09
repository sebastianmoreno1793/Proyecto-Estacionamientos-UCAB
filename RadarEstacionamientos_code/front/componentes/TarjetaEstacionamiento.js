"use client";

// Tarjeta del estacionamiento elegido: flota sobre el mapa (DESIGN.md › Mapa, D-007).
// Nombre, nivel del semáforo en texto y tres datos en columnas; debajo, una sola acción.

import Link from "next/link";
import { nivelDelSemaforo } from "@back/logica/estacionamientos/reglas";
import { Icono } from "./Iconos";

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
