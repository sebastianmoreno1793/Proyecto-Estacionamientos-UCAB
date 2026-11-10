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
import { CERRADO, SEMAFORO, nivelDelSemaforo, textoLibres } from "@back/logica/estacionamientos/reglas.js";
import { nombreCorto } from "@back/logica/edificios/reglas.js";
import { Icono } from "@/componentes/comunes/Iconos";

const CLAVE_EDIFICIO = "radar_edificio"; // el último edificio elegido, solo en este navegador
const CAMBIOS = ["AVISO", "ESTACIONAMIENTO", "REINICIO"];

// Convierte una distancia en metros a texto: «350 m» o «1,2 km».
const metros = (m) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1).replace(".", ",")} km`);

// Lee del navegador (localStorage) el último edificio elegido; devuelve null si no se puede.
function leerEdificioGuardado() {
  try {
    return localStorage.getItem(CLAVE_EDIFICIO);
  } catch {
    return null;
  }
}

// Muestra la pantalla de Inicio (ruta /): chips de edificios, el estacionamiento más cercano y los puestos libres.
// Junta la HU 7.2 (sugerencia), la HU 4.2 (puestos libres) y la HU 4.3 (canal en vivo).
export default function Inicio({ edificios }) {
  const [estacionamientos, setEstacionamientos] = useState(null);
  const [edificio, setEdificio] = useState(null);
  const [sugerencia, setSugerencia] = useState(null);
  const [sinDatos, setSinDatos] = useState(false); // la primera carga de puestos falló

  // Elige el primer edificio: el de la última vez o el primero de la lista.
  // Corre al montar y cada vez que cambia la lista de edificios.
  useEffect(() => {
    const guardado = leerEdificioGuardado();
    setEdificio(edificios.some((e) => e.id === guardado) ? guardado : (edificios[0]?.id ?? null));
  }, [edificios]);

  // Carga los estacionamientos y abre el canal en vivo /api/eventos; corre una sola vez, al montar.
  // Si llega AVISO, ESTACIONAMIENTO o REINICIO, vuelve a cargar las cifras. HU 4.3. [en-vivo]
  useEffect(() => {
    let activo = true;
    let ultima = 0; // número de la última petición: si llega una respuesta vieja, se ignora
    // Pide los estacionamientos al back: GET /api/estacionamientos → { estacionamientos }; sin red deja las cifras de antes. [fetch]
    const cargar = () => {
      const numero = ++ultima;
      return fetch("/api/estacionamientos", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((datos) => {
          if (!activo || numero !== ultima) return;
          if (datos) setEstacionamientos(datos.estacionamientos);
          setSinDatos(!datos);
        })
        .catch(() => activo && numero === ultima && setSinDatos(true)); // sin red se quedan las cifras de antes
    };
    // La primera carga la hace onopen al conectarse el canal en vivo (y cada vez que reconecta).
    const canal = new EventSource("/api/eventos");
    // Recibe cada mensaje del canal en vivo y recarga si es un cambio de puestos. [en-vivo]
    canal.onmessage = (evento) => {
      let mensaje;
      try {
        mensaje = JSON.parse(evento.data);
      } catch {
        return; // mensaje malformado: se ignora
      }
      if (CAMBIOS.includes(mensaje.clase)) cargar();
    };
    canal.onopen = cargar; // al reconectar, se pone al día
    // Al salir de la pantalla, deja de actualizar y cierra el canal en vivo. [en-vivo]
    return () => {
      activo = false;
      canal.close();
    };
  }, []);

  // Pide la sugerencia al back: GET /api/sugerencia?edificio=<id> → { sugerido, alternativas } o { error }. [fetch]
  // Corre cuando cambia el edificio elegido o cuando cambian los puestos libres. HU 7.2.
  useEffect(() => {
    if (!edificio) return;
    let activo = true;
    fetch(`/api/sugerencia?edificio=${encodeURIComponent(edificio)}`, { cache: "no-store" })
      .then((r) => r.json().catch(() => ({ error: `El servidor respondió ${r.status}.` })))
      .then((datos) => activo && setSugerencia(datos))
      .catch(() => activo && setSugerencia({ error: "Sin conexión." }));
    // Si cambia el edificio antes de que llegue la respuesta, ignora la respuesta vieja.
    return () => {
      activo = false;
    };
  }, [edificio, estacionamientos]);

  // Marca el edificio que tocó el usuario y lo guarda en el navegador para la próxima vez.
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
            {/* La pantalla /sugerencia muestra además las alternativas (HU 7.2). */}
            {sugerencia?.sugerido && (
              <Link href="/sugerencia" className="boton-texto">
                Ver alternativas
              </Link>
            )}
          </div>

          {sinDatos && !estacionamientos && (
            <p className="mensaje-error" role="alert">
              No se pudieron cargar los estacionamientos. Se reintenta solo al volver la conexión.
            </p>
          )}
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
