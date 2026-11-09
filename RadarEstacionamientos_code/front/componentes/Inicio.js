"use client";

// Pantalla de Inicio (D-007 v2). Junta tres HU en una sola vista, sin textos de relleno:
//  - HU 7.2: el usuario toca el edificio al que va (chips) y aparece la tarjeta oscura con el
//    estacionamiento libre más cercano. La pide al back con fetch a /api/sugerencia.
//  - HU 4.2: el total de puestos libres en grande, con un anillo verde (con puesto) y rojo
//    (sin puesto), y una tarjeta por estacionamiento con su semáforo en texto.
//  - HU 4.3 (canal en vivo): cuando llega un aviso por /api/eventos, se vuelve a pedir todo.
//
//   navegador ─fetch GET /api/estacionamientos─▶ app/api/estacionamientos/route.js
//   navegador ─fetch GET /api/sugerencia?edificio=<id>─▶ app/api/sugerencia/route.js
//   navegador ◀─EventSource /api/eventos (AVISO, ESTACIONAMIENTO, REINICIO)

import { useEffect, useState } from "react";
import Link from "next/link";
import { CERRADO, SEMAFORO, nivelDelSemaforo, textoLibres } from "@back/logica/estacionamientos/reglas";
import { nombreCorto } from "@back/logica/usuarios/reglas";
import { Icono } from "./Iconos";

const CLAVE_EDIFICIO = "radar_edificio"; // el último edificio elegido, solo en este navegador
const CAMBIOS = ["AVISO", "ESTACIONAMIENTO", "REINICIO"];

const metros = (m) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1).replace(".", ",")} km`);

function leerEdificioGuardado() {
  try {
    return localStorage.getItem(CLAVE_EDIFICIO);
  } catch {
    return null;
  }
}

export default function Inicio({ edificios }) {
  const [estacionamientos, setEstacionamientos] = useState(null);
  const [edificio, setEdificio] = useState(null);
  const [sugerencia, setSugerencia] = useState(null);

  // Primer edificio: el que eligió la última vez, o el primero de la lista.
  useEffect(() => {
    const guardado = leerEdificioGuardado();
    setEdificio(edificios.some((e) => e.id === guardado) ? guardado : (edificios[0]?.id ?? null));
  }, [edificios]);

  // Estado de los estacionamientos + canal en vivo.
  useEffect(() => {
    let activo = true;
    const cargar = () =>
      fetch("/api/estacionamientos", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((datos) => activo && datos && setEstacionamientos(datos.estacionamientos))
        .catch(() => {}); // sin red se quedan las cifras de antes
    cargar();
    const canal = new EventSource("/api/eventos");
    canal.onmessage = (evento) => {
      const mensaje = JSON.parse(evento.data);
      if (CAMBIOS.includes(mensaje.clase)) cargar();
    };
    canal.onopen = cargar; // al reconectar, se pone al día
    return () => {
      activo = false;
      canal.close();
    };
  }, []);

  // La sugerencia se vuelve a pedir si cambia el edificio o si cambian los puestos libres.
  useEffect(() => {
    if (!edificio) return;
    let activo = true;
    fetch(`/api/sugerencia?edificio=${encodeURIComponent(edificio)}`, { cache: "no-store" })
      .then((r) => r.json().catch(() => ({ error: `El servidor respondió ${r.status}.` })))
      .then((datos) => activo && setSugerencia(datos))
      .catch(() => activo && setSugerencia({ error: "Sin conexión." }));
    return () => {
      activo = false;
    };
  }, [edificio, estacionamientos]);

  function elegir(id) {
    setEdificio(id);
    try {
      localStorage.setItem(CLAVE_EDIFICIO, id);
    } catch {
      // modo privado: no pasa nada, solo no se recuerda
    }
  }

  const abiertos = (estacionamientos ?? []).filter((e) => e.activo);
  const total = abiertos.reduce((suma, e) => suma + e.libres, 0);
  const conPuesto = abiertos.filter((e) => e.libres > 0).length;
  const ordenados = [...(estacionamientos ?? [])].sort(
    (a, b) => Number(b.activo) - Number(a.activo) || b.libres - a.libres,
  );

  return (
    <main className="pantalla">
      <div className="chips" role="group" aria-label="Edificio al que vas">
        {edificios.map((e) => (
          <button
            key={e.id}
            type="button"
            className="chip"
            aria-pressed={edificio === e.id}
            onClick={() => elegir(e.id)}
          >
            {edificio === e.id && <Icono nombre="edificio" />}
            {nombreCorto(e.nombre)}
          </button>
        ))}
      </div>

      {/* Teléfono: todo en una columna. Computador: sugerencia y total a la izquierda, la rejilla a la derecha. */}
      <div className="inicio-cuerpo">
        <div className="inicio-lado">
          <div aria-live="polite">
            {sugerencia?.sugerido && (
              <Link
                href={`/mapa?estacionamiento=${encodeURIComponent(sugerencia.sugerido.id)}`}
                className="tarjeta-grande tarjeta-noche"
              >
                <span className="suave">Más cerca</span>
                <span className="titulo-tarjeta">{sugerencia.sugerido.nombre}</span>
                <span className="fila">
                  <span>
                    <span className="punto" style={{ background: SEMAFORO[0].relleno }} aria-hidden="true" />
                    {textoLibres(sugerencia.sugerido.libres)}
                  </span>
                  <span className="suave">{metros(sugerencia.sugerido.distancia)}</span>
                </span>
              </Link>
            )}
            {sugerencia?.error && <p className="mensaje-error">{sugerencia.error}</p>}
          </div>

          <section className="tarjeta-grande fila" aria-label="Puestos libres en el campus">
            <div>
              <div className="cifra-xl">{estacionamientos ? total : "—"}</div>
              <div className="suave">{total === 1 ? "puesto libre" : "puestos libres"}</div>
            </div>
            <div
              className="anillo"
              style={{ "--hay": `${abiertos.length ? Math.round((conPuesto / abiertos.length) * 100) : 0}%` }}
              role="img"
              aria-label={`${conPuesto} con puesto y ${abiertos.length - conPuesto} sin puesto`}
            />
          </section>
        </div>
        <ul className="cuadricula">
          {ordenados.map((e) => {
            const nivel = nivelDelSemaforo(e);
            return (
              <li key={e.id}>
                <Link
                  href={`/mapa?estacionamiento=${encodeURIComponent(e.id)}`}
                  className={`tarjeta-grande tarjeta-puesto${e.activo ? "" : " cerrado"}`}
                >
                  <span className="nombre-puesto">{e.etiqueta ?? e.nombre}</span>
                  {e.activo ? (
                    <span>
                      <span className="cifra-l">{e.libres}</span>
                      <span className="suave"> {e.libres === 1 ? "libre" : "libres"}</span>
                    </span>
                  ) : null}
                  <span className="suave">
                    <span className="punto" style={{ background: nivel.relleno }} aria-hidden="true" />
                    {e.activo ? nivel.texto : CERRADO.texto}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
