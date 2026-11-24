"use client";
// @PANTALLA Sugerir › Buscador: elegir el edificio y ver el estacionamiento sugerido
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Elige el edificio y muestra el estacionamiento sugerido

// HU 7.2 · Parte del navegador (front). El usuario elige el edificio y este componente le pide
// la sugerencia a la API (back) con fetch:
//
//   navegador ──GET /api/sugerencia?edificio=<id>──▶ app/api/sugerencia/route.js
//                                                     └─ back/reglas_y_datos/sugerencia/datos.js → reglas.js
//   navegador ◀──────────── JSON { sugerido, alternativas } o { error } ───────┘
//
// Es la misma petición que está en la colección de Postman («Sugerir el más cercano»).

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SugerenciaControlador } from "@/controladores/SugerenciaControlador";
import SelectorEdificio from "@/vistas/comunes/SelectorEdificio";
import { ColoresSemaforo } from "@/vistas/comunes/ColoresSemaforo";
import { Formato } from "@/vistas/comunes/Formato";
import estilos from "@/estilos/formularios.module.css";

const HAY_PUESTO = ColoresSemaforo.HAY_PUESTO; // la sugerencia siempre tiene al menos un libre
const metros = Formato.distancia;
const textoLibres = Formato.libres;

// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
// Muestra el buscador de /sugerencia: eliges el edificio y dice el estacionamiento más cercano con puesto. HU 7.2.
// SugerenciaControlador trae los edificios (HU 6.1) y pide la sugerencia (fetch GET /api/sugerencia).
export default function BuscadorSugerencia() {
  const controlador = useMemo(() => new SugerenciaControlador(), []);
  const [edificios, setEdificios] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    controlador.edificios().then(setEdificios);
  }, [controlador]);

  // Corre al enviar el formulario y guarda la sugerencia o el mensaje de error. [fetch]
  async function buscar(evento) {
    evento.preventDefault();
    const edificio = new FormData(evento.currentTarget).get("edificioId");
    setBuscando(true);
    // @FETCH Sugerir › GET /api/sugerencia — pide el estacionamiento libre más cercano al edificio elegido
    const r = await controlador.sugerir(edificio);
    setResultado(r.interfaz === "MensajeSugerencia" ? r.sugerencia : { error: r.error });
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
            <Link href={`/mapa?estacionamiento=${encodeURIComponent(resultado.sugerido.id)}`} className="boton-secundario">
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
