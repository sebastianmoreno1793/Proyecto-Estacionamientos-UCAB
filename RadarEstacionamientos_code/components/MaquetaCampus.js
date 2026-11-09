"use client";

// Maqueta del Campus Montalbán vista desde arriba (D-007 › Maqueta) con el semáforo de dos
// estados encima (HU 4.2, D-009), en vivo (base de la HU 4.3).
//
// La imagen (`public/maqueta/campus.jpg`) y dónde cae cada estacionamiento en ella
// (`data/maqueta.json`) salen del render de la maqueta 3D del simulador (página /maqueta).
// Aquí no se dibuja el campus: se pinta el estado de cada estacionamiento sobre la imagen.
// Los datos llegan por la API pública y el canal en vivo, el mismo camino de la maqueta 3D (D-006).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MAQUETA from "@/data/maqueta.json";
import { CERRADO, SEMAFORO, nivelDelSemaforo, textoLibres } from "@/lib/estacionamientos/reglas";
import PanelPuestos from "./PanelPuestos";
import TarjetaEstacionamiento from "./TarjetaEstacionamiento";

const { ancho: ANCHO, alto: ALTO } = MAQUETA;
const PROYECCION = new Map(MAQUETA.estacionamientos.map((e) => [e.id, e]));
const ESCALA_MAXIMA = 1.4; // la imagen mide 2400 px: más allá se ve borrosa
const MARGEN = 16;
const ARRIBA = 64; // espacio de la barra «Alejar · Acercar · Ver todo»

