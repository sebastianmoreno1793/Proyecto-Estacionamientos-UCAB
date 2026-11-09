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
import { SEMAFORO, textoLibres } from "@/lib/estacionamientos/reglas";
import estilos from "../formularios.module.css";

const HAY_PUESTO = SEMAFORO[0]; // la sugerencia siempre tiene al menos un libre
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
      // 200 trae la sugerencia; 400/404/409 traen { error }. Si el servidor falla y no manda JSON,
      // se dice eso y no «sin conexión».
      const datos = await respuesta.json().catch(() => null);
      setResultado(
        datos ?? { error: `El servidor no respondió bien (error ${respuesta.status}). Inténtalo de nuevo.` },
      );
    } catch {
      setResultado({ error: "No hay conexión. Revisa tu internet e inténtalo de nuevo." });
    } finally {
      setBuscando(false);
    }
  }

  return (
    <>
      <form className={estilos.tarjeta} onSubmit={buscar}>
        <SelectorEdificio edificios={edificios} etiqueta="¿A qué edificio vas?" />
        <button type="submit" className={estilos.boton} disabled={buscando}>
          {buscando ? "Buscando…" : "Sugerir estacionamiento"}
        </button>
      </form>

      {/* Región fija: el lector de pantalla anuncia lo que aparece dentro. */}
      <div aria-live="polite">
        {resultado?.error && (
          <p className={estilos.error} role="alert">
            {resultado.error}
          </p>
        )}

        {resultado?.sugerido && (
          // DESIGN.md: el estado siempre en texto con su punto de color (verde = hay puesto, D-009),
          // las cifras en tabular-nums 700 y los datos en la tarjeta de tres columnas, como en el mapa.
          <section className={estilos.tarjeta} aria-labelledby="sugerido-titulo">
            <p className={estilos.ayuda}>Más cerca de {resultado.edificio.nombre}</p>
            <h2 id="sugerido-titulo" className={estilos.tituloTarjeta}>
              {resultado.sugerido.nombre}
            </h2>
            <p className="nivel">
              <span style={{ background: HAY_PUESTO.color }} aria-hidden="true" />
              {HAY_PUESTO.texto}
            </p>
            <dl className="tarjeta-datos">
              <div>
                <dt>Libres</dt>
                <dd className="cifra">{resultado.sugerido.libres}</dd>
              </div>
              <div>
                <dt>Distancia</dt>
                <dd className="cifra">{metros(resultado.sugerido.distancia)}</dd>
              </div>
              <div>
                <dt>Capacidad</dt>
                <dd className="cifra">{resultado.sugerido.capacidad}</dd>
              </div>
            </dl>
            <p className={estilos.ayuda}>Distancia en línea recta desde el edificio.</p>
            <Link href={`/?estacionamiento=${encodeURIComponent(resultado.sugerido.id)}`} className="boton-secundario">
              Ver en el mapa
            </Link>
          </section>
        )}

        {resultado?.alternativas?.length > 0 && (
          <section aria-labelledby="alternativas-titulo">
            <h2 id="alternativas-titulo">Si se llena</h2>
            <ul className={estilos.lista}>
              {resultado.alternativas.map((a) => (
                <li key={a.id} className={estilos.tarjeta}>
                  <strong>{a.nombre}</strong>
                  <span className={estilos.ayuda}>
                    <span className="cifra">{textoLibres(a.libres)}</span> · a {metros(a.distancia)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
