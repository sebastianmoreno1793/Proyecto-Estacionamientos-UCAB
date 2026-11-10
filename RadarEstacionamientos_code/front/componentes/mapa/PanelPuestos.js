"use client";

// Lista de "¿dónde hay puesto?" junto al mapa (HU 4.2): de un vistazo, cuántos puestos libres
// hay en el campus y en cada estacionamiento, del que tiene más al que tiene menos. Los
// cerrados van al final. Al tocar uno, el mapa vuela hasta él y muestra su tarjeta.
// En el celular es una hoja que sube desde abajo y se recoge (D-007).

import { useEffect, useRef, useState } from "react";
import { nivelDelSemaforo } from "@back/logica/estacionamientos/reglas.js";

const TEXTO_CONEXION = {
  conectando: "Conectando…",
  "en-vivo": "En vivo",
  reconectando: "Reconectando…",
  "sin-conexion": "Sin conexión",
};

// Ordena los estacionamientos: primero los abiertos, del que tiene más libres al que tiene menos.
export function ordenarPorLibres(estacionamientos) {
  return [...estacionamientos].sort((a, b) => Number(b.activo) - Number(a.activo) || b.libres - a.libres);
}

// Hook que anima la cifra contando hasta el valor nuevo (como en Te Cambio);
// con «reducir movimiento» activado, salta directo al valor.
function useCifraAnimada(valor) {
  const [mostrado, setMostrado] = useState(valor);
  const anterior = useRef(valor);
  // Corre cada vez que cambia el valor: anima la cifra durante medio segundo con requestAnimationFrame.
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
    // Dibuja un cuadro de la animación con una curva que frena al final.
    const paso = (ahora) => {
      const t = Math.min(1, (ahora - inicio) / 500);
      setMostrado(Math.round(desde + (valor - desde) * (1 - (1 - t) ** 3)));
      if (t < 1) cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
    // Cancela la animación si el valor cambia otra vez o el panel desaparece.
    return () => cancelAnimationFrame(cuadro);
  }, [valor]);
  return mostrado;
}

// Escribe hace cuánto llegó el último dato («hace 3 minutos»), para no tomar cifras viejas como actuales.
function haceCuanto(hora, ahora) {
  const segundos = Math.max(0, Math.round((ahora - hora) / 1000));
  if (segundos < 60) return "hace menos de un minuto";
  const minutos = Math.round(segundos / 60);
  return minutos === 1 ? "hace 1 minuto" : `hace ${minutos} minutos`;
}

// Muestra la lista «¿dónde hay puesto?» junto al mapa (en el celular, una hoja que sube desde abajo). HU 4.2.
// La usa MaquetaCampus; al tocar un estacionamiento avisa con onElegir.
export default function PanelPuestos({ estacionamientos, conexion, actualizado, elegido, onElegir }) {
  const [ahora, setAhora] = useState(() => Date.now());
  // Sin conexión en vivo, actualiza el reloj cada 15 s para que «hace X minutos» avance; corre si cambia la conexión.
  useEffect(() => {
    if (conexion === "en-vivo") return;
    const reloj = setInterval(() => setAhora(Date.now()), 15000);
    setAhora(Date.now());
    // Detiene el reloj al volver a «En vivo» o al salir.
    return () => clearInterval(reloj);
  }, [conexion]);
  const [abierto, setAbierto] = useState(true);
  const activos = estacionamientos.filter((e) => e.activo);
  const totalLibres = activos.reduce((suma, e) => suma + e.libres, 0);
  const total = useCifraAnimada(totalLibres);
  const lista = ordenarPorLibres(estacionamientos);

  return (
    <aside
      className={`panel-puestos${abierto ? "" : " panel-cerrado"}`}
      aria-label="Puestos libres por estacionamiento"
    >
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
            <span className="panel-total-texto" aria-live="polite">
              <span className="oculto-visual">{totalLibres} </span>
              {totalLibres === 1 ? "puesto libre" : "puestos libres"} en el campus
            </span>
          </span>
          <span className="panel-flecha">{abierto ? "Ocultar" : "Ver lista"}</span>
        </button>
        <span className={`estado-conexion estado-${conexion}`}>
          <span className="punto" aria-hidden="true" /> {TEXTO_CONEXION[conexion]}
          {conexion !== "en-vivo" && actualizado && ` · cifras de ${haceCuanto(actualizado, ahora)}`}
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
                      <span className="cifra">{e.libres}</span> {e.libres === 1 ? "libre" : "libres"}
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