function cajaDe(puntos) {
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

// Todo el campus: la caja de los estacionamientos y los edificios, con aire alrededor.
const CAJA_CAMPUS = (() => {
  const c = cajaDe([...MAQUETA.estacionamientos.flatMap((e) => e.puntos), ...MAQUETA.edificios.map((e) => e.punto)]);
  return { x0: c.x0 - 30, y0: c.y0 - 30, x1: c.x1 + 30, y1: c.y1 + 30 };
})();

// Escala y posición para que una caja de la imagen quepa en el área visible.
function encuadre(caja, area) {
  const disponibleAlto = area.alto - area.tapado - ARRIBA;
  const s = Math.min(
    ESCALA_MAXIMA,
    (area.ancho - 2 * MARGEN) / (caja.x1 - caja.x0),
    (disponibleAlto - MARGEN) / (caja.y1 - caja.y0),
  );
  return {
    s,
    x: (area.ancho - (caja.x1 - caja.x0) * s) / 2 - caja.x0 * s,
    y: ARRIBA + (disponibleAlto - (caja.y1 - caja.y0) * s) / 2 - caja.y0 * s,
  };
}

export default function MaquetaCampus() {
  const zona = useRef(null);
  const [estacionamientos, setEstacionamientos] = useState(null);
  const [conexion, setConexion] = useState("conectando");
  const [actualizado, setActualizado] = useState(null);
  const [error, setError] = useState(null);
  const [elegido, setElegido] = useState(null);
  // HU 7.2: «Ver en el mapa» llega con /?estacionamiento=<id> y ese queda elegido al abrir.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("estacionamiento");
    if (id) setElegido(id);
  }, []);
  const [latiendo, setLatiendo] = useState(null);
  const [vista, setVista] = useState(null); // { x, y, s }
  const [animar, setAnimar] = useState(false);
  const [area, setArea] = useState(null); // { ancho, alto, tapado }
  const arrastre = useRef({ punteros: new Map(), movido: 0 });
  const hayDatos = estacionamientos !== null;

  const cargar = useCallback(async () => {
    try {
      const respuesta = await fetch("/api/estacionamientos", { cache: "no-store" });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      const { estacionamientos } = await respuesta.json();
      setEstacionamientos(estacionamientos);
      setActualizado(Date.now());
      setError(null);
    } catch {
      setError("No se pudo cargar la ocupación. Reintentando…");
    }
  }, []);

  // 1) Datos iniciales y canal en vivo.
  useEffect(() => {
    cargar();
    const canal = new EventSource("/api/eventos");
    let huboCorte = false;
    canal.onopen = () => {
      setConexion("en-vivo");
      // Al volver de un corte se recarga todo: pudo haber cambios mientras no había conexión.
      if (huboCorte) cargar();
      huboCorte = false;
    };
    canal.onerror = () => {
      huboCorte = true;
      setConexion(navigator.onLine ? "reconectando" : "sin-conexion");
    };
    canal.onmessage = (evento) => {
      const mensaje = JSON.parse(evento.data);
      if (mensaje.clase === "AVISO" || mensaje.clase === "ESTACIONAMIENTO") {
        const cambio = mensaje.estacionamiento;
        setEstacionamientos((lista) => lista?.map((e) => (e.id === cambio.id ? { ...e, ...cambio } : e)) ?? lista);
        setActualizado(Date.now());
        if (mensaje.clase === "AVISO") setLatiendo({ id: cambio.id, vez: Date.now() });
      } else if (mensaje.clase === "REINICIO") {
        const porId = new Map(mensaje.estacionamientos.map((e) => [e.id, e]));
        setEstacionamientos((lista) => lista?.map((e) => ({ ...e, ...porId.get(e.id) })) ?? lista);
        setActualizado(Date.now());
      }
    };
    const sinRed = () => setConexion("sin-conexion");
    window.addEventListener("offline", sinRed);
    return () => {
      canal.close();
      window.removeEventListener("offline", sinRed);
    };
  }, [cargar]);

  useEffect(() => {
    if (!error) return;
    const reintento = setTimeout(cargar, 5000);
    return () => clearTimeout(reintento);
  }, [error, cargar]);

  // 2) Tamaño del área visible. En el celular, la hoja de la lista tapa la parte de abajo.
  useEffect(() => {
    const elemento = zona.current;
    if (!elemento) return;
    const medir = () => {
      const hoja = elemento.closest(".mapa-contenedor")?.querySelector(".panel-puestos");
      const tapado = window.innerWidth < 768 && hoja && !hoja.classList.contains("panel-cerrado") ? hoja.offsetHeight : 0;
      setArea({ ancho: elemento.clientWidth, alto: elemento.clientHeight, tapado });
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(elemento);
    const hoja = elemento.closest(".mapa-contenedor")?.querySelector(".panel-puestos");
    if (hoja) observador.observe(hoja);
    const cambios = new MutationObserver(medir);
    if (hoja) cambios.observe(hoja, { attributes: true, attributeFilter: ["class"] });
    return () => {
      observador.disconnect();
      cambios.disconnect();
    };
  }, [hayDatos]);

  const verTodo = useCallback(() => {
    if (!area) return;
    setAnimar(true);
    setVista(encuadre(CAJA_CAMPUS, area));
  }, [area]);

  // Al cambiar el área (girar el celular, abrir o recoger la hoja), se vuelve a encuadrar.
  useEffect(() => {
    if (!area) return;
    const proyeccion = elegido && PROYECCION.get(elegido);
    if (proyeccion) {
      const c = cajaDe(proyeccion.puntos);
      setVista(encuadre({ x0: c.x0 - 140, y0: c.y0 - 140, x1: c.x1 + 140, y1: c.y1 + 140 }, { ...area, tapado: area.ancho < 768 ? 230 : 0 }));
    } else {
      setVista(encuadre(CAJA_CAMPUS, area));
    }
    setAnimar(true);
  }, [area, elegido]);

  // ---------- Arrastrar, pellizcar y la rueda ----------
  const ajustarZoom = useCallback((factor, cx, cy) => {
    setAnimar(false);
    setVista((v) => {
      if (!v || !area) return v;
      const minimo = encuadre(CAJA_CAMPUS, area).s * 0.85;
      const s = Math.min(ESCALA_MAXIMA, Math.max(minimo, v.s * factor));
      const k = s / v.s;
      return { s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
    });
  }, [area]);

  const alPresionar = (e) => {
    arrastre.current.punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (arrastre.current.punteros.size === 1) arrastre.current.movido = 0;
  };
  const alMover = (e) => {
    const punteros = arrastre.current.punteros;
    const anterior = punteros.get(e.pointerId);
    if (!anterior) return;
    const actual = { x: e.clientX, y: e.clientY };
    if (punteros.size === 1) {
      const dx = actual.x - anterior.x;
      const dy = actual.y - anterior.y;
      arrastre.current.movido += Math.abs(dx) + Math.abs(dy);
      setAnimar(false);
      setVista((v) => v && { ...v, x: v.x + dx, y: v.y + dy });
    } else if (punteros.size === 2) {
      const [otroId] = [...punteros.keys()].filter((id) => id !== e.pointerId);
      const otro = punteros.get(otroId);
      const antes = Math.hypot(anterior.x - otro.x, anterior.y - otro.y);
      const ahora = Math.hypot(actual.x - otro.x, actual.y - otro.y);
      const caja = zona.current.getBoundingClientRect();
      if (antes > 0) ajustarZoom(ahora / antes, (actual.x + otro.x) / 2 - caja.left, (actual.y + otro.y) / 2 - caja.top);
      arrastre.current.movido += 10;
    }
    punteros.set(e.pointerId, actual);
  };
  const alSoltar = (e) => arrastre.current.punteros.delete(e.pointerId);
  const fueToque = () => arrastre.current.movido < 8;

  useEffect(() => {
    const elemento = zona.current;
    if (!elemento) return;
    const rueda = (e) => {
      e.preventDefault();
      const caja = elemento.getBoundingClientRect();
      ajustarZoom(Math.exp(-e.deltaY * 0.0015), e.clientX - caja.left, e.clientY - caja.top);
    };
    elemento.addEventListener("wheel", rueda, { passive: false });
    return () => elemento.removeEventListener("wheel", rueda);
  }, [ajustarZoom]);

  const elegir = useCallback((id) => setElegido(id), []);

  // ---------- Dibujo ----------
  const fueraDeVivo = conexion !== "en-vivo" && hayDatos;
  const detalle = vista && area ? vista.s >= encuadre(CAJA_CAMPUS, area).s * 1.7 : false;
  const seleccionado = estacionamientos?.find((e) => e.id === elegido) ?? null;
  const poligonos = useMemo(
    () => (estacionamientos ?? []).filter((e) => PROYECCION.has(e.id)).map((e) => ({ est: e, proyeccion: PROYECCION.get(e.id) })),
    [estacionamientos],
  );

  return (
    <div className={`mapa-contenedor${seleccionado ? " con-tarjeta" : ""}`}>
      <div className="mapa-zona">
        <div
          ref={zona}
          className={`maqueta${fueraDeVivo ? " datos-viejos" : ""}`}
          role="region"
          aria-label="Maqueta del Campus Montalbán con los estacionamientos y si hay puesto"
          onPointerDown={alPresionar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alSoltar}
          onPointerLeave={alSoltar}
          onClick={(e) => {
            if (fueToque() && e.target === e.currentTarget) setElegido(null);
          }}
        >
          {vista && (
            <div
              className={`maqueta-lienzo${animar ? " animada" : ""}`}
              style={{ width: ANCHO, height: ALTO, transform: `translate(${vista.x}px, ${vista.y}px) scale(${vista.s})` }}
              onClick={(e) => {
                if (fueToque() && (e.target === e.currentTarget || e.target.tagName === "IMG")) setElegido(null);
              }}
            >
              <img src="/maqueta/campus.jpg" alt="" width={ANCHO} height={ALTO} draggable={false} />
              <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} width={ANCHO} height={ALTO} aria-hidden="true">
                {poligonos.map(({ est, proyeccion }) => {
                  const nivel = nivelDelSemaforo(est);
                  const clases = ["zona-estacionamiento"];
                  if (est.id === elegido) clases.push("elegida");
                  if (latiendo?.id === est.id) clases.push("latido");
                  return (
                    <polygon
                      key={latiendo?.id === est.id ? `${est.id}-${latiendo.vez}` : est.id}
                      className={clases.join(" ")}
                      points={proyeccion.puntos.map((p) => p.join(",")).join(" ")}
                      style={{ "--relleno": nivel.relleno, "--borde": nivel.color }}
                      strokeDasharray={est.soloProfesores ? "10 7" : undefined}
                      onClick={() => fueToque() && elegir(est.id)}
                    />
                  );
                })}
              </svg>
              {detalle &&
                MAQUETA.edificios.map((e) => (
                  <span key={e.id} className="rotulo-edificio" style={{ left: e.punto[0], top: e.punto[1], "--escala": 1 / vista.s }}>
                    {e.nombre}
                  </span>
                ))}
              {poligonos.map(({ est, proyeccion }) => {
                const nivel = nivelDelSemaforo(est);
                return (
                  <button
                    key={est.id}
                    type="button"
                    className={`pildora${detalle ? "" : " compacta"}${est.id === elegido ? " elegida" : ""}`}
                    style={{ left: proyeccion.etiqueta[0], top: proyeccion.etiqueta[1], "--color": nivel.color, "--escala": 1 / vista.s }}
                    onClick={() => fueToque() && elegir(est.id)}
                    aria-label={`${est.etiqueta ?? est.nombre}: ${nivel.texto}${est.activo ? `, ${textoLibres(est.libres)}` : ""}`}
                  >
                    {/* De lejos, solo el número (si no, se amontonan); al acercarse, cuántos; el elegido, también su nombre. */}
                    {!est.activo ? (
                      detalle ? "Cerrado" : "–"
                    ) : detalle ? (
                      <>
                        <b>{est.libres}</b> {est.libres === 1 ? "libre" : "libres"}
                        {est.id === elegido ? ` · ${est.etiqueta ?? est.nombre}` : ""}
                      </>
                    ) : (
                      <b>{est.libres}</b>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {!estacionamientos && <p className="mapa-aviso">{error ?? "Cargando la ocupación del campus…"}</p>}
        </div>

        <div className="maqueta-controles" role="group" aria-label="Acercar o alejar la maqueta">
          <button type="button" onClick={() => area && ajustarZoom(1 / 1.4, area.ancho / 2, (area.alto - area.tapado) / 2)}>
            Alejar
          </button>
          <button type="button" onClick={() => area && ajustarZoom(1.4, area.ancho / 2, (area.alto - area.tapado) / 2)}>
            Acercar
          </button>
          <button
            type="button"
            onClick={() => {
              setElegido(null);
              verTodo();
            }}
          >
            Ver todo
          </button>
        </div>

        <ul className="leyenda" aria-label="Leyenda del semáforo">
          {[...SEMAFORO, CERRADO].map((n) => (
            <li key={n.nivel}>
              <span className="muestra" style={{ background: n.relleno, borderColor: n.color }} />
              {n.texto}
            </li>
          ))}
          <li>
            <span className="muestra muestra-profesores" />
            Solo profesores
          </li>
        </ul>
        {seleccionado && <TarjetaEstacionamiento estacionamiento={seleccionado} onCerrar={() => setElegido(null)} />}
      </div>
      <PanelPuestos
        estacionamientos={estacionamientos ?? []}
        conexion={conexion}
        actualizado={actualizado}
        elegido={elegido}
        onElegir={elegir}
      />
    </div>
  );
}
