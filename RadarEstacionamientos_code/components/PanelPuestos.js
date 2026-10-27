"use client";

// Lista de "¿dónde hay puesto?" junto al mapa (HU 4.2): de un vistazo, cuántos puestos libres
// hay en el campus y en cada estacionamiento, del que tiene más al que tiene menos. Los
// cerrados van al final. Al tocar uno, el mapa vuela hasta él y muestra su tarjeta.
// En el celular es una hoja que sube desde abajo y se recoge (D-007).

import { useEffect, useRef, useState } from "react";
import { nivelDelSemaforo } from "@/lib/estacionamientos/reglas";

const TEXTO_CONEXION = {
  conectando: "Conectando…",
  "en-vivo": "En vivo",
  reconectando: "Reconectando…",
  "sin-conexion": "Sin conexión",
};

export function ordenarPorLibres(estacionamientos) {
  return [...estacionamientos].sort((a, b) => Number(b.activo) - Number(a.activo) || b.libres - a.libres);
}

// La cifra cuenta hasta el valor nuevo (vocabulario de Te Cambio); con "reducir movimiento", salta.
function useCifraAnimada(valor) {
  const [mostrado, setMostrado] = useState(valor);
  const anterior = useRef(valor);
  useEffect(() => {
    const desde = anterior.current;
    anterior.current = valor;
    if (desde === valor) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMostrado(valor);
      return;
    }
    const inicio = performance.now();
    let cuadro;
    const paso = (ahora) => {
      const t = Math.min(1, (ahora - inicio) / 500);
      setMostrado(Math.round(desde + (valor - desde) * (1 - (1 - t) ** 3)));
      if (t < 1) cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [valor]);
  return mostrado;
}

export default function PanelPuestos({ estacionamientos, conexion, elegido, onElegir }) {
  const [abierto, setAbierto] = useState(true);
  const activos = estacionamientos.filter((e) => e.activo);
  const totalLibres = activos.reduce((suma, e) => suma + e.libres, 0);
  const total = useCifraAnimada(totalLibres);
  const lista = ordenarPorLibres(estacionamientos);

  return (
    <aside className={`panel-puestos${abierto ? "" : " panel-cerrado"}`} aria-label="Puestos libres por estacionamiento">
      <header className="panel-encabezado">
        <span className="panel-agarradera" aria-hidden="true" />
        <button
          type="button"
          className="panel-alternar"
          aria-expanded={abierto}
          aria-controls="lista-puestos"
          onClick={() => setAbierto((a) => !a)}
        >
          <span className="panel-total">
            <span className="cifra" aria-hidden="true">
              {estacionamientos.length ? total : "—"}
            </span>
            <span aria-live="polite">
              <span className="oculto-visual">{totalLibres} </span>puestos libres en el campus
            </span>
          </span>
          <span className="panel-flecha">{abierto ? "Ocultar" : "Ver lista"}</span>
        </button>
        <span className={`estado-conexion estado-${conexion}`}>
          <span className="punto" aria-hidden="true" /> {TEXTO_CONEXION[conexion]}
        </span>
      </header>

      <ol id="lista-puestos" className="panel-lista" hidden={!abierto}>
        {lista.map((e) => {
          const nivel = nivelDelSemaforo(e);
          return (
            <li key={e.id}>
              <button
                type="button"
                className="panel-item"
                aria-pressed={elegido === e.id}
                onClick={() => onElegir(e.id)}
              >
                <span className="panel-punto" style={{ background: nivel.color }} aria-hidden="true" />
                <span className="panel-nombre">
                  {e.etiqueta ?? e.nombre}
                  <small>
                    {nivel.texto}
                    {e.soloProfesores ? " · Solo profesores" : ""}
                  </small>
                </span>
                <span className="panel-libres">
                  {e.activo ? (
                    <>
                      <span className="cifra">{e.libres}</span> libres
                    </>
                  ) : (
                    "Cerrado"
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
