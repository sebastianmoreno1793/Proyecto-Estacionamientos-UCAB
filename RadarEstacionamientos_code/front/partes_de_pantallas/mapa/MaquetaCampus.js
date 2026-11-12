"use client";
// @PANTALLA Mapa › Maqueta del campus: la imagen con cada estacionamiento, sus libres y su estado
// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Dibuja el mapa con el nombre de cada estacionamiento
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — En el mapa, muestra libres y el estado en texto

// Maqueta del Campus Montalbán vista desde arriba (D-007 › Maqueta) con el semáforo de dos
// estados encima (HU 4.2, D-009), en vivo (base de la HU 4.3).
//
// La imagen (`public/maqueta/campus.jpg`) y dónde cae cada estacionamiento en ella
// (`back/datos_del_campus/maqueta.json`) salen del render de la maqueta 3D del simulador (página /maqueta).
// Aquí no se dibuja el campus: se pinta el estado de cada estacionamiento sobre la imagen.
// Los datos llegan por la API pública y el canal en vivo, el mismo camino de la maqueta 3D (D-006).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MAQUETA from "@back/datos_del_campus/maqueta.json";
import { CERRADO, SEMAFORO, nivelDelSemaforo, textoLibres } from "@back/reglas_y_datos/estacionamientos/reglas.js";
import PanelPuestos from "@/partes_de_pantallas/mapa/PanelPuestos";
import TarjetaEstacionamiento from "@/partes_de_pantallas/mapa/TarjetaEstacionamiento";

const { ancho: ANCHO, alto: ALTO } = MAQUETA;
const PROYECCION = new Map(MAQUETA.estacionamientos.map((e) => [e.id, e]));
const ESCALA_MAXIMA = 1.4; // la imagen mide 2400 px: más allá se ve borrosa
const MARGEN = 16;
const ARRIBA = 64; // espacio de la barra «Alejar · Acercar · Ver todo»

