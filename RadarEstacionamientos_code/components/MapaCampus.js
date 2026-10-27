"use client";

// Mapa del Campus Montalbán con los estacionamientos (HU 5.1) pintados con el semáforo de
// ocupación (HU 4.2) y actualizados al instante por el canal en vivo (base de la HU 4.3).
// Usa Leaflet + OpenStreetMap: gratis, sin cuenta con facturación (D-005, en revisión).
//
// Los datos salen de la API pública (`GET /api/estacionamientos`) y los cambios llegan por
// `GET /api/eventos`: el mismo camino que usa la maqueta 3D (D-006). Nada se calcula aquí:
// los libres y el porcentaje los da la app y el color lo da `nivelDelSemaforo`.
// Diseño: DESIGN.md › Mapa (D-007).

import { useCallback, useEffect, useRef, useState } from "react";
import { CENTRO_CAMPUS, ZOOM_INICIAL } from "@/data/estacionamientos";
import { CERRADO, SEMAFORO, nivelDelSemaforo } from "@/lib/estacionamientos/reglas";
import PanelPuestos from "./PanelPuestos";
import TarjetaEstacionamiento from "./TarjetaEstacionamiento";

const BORDE_PROFESORES = "#7c3aed";

const escapar = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function estilo(est, elegido) {
  const { color } = nivelDelSemaforo(est);
  return {
    color: est.soloProfesores ? BORDE_PROFESORES : color,
    dashArray: est.soloProfesores ? "6 4" : null,
    weight: elegido ? 4 : 2,
    fillColor: color,
    fillOpacity: est.activo ? 0.45 : 0.25,
  };
}

// Etiqueta permanente: una píldora con los libres, del color del semáforo (patrón de las apps
// de estacionamiento). El nombre aparece al acercarse; de lejos se amontonaría.
function etiqueta(est, conNombre) {
  const { color } = nivelDelSemaforo(est);
  const dato = est.activo ? `<b>${est.libres}</b>` : "Cerrado";
  const nombre = conNombre ? `<span class="pildora-nombre">${escapar(est.nombre)}</span>` : "";
  return `<span class="pildora" style="--color:${color}">${dato}</span>${nombre}`;
}

const ZOOM_CON_NOMBRES = 18;

