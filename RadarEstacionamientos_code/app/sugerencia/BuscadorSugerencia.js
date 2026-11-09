"use client";

// HU 7.2 · Parte del navegador (front). El usuario elige el edificio y este componente le pide
// la sugerencia a la API (back) con fetch:
//
//   navegador ──GET /api/sugerencia?edificio=<id>──▶ app/api/sugerencia/route.js
//                                                     └─ lib/sugerencia/datos.js → reglas.js
//   navegador ◀──────────── JSON { sugerido, alternativas } o { error } ───────┘
//
// Es la misma petición que está en la colección de Postman («Sugerir el más cercano»).

import { useState } from "react";
import Link from "next/link";
import SelectorEdificio from "@/components/SelectorEdificio";
import { textoLibres } from "@/lib/estacionamientos/reglas";
import estilos from "../formularios.module.css";

const metros = (m) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1).replace(".", ",")} km`);

export default function BuscadorSugerencia({ edificios }) {
  const [resultado, setResultado] = useState(null);
  const [buscando, setBuscando] = useState(false);

  async function buscar(evento) {
    evento.preventDefault();
    const edificio = new FormData(evento.currentTarget).get("edificioId");
    setBuscando(true);
    try {
      const respuesta = await fetch(`/api/sugerencia?edificio=${encodeURIComponent(edificio)}`, {
        cache: "no-store", // los puestos libres cambian a cada rato
      });
      setResultado(await respuesta.json());
    } catch {
      setResultado({ error: "No hay conexión. Inténtalo de nuevo." });
    }
    setBuscando(false);
  }

  return (
    <>
      <form className={estilos.tarjeta} onSubmit={buscar}>
        <SelectorEdificio edificios={edificios} etiqueta="¿A qué edificio vas?" />
        <button type="submit" className={estilos.boton} disabled={buscando}>
          {buscando ? "Buscando…" : "Sugerir estacionamiento"}
        </button>
      </form>

      {resultado?.error && (
        <p className={estilos.error} role="alert">
          {resultado.error}
        </p>
      )}

      {resultado?.sugerido && (
        <section className={estilos.tarjeta} aria-live="polite">
          <p className={estilos.ayuda}>El más cercano a {resultado.edificio.nombre} con puesto libre:</p>
          <h2>{resultado.sugerido.nombre}</h2>
          <p className={estilos.exito}>
            {resultado.sugerido.libres} {resultado.sugerido.libres === 1 ? "puesto libre" : "puestos libres"} · a{" "}
            {metros(resultado.sugerido.distancia)} en línea recta
          </p>
          {resultado.alternativas.length > 0 && (
            <p className={estilos.ayuda}>
              Si se llena: {resultado.alternativas.map((a) => `${a.nombre} (${textoLibres(a.libres)}, ${metros(a.distancia)})`).join(" · ")}
            </p>
          )}
          <Link href="/">Ver el mapa</Link>
        </section>
      )}
    </>
  );
}