// Calcula la caja (mínimos y máximos de x e y) que encierra una lista de puntos de la imagen.
function cajaDe(puntos) {
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

// Calcula la caja de todo el campus (estacionamientos y edificios) con 30 px de aire alrededor.
const CAJA_CAMPUS = (() => {
  const c = cajaDe([...MAQUETA.estacionamientos.flatMap((e) => e.puntos), ...MAQUETA.edificios.map((e) => e.punto)]);
  return { x0: c.x0 - 30, y0: c.y0 - 30, x1: c.x1 + 30, y1: c.y1 + 30 };
})();

// Calcula la escala y la posición para que una caja de la imagen quepa en el área visible.
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

// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German
// @HU-4.2 Consultar el semáforo de ocupación · Aaron
// Muestra la maqueta del campus en /mapa con el semáforo de cada estacionamiento, en vivo. HU 4.2 y HU 4.3.
// Permite arrastrar, pellizcar y acercar; al tocar un estacionamiento muestra su tarjeta.
export default function MaquetaCampus() {
  const zona = useRef(null);
  const [estacionamientos, setEstacionamientos] = useState(null);
  const [conexion, setConexion] = useState("conectando");
  const [error, setError] = useState(null);
  const [elegido, setElegido] = useState(null);
  // Lee ?estacionamiento=<id> de la dirección (viene de «Ver en el mapa», HU 7.2) y lo deja elegido.
  // Corre una sola vez, al abrir el mapa.
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

  // Pide la ocupación al back: GET /api/estacionamientos → { estacionamientos }; si falla, guarda un error. [fetch]
  const cargar = useCallback(async () => {
    try {
      // @FETCH Mapa › GET /api/estacionamientos — pide los puestos libres para pintar cada estacionamiento en el mapa
      const respuesta = await fetch("/api/estacionamientos", { cache: "no-store" });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      const { estacionamientos } = await respuesta.json();
      setEstacionamientos(estacionamientos);
      setError(null);
    } catch {
      setError("No se pudo cargar el mapa");
    }
  }, []);

  // 1) Carga los datos iniciales y abre el canal en vivo /api/eventos; corre al montar.
  // Actualiza un estacionamiento con AVISO o ESTACIONAMIENTO, y todos con REINICIO. [en-vivo]
  useEffect(() => {
    cargar();
    // @FETCH Mapa › canal en vivo /api/eventos (EventSource) — se queda escuchando y cambia el color del estacionamiento al momento
    const canal = new EventSource("/api/eventos");
    let huboCorte = false;
    // Marca la conexión «En vivo» y, si venía de un corte, recarga todo. [en-vivo]
    canal.onopen = () => {
      setConexion("en-vivo");
      // Al volver de un corte se recarga todo: pudo haber cambios mientras no había conexión.
      if (huboCorte) cargar();
      huboCorte = false;
    };
    // Marca «Reconectando…» o «Sin conexión» cuando se cae el canal. [en-vivo]
    canal.onerror = () => {
      huboCorte = true;
      setConexion(navigator.onLine ? "reconectando" : "sin-conexion");
    };
    // Aplica cada cambio que llega por el canal sin volver a pedir toda la lista. [en-vivo]
    canal.onmessage = (evento) => {
      const mensaje = JSON.parse(evento.data);
      if (mensaje.clase === "AVISO" || mensaje.clase === "ESTACIONAMIENTO") {
        const cambio = mensaje.estacionamiento;
        setEstacionamientos((lista) => lista?.map((e) => (e.id === cambio.id ? { ...e, ...cambio } : e)) ?? lista);
        if (mensaje.clase === "AVISO") setLatiendo({ id: cambio.id, vez: Date.now() });
      } else if (mensaje.clase === "REINICIO") {
        const porId = new Map(mensaje.estacionamientos.map((e) => [e.id, e]));
        setEstacionamientos((lista) => lista?.map((e) => ({ ...e, ...porId.get(e.id) })) ?? lista);
      }
    };
    // Marca «Sin conexión» cuando el navegador pierde la red.
    const sinRed = () => setConexion("sin-conexion");
    window.addEventListener("offline", sinRed);
    // Al salir del mapa, cierra el canal en vivo y deja de escuchar la red. [en-vivo]
    return () => {
      canal.close();
      window.removeEventListener("offline", sinRed);
    };
  }, [cargar]);

  // Si hubo un error al cargar, reintenta a los 5 segundos; corre cada vez que cambia el error.
  useEffect(() => {
    if (!error) return;
    const reintento = setTimeout(cargar, 5000);
    // Cancela el reintento pendiente si el error cambia o se sale del mapa.
    return () => clearTimeout(reintento);
  }, [error, cargar]);

  // 2) Mide el área visible del mapa (en el celular, la hoja de la lista tapa la parte de abajo).
  // Corre cuando llegan los primeros datos y vuelve a medir si cambia el tamaño o se abre la hoja.
  useEffect(() => {
    const elemento = zona.current;
    if (!elemento) return;
    // Guarda el ancho y el alto del mapa y cuánto lo tapa la hoja de la lista.
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
    // Deja de observar los tamaños al salir del mapa.
    return () => {
      observador.disconnect();
      cambios.disconnect();
    };
  }, [hayDatos]);

  // Encuadra todo el campus con animación (botón «Ver todo»).
  const verTodo = useCallback(() => {
    if (!area) return;
    setAnimar(true);
    setVista(encuadre(CAJA_CAMPUS, area));
  }, [area]);

  // Encuadra de nuevo al cambiar el área (girar el celular, abrir o recoger la hoja) o el elegido:
  // acerca al estacionamiento elegido o muestra todo el campus.
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
  // Acerca o aleja la vista por un factor, dejando fijo el punto (cx, cy) bajo el dedo o el ratón.
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

  // Anota el dedo o el ratón que empieza a tocar la maqueta.
  const alPresionar = (e) => {
    arrastre.current.punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (arrastre.current.punteros.size === 1) arrastre.current.movido = 0;
  };
  // Mueve la vista con un dedo (arrastrar) o hace zoom con dos dedos (pellizcar).
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
  // Olvida el dedo o el ratón que se levantó.
  const alSoltar = (e) => arrastre.current.punteros.delete(e.pointerId);
  // Dice si fue un toque (se movió menos de 8 px) y no un arrastre.
  const fueToque = () => arrastre.current.movido < 8;

  // Escucha la rueda del ratón para acercar o alejar; corre al montar y si cambia ajustarZoom.
  useEffect(() => {
    const elemento = zona.current;
    if (!elemento) return;
    // Convierte el giro de la rueda en zoom alrededor del puntero.
    const rueda = (e) => {
      e.preventDefault();
      const caja = elemento.getBoundingClientRect();
      ajustarZoom(Math.exp(-e.deltaY * 0.0015), e.clientX - caja.left, e.clientY - caja.top);
    };
    elemento.addEventListener("wheel", rueda, { passive: false });
    // Deja de escuchar la rueda al salir del mapa.
    return () => elemento.removeEventListener("wheel", rueda);
  }, [ajustarZoom]);

  // Deja elegido un estacionamiento (desde la maqueta o desde la lista).
  const elegir = useCallback((id) => setElegido(id), []);

  // ---------- Dibujo ----------
  const fueraDeVivo = conexion !== "en-vivo" && hayDatos;
  const detalle = vista && area ? vista.s >= encuadre(CAJA_CAMPUS, area).s * 1.7 : false;
  const seleccionado = estacionamientos?.find((e) => e.id === elegido) ?? null;
  // Junta cada estacionamiento con su polígono en la imagen; se recalcula solo si cambian los datos.
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
                    {/* Siempre, desde que se abre el mapa: el nombre (HU 5.1 CA1) y debajo los libres con
                        el estado en texto (HU 4.2). Un cerrado dice solo «Cerrado». De lejos, la letra es más chica. */}
                    <span className="pildora-nombre">{est.etiqueta ?? est.nombre}</span>
                    <span className="pildora-estado">
                      {est.activo ? (
                        <>
                          <b>{est.libres}</b> {est.libres === 1 ? "libre" : "libres"} · {nivel.texto}
                        </>
                      ) : (
                        nivel.texto
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {/* Sin datos: «Cargando…», o el error de la HU 5.1 con «Reintentar» y «Salir» (además reintenta solo cada 5 s). */}
          {!estacionamientos && !error && <p className="mapa-aviso">Cargando la ocupación del campus…</p>}
          {!estacionamientos && error && (
            <div className="mapa-aviso" role="alert">
              <div className="mapa-error">
                <p>{error}</p>
                <button type="button" className="boton-principal" onClick={cargar}>Reintentar</button>
                <a className="boton-secundario" href="/">Salir</a>
              </div>
            </div>
          )}
        </div>

        <div className="maqueta-controles" role="group" aria-label="Acercar o alejar la maqueta">
          {/* «Alejar» y «Acercar» hacen zoom alrededor del centro del área visible. */}
          <button type="button" onClick={() => area && ajustarZoom(1 / 1.4, area.ancho / 2, (area.alto - area.tapado) / 2)}>
            Alejar
          </button>
          <button type="button" onClick={() => area && ajustarZoom(1.4, area.ancho / 2, (area.alto - area.tapado) / 2)}>
            Acercar
          </button>
          {/* «Ver todo» suelta el estacionamiento elegido y encuadra todo el campus. */}
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
        elegido={elegido}
        onElegir={elegir}
      />
    </div>
  );
}