export default function MapaCampus() {
  const contenedor = useRef(null);
  const mapaRef = useRef(null);
  const capasRef = useRef(new Map());
  const [estacionamientos, setEstacionamientos] = useState(null);
  const [conexion, setConexion] = useState("conectando");
  const [error, setError] = useState(null);
  const [listo, setListo] = useState(false);
  const [elegido, setElegido] = useState(null);
  const [conNombres, setConNombres] = useState(false);
  const elegidoRef = useRef(null);
  elegidoRef.current = elegido;

  const cargar = useCallback(async () => {
    try {
      const respuesta = await fetch("/api/estacionamientos", { cache: "no-store" });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      const { estacionamientos } = await respuesta.json();
      setEstacionamientos(estacionamientos);
      setError(null);
    } catch {
      setError("No se pudo cargar la ocupación. Reintentando…");
    }
  }, []);

  // El estacionamiento late una vez cuando llega un aviso de su sensor (DESIGN.md › Movimiento).
  const latir = useCallback((id) => {
    const elemento = capasRef.current.get(id)?.getElement();
    if (!elemento) return;
    elemento.classList.remove("latido");
    void elemento.getBoundingClientRect(); // reinicia la animación
    elemento.classList.add("latido");
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
        if (mensaje.clase === "AVISO") latir(cambio.id);
      } else if (mensaje.clase === "REINICIO") {
        const porId = new Map(mensaje.estacionamientos.map((e) => [e.id, e]));
        setEstacionamientos((lista) => lista?.map((e) => ({ ...e, ...porId.get(e.id) })) ?? lista);
      }
    };
    const sinRed = () => setConexion("sin-conexion");
    window.addEventListener("offline", sinRed);
    return () => {
      canal.close();
      window.removeEventListener("offline", sinRed);
    };
  }, [cargar, latir]);

  // Si la carga falló, se reintenta cada 5 s hasta que haya datos.
  useEffect(() => {
    if (!error) return;
    const reintento = setTimeout(cargar, 5000);
    return () => clearTimeout(reintento);
  }, [error, cargar]);

  // 2) El mapa se crea una sola vez, cuando ya hay estacionamientos para dibujar.
  const hayDatos = estacionamientos !== null;
  const primeraLista = useRef(null);
  if (hayDatos && !primeraLista.current) primeraLista.current = estacionamientos;
  useEffect(() => {
    if (!hayDatos) return;
    let observador;
    let cancelado = false;

    // Leaflet usa `window`, así que se carga solo en el navegador.
    import("leaflet").then(({ default: L }) => {
      if (cancelado || !contenedor.current) return;

      // zoomSnap fraccionario: el campus cabe completo también en pantallas angostas.
      const mapa = L.map(contenedor.current, { zoomSnap: 0.25, zoomControl: false }).setView(CENTRO_CAMPUS, ZOOM_INICIAL);
      mapaRef.current = mapa;
      L.control.zoom({ position: "topleft", zoomInTitle: "Acercar", zoomOutTitle: "Alejar" }).addTo(mapa);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa);

      for (const est of primeraLista.current) {
        if (!est.poligono) continue;
        const capa = L.polygon(est.poligono, estilo(est, false))
          .bindTooltip(etiqueta(est, false), { permanent: true, direction: "center", className: "etiqueta-estacionamiento" })
          .on("click", () => setElegido(est.id))
          .addTo(mapa);
        capasRef.current.set(est.id, capa);
      }
      mapa.on("click", (e) => {
        // Tocar el mapa fuera de un estacionamiento cierra la tarjeta.
        if (e.originalEvent.target === contenedor.current || e.originalEvent.target.classList?.contains("leaflet-container")) {
          setElegido(null);
        }
      });
      mapa.on("zoomend", () => setConNombres(mapa.getZoom() >= ZOOM_CON_NOMBRES));
      setListo(true);

      // Encuadra todos los estacionamientos, en computador o en celular.
      const encuadrar = () => {
        const capas = [...capasRef.current.values()];
        if (capas.length === 0) return;
        // En el celular la hoja de la lista tapa la parte de abajo: se encuadra en lo visible.
        const hoja = contenedor.current?.closest(".mapa-contenedor")?.querySelector(".panel-puestos");
        const tapado = window.innerWidth < 768 && hoja ? hoja.offsetHeight : 0;
        mapa.fitBounds(L.featureGroup(capas).getBounds(), { paddingTopLeft: [24, 24], paddingBottomRight: [24, 24 + tapado] });
      };
      encuadrar();

      // Si cambia el tamaño de la pantalla (girar el celular, cambiar la
      // ventana), el mapa se reajusta para que no queden estacionamientos cortados.
      // Si hay uno elegido, no se pierde: solo se reajusta el tamaño.
      observador = new ResizeObserver(() => {
        mapa.invalidateSize();
        if (!elegidoRef.current) encuadrar();
      });
      observador.observe(contenedor.current);
    });

    return () => {
      cancelado = true;
      if (observador) observador.disconnect();
      if (mapaRef.current) mapaRef.current.remove();
      mapaRef.current = null;
      capasRef.current.clear();
      setListo(false);
    };
  }, [hayDatos]);

  // 3) Cada cambio de ocupación o de selección repinta las capas.
  useEffect(() => {
    if (!listo || !estacionamientos) return;
    for (const est of estacionamientos) {
      const capa = capasRef.current.get(est.id);
      if (!capa) continue;
      capa.setStyle(estilo(est, est.id === elegido));
      capa.setTooltipContent(etiqueta(est, conNombres || est.id === elegido));
    }
  }, [listo, estacionamientos, elegido, conNombres]);

  // 4) Al elegir uno (en la lista o en el mapa), el mapa vuela hasta él.
  useEffect(() => {
    const capa = elegido && capasRef.current.get(elegido);
    if (!capa || !mapaRef.current) return;
    mapaRef.current.flyToBounds(capa.getBounds(), { maxZoom: 18, duration: 0.6, paddingBottomRight: [0, 160] });
    capa.bringToFront();
  }, [elegido]);

  const seleccionado = estacionamientos?.find((e) => e.id === elegido) ?? null;

  return (
    <div className={`mapa-contenedor${seleccionado ? " con-tarjeta" : ""}`}>
      <div className="mapa-zona">
        <div
          ref={contenedor}
          className="mapa-campus"
          role="region"
          aria-label="Mapa del Campus Montalbán con los estacionamientos y su ocupación"
        />
        {!hayDatos && <p className="mapa-aviso">{error ?? "Cargando la ocupación del campus…"}</p>}
        <ul className="leyenda" aria-label="Leyenda del semáforo">
          {[...SEMAFORO, CERRADO].map((n) => (
            <li key={n.nivel}>
              <span className="muestra" style={{ background: n.color, borderColor: n.color }} />
              {n.texto}
            </li>
          ))}
          <li>
            <span className="muestra muestra-profesores" style={{ borderColor: BORDE_PROFESORES }} />
            Solo profesores
          </li>
        </ul>
        {seleccionado && <TarjetaEstacionamiento estacionamiento={seleccionado} onCerrar={() => setElegido(null)} />}
      </div>
      <PanelPuestos
        estacionamientos={estacionamientos ?? []}
        conexion={conexion}
        elegido={elegido}
        onElegir={setElegido}
      />
    </div>
  );
}
