"use client";

// Simulador del Radar de Estacionamientos UCAB: un mundo virtual que le pasa a la app base
// lo mismo que le pasaría en la realidad (carros que entran y salen, placas en la garita,
// incidencias, cambios del administrador) y la mira reaccionar.
//
// Regla de oro: el simulador NO toca la app por dentro. Todo va por su API pública (la
// misma que usarían los sensores, el lector de placas, Postman o un usuario) y lo que pasa
// en la app llega de vuelta por su canal en vivo (GET /api/eventos).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Mapa3D from "@/components/Mapa3D";
import PanelDeControl from "@/components/PanelDeControl";
import { appBase, TIPOS_DE_INCIDENCIA, URL_EVENTOS } from "@/lib/cliente_base";
import {
  avisosParaLlenar,
  avisosParaVaciar,
  incidenciaAleatoria,
  placaAleatoria,
  repartirLlegadas,
  repartirSalidas,
} from "@/lib/escenarios";

const URL_APP_BASE = process.env.NEXT_PUBLIC_URL_APP_BASE ?? "http://localhost:3000";
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const nuevoId = () => crypto.randomUUID();
const hora = () => new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export default function PaginaSimulador() {
  const [estacionamientos, setEstacionamientos] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [conexion, setConexion] = useState("conectando");
  const [seleccionado, setSeleccionado] = useState(null);
  const [placa, setPlaca] = useState("AB123CD");
  const [registro, setRegistro] = useState([]);
  const [tarea, setTarea] = useState(null); // escenario en curso: { nombre, hechos, total }
  const [ordenes, setOrdenes] = useState(null); // lote de órdenes para el mundo 3D
  const [menuAbierto, setMenuAbierto] = useState(true);

  const misAvisos = useRef(new Set()); // avisos que mandó este simulador (no se re-animan)
  const misLecturas = useRef(new Set());
  const secuencia = useRef(0);
  const cancelar = useRef(false);

  const etiquetaDe = useCallback(
    (id) => estacionamientos.find((e) => e.id === id)?.etiqueta ?? id,
    [estacionamientos]
  );

  // ---------- Registro (como la consola de Postman) ----------
  const anotar = useCallback((entrada) => {
    setRegistro((previo) => [{ id: nuevoId(), hora: hora(), ...entrada }, ...previo].slice(0, 120));
  }, []);
  const anotarLlamada = useCallback(
    (r, texto) =>
      anotar({
        clase: r.ok ? "ok" : "error",
        texto: texto ?? r.datos?.error ?? "Sin respuesta",
        detalle: `${r.metodo} ${r.ruta} · ${r.estado || "sin conexión"} · ${r.ms} ms`,
      }),
    [anotar]
  );

  // ---------- Órdenes para el mundo 3D (en lote, para que no se pierda ninguna) ----------
  const ordenar = useCallback((orden) => {
    const conSecuencia = { ...orden, seq: ++secuencia.current };
    setOrdenes((previo) => ({ ordenes: [...(previo?.ordenes ?? []).slice(-40), conSecuencia] }));
  }, []);

  // ---------- Estado de la app base ----------
  const fusionar = useCallback((nuevos) => {
    const porId = new Map(nuevos.map((e) => [e.id, e]));
    setEstacionamientos((previo) =>
      previo.length === 0 ? nuevos : previo.map((e) => (porId.has(e.id) ? { ...e, ...porId.get(e.id) } : e))
    );
  }, []);

  const cargarEstado = useCallback(async () => {
    const r = await appBase.estacionamientos();
    if (!r.ok) {
      setConexion("sin_conexion");
      return;
    }
    fusionar(r.datos.estacionamientos);
    setSeleccionado((actual) => actual ?? r.datos.estacionamientos[0]?.id ?? null);
    const ri = await appBase.incidencias();
    if (ri.ok) setIncidencias(ri.datos.incidencias);
  }, [fusionar]);

  // Canal en vivo de la app base: así se ve también lo que hacen Postman, otros
  // simuladores o las personas que usan la app.
  useEffect(() => {
    cargarEstado();
    const fuente = new EventSource(URL_EVENTOS);
    fuente.onerror = () => setConexion("sin_conexion");
    fuente.onmessage = (e) => {
      let m;
      try {
        m = JSON.parse(e.data);
      } catch {
        return;
      }
      switch (m.clase) {
        case "CONEXION":
          setConexion("conectada");
          cargarEstado(); // al (re)conectar, se pone al día
          break;
        case "AVISO": {
          const { movimiento, estacionamiento } = m;
          fusionar([estacionamiento]);
          if (!misAvisos.current.has(movimiento.idAviso)) {
            ordenar({ tipo: movimiento.tipo, estacionamientoId: movimiento.estacionamientoId, origen: "externo" });
            anotar({
              clase: "evento",
              texto: `📡 Aviso externo: ${movimiento.tipo === "ENTRADA" ? "entrada en" : "salida de"} ${estacionamiento.etiqueta}`,
              detalle: `${estacionamiento.libres} libres · ${estacionamiento.porcentaje}%`,
            });
          }
          break;
        }
        case "LECTURA_GARITA":
          if (!misLecturas.current.has(m.idLectura)) {
            anotar({ clase: "evento", texto: `📷 La garita leyó una placa (${m.sentido.toLowerCase()}) desde otro cliente` });
          }
          break;
        case "INCIDENCIA":
          setIncidencias((previo) => (previo.some((i) => i.id === m.incidencia.id) ? previo : [...previo, m.incidencia]));
          ordenar({ tipo: "ENFOCAR", estacionamientoId: m.incidencia.estacionamientoId });
          anotar({ clase: "evento", texto: `⚠️ Incidencia: ${m.incidencia.nombreTipo}`, detalle: m.incidencia.estacionamientoId });
          break;
        case "ESTACIONAMIENTO":
          fusionar([m.estacionamiento]);
          anotar({
            clase: "evento",
            texto: `🛠️ ${m.estacionamiento.etiqueta}: ${m.estacionamiento.activo ? "activo" : "desactivado"}, ${m.estacionamiento.capacidad} puestos`,
          });
          break;
        case "REINICIO":
          fusionar(m.estacionamientos);
          setIncidencias([]);
          anotar({ clase: "evento", texto: "🔄 La app base volvió a los datos de ejemplo" });
          break;
        default:
      }
    };
    return () => fuente.close();
  }, [cargarEstado, fusionar, ordenar, anotar]);

  // ---------- Lo que pasa en el mundo 3D se convierte en llamadas a la app base ----------
  const alDispararEvento = useCallback(
    async (evento) => {
      if (evento.tipo === "SELECCIONAR") {
        setSeleccionado(evento.estacionamientoId);
        return;
      }
      if (evento.tipo === "LECTURA_PLACA") {
        misLecturas.current.add(evento.idLectura);
        const r = await appBase.lecturaDePlaca(evento.placa, evento.sentido, evento.idLectura);
        anotarLlamada(r, r.ok ? `📷 Garita: placa ${evento.placa} (${evento.sentido.toLowerCase()})` : undefined);
        return;
      }
      if (evento.tipo === "AVISO") {
        misAvisos.current.add(evento.idAviso); // antes de enviarlo: el eco del canal llega rápido
        const r = await appBase.aviso(evento.estacionamientoId, evento.movimiento, evento.idAviso);
        if (r.ok) {
          fusionar([r.datos.estacionamiento]);
          anotarLlamada(
            r,
            `${evento.movimiento === "ENTRADA" ? "🟢 Entró a" : "🔴 Salió de"} ${r.datos.estacionamiento.etiqueta} · ${r.datos.estacionamiento.libres} libres`
          );
        } else {
          anotarLlamada(r);
          cargarEstado(); // el mapa vuelve a lo que dice la app
        }
      }
    },
    [anotarLlamada, cargarEstado, fusionar]
  );

  // ---------- Acciones del menú ----------
  const mandarCarro = useCallback(
    (tipo, estacionamientoId = seleccionado, placaDelCarro = placa) => {
      if (!estacionamientoId) return;
      ordenar({ tipo, estacionamientoId, placa: placaDelCarro, origen: "simulador", idAviso: nuevoId() });
      setPlaca(placaAleatoria());
    },
    [ordenar, seleccionado, placa]
  );

  const correrTarea = useCallback(
    async (nombre, pasos, { pausa = 0, enParalelo = 1 } = {}) => {
      if (pasos.length === 0) {
        anotar({ clase: "error", texto: `${nombre}: no hay nada que hacer con el estado actual del campus.` });
        return;
      }
      cancelar.current = false;
      setTarea({ nombre, hechos: 0, total: pasos.length });
      let hechos = 0;
      let siguiente = 0;
      const trabajador = async () => {
        while (siguiente < pasos.length && !cancelar.current) {
          const paso = pasos[siguiente++];
          await paso();
          hechos++;
          if (hechos % 5 === 0 || hechos === pasos.length) setTarea({ nombre, hechos, total: pasos.length });
          if (pausa) await esperar(pausa);
        }
      };
      await Promise.all(Array.from({ length: enParalelo }, trabajador));
      anotar({
        clase: cancelar.current ? "error" : "ok",
        texto: `${cancelar.current ? "⏹ Detenido" : "🎬 Listo"}: ${nombre} (${hechos} de ${pasos.length})`,
      });
      setTarea(null);
    },
    [anotar]
  );

  const acciones = useMemo(
    () => ({
      seleccionar: (id) => {
        setSeleccionado(id);
        ordenar({ tipo: "ENFOCAR", estacionamientoId: id });
      },
      cambiarPlaca: setPlaca,
      placaAlAzar: () => setPlaca(placaAleatoria()),
      entrada: () => mandarCarro("ENTRADA"),
      salida: () => mandarCarro("SALIDA"),
      rafaga: () =>
        correrTarea(
          `Ráfaga en ${etiquetaDe(seleccionado)}`,
          Array.from({ length: 5 }, () => async () => mandarCarro("ENTRADA", seleccionado, placaAleatoria())),
          { pausa: 1200 }
        ),

      reportarIncidencia: async (tipo, estacionamientoId = seleccionado) => {
        const r = await appBase.reportarIncidencia(estacionamientoId, tipo);
        if (r.ok) setIncidencias((previo) => (previo.some((i) => i.id === r.datos.incidencia.id) ? previo : [...previo, r.datos.incidencia]));
        anotarLlamada(r, r.ok ? `⚠️ ${r.datos.incidencia.nombreTipo} en ${etiquetaDe(estacionamientoId)}` : undefined);
      },
      incidenciaAlAzar: async () => {
        const azar = incidenciaAleatoria(estacionamientos, TIPOS_DE_INCIDENCIA);
        if (azar) await acciones.reportarIncidencia(azar.tipo, azar.estacionamientoId);
      },
      olaDeIncidencias: () =>
        correrTarea(
          "Ola de incidencias",
          Array.from({ length: 3 }, () => () => acciones.incidenciaAlAzar()),
          { pausa: 900 }
        ),

      cambiarEstacionamiento: async (id, cambios) => {
        const r = await appBase.cambiarEstacionamiento(id, cambios);
        if (r.ok) fusionar([r.datos.estacionamiento]);
        anotarLlamada(
          r,
          r.ok
            ? `🛠️ ${r.datos.estacionamiento.etiqueta}: ${r.datos.estacionamiento.activo ? "activo" : "desactivado"}, ${r.datos.estacionamiento.capacidad} puestos`
            : undefined
        );
      },

      horaPico: () => {
        const ids = repartirLlegadas(estacionamientos, 24);
        return correrTarea(
          "Hora pico de las 10:00 a.m.",
          ids.map((id) => async () => mandarCarro("ENTRADA", id, placaAleatoria())),
          { pausa: 650 }
        );
      },
      finDeClases: () => {
        const ids = repartirSalidas(estacionamientos, 20);
        return correrTarea(
          "Fin de clases de las 2:00 p.m.",
          ids.map((id) => async () => mandarCarro("SALIDA", id, placaAleatoria())),
          { pausa: 650 }
        );
      },
      // Llenar y vaciar: cientos de avisos sin animación, directo a la API (como muchos sensores).
      llenar: () =>
        correrTarea(
          "Llenar el campus",
          avisosParaLlenar(estacionamientos).map(({ estacionamientoId, tipo }) => async () => {
            const idAviso = nuevoId();
            misAvisos.current.add(idAviso);
            const r = await appBase.aviso(estacionamientoId, tipo, idAviso);
            if (!r.ok) anotarLlamada(r);
          }),
          { enParalelo: 6 }
        ),
      vaciar: () =>
        correrTarea(
          "Vaciar el campus",
          avisosParaVaciar(estacionamientos).map(({ estacionamientoId, tipo }) => async () => {
            const idAviso = nuevoId();
            misAvisos.current.add(idAviso);
            const r = await appBase.aviso(estacionamientoId, tipo, idAviso);
            if (!r.ok) anotarLlamada(r);
          }),
          { enParalelo: 6 }
        ),
      reiniciar: async () => {
        const r = await appBase.reiniciar();
        if (r.ok) {
          fusionar(r.datos.estacionamientos);
          setIncidencias([]);
        }
        anotarLlamada(r, r.ok ? "🔄 App base reiniciada con los datos de ejemplo" : undefined);
      },
      detener: () => {
        cancelar.current = true;
      },
      limpiarRegistro: () => setRegistro([]),
    }),
    [anotarLlamada, correrTarea, estacionamientos, etiquetaDe, fusionar, mandarCarro, ordenar, seleccionado]
  );

  // ---------- Lo que ve el mundo 3D ----------
  const estacionamientos3D = useMemo(
    () =>
      estacionamientos.map((e) => ({
        ...e,
        seleccionado: e.id === seleccionado,
        incidencias: incidencias.filter((i) => i.estacionamientoId === e.id),
      })),
    [estacionamientos, incidencias, seleccionado]
  );

  const resumen = useMemo(() => {
    const activos = estacionamientos.filter((e) => e.activo);
    const capacidad = activos.reduce((s, e) => s + e.capacidad, 0);
    const ocupados = activos.reduce((s, e) => s + Math.min(e.ocupados, e.capacidad), 0);
    return {
      libres: activos.reduce((s, e) => s + e.libres, 0),
      porcentaje: capacidad ? Math.round((ocupados / capacidad) * 100) : 0,
      cerrados: estacionamientos.length - activos.length,
      incidencias: incidencias.filter((i) => i.estado === "pendiente").length,
    };
  }, [estacionamientos, incidencias]);

  const textoConexion = {
    conectando: "⏳ Conectando con la app base…",
    conectada: "🟢 Conectado a la app base",
    sin_conexion: "🔴 Sin conexión con la app base",
  }[conexion];

  return (
    <div className="simulador">
      <header className="barra">
        <h1>🧪 Simulador · Radar UCAB</h1>
        <div className="barra-datos">
          <span className={`ficha conexion-${conexion}`} title={URL_APP_BASE}>
            {textoConexion}
          </span>
          {estacionamientos.length > 0 && (
            <>
              <span className="ficha">
                <strong>{resumen.libres}</strong> puestos libres
              </span>
              <span className="ficha">
                Ocupación del campus <strong>{resumen.porcentaje}%</strong>
              </span>
              <span className="ficha">
                ⚠️ <strong>{resumen.incidencias}</strong> incidencias
              </span>
              {resumen.cerrados > 0 && (
                <span className="ficha">
                  ⛔ <strong>{resumen.cerrados}</strong> cerrados
                </span>
              )}
            </>
          )}
        </div>
        <a className="boton boton-fantasma" href={URL_APP_BASE} target="_blank" rel="noreferrer">
          Abrir la app base ↗
        </a>
        <button className="boton boton-azul" onClick={() => setMenuAbierto((v) => !v)} aria-expanded={menuAbierto}>
          {menuAbierto ? "Ocultar menú" : "☰ Menú"}
        </button>
      </header>

      <div className="cuerpo">
        <main className="escenario-3d">
          {estacionamientos.length > 0 ? (
            <Mapa3D estacionamientos={estacionamientos3D} ultimoEvento={ordenes} onDispararEvento={alDispararEvento} />
          ) : (
            <div className="aviso-conexion">
              <div>
                <strong>{conexion === "sin_conexion" ? "No encuentro la app base" : "Cargando el campus…"}</strong>
                {conexion === "sin_conexion" && (
                  <p className="ayuda">
                    El simulador necesita la app base corriendo en <code>{URL_APP_BASE}</code>. Arráncala con{" "}
                    <code>npm run dev</code> en <code>RadarEstacionamientos_code/</code>.
                  </p>
                )}
                <button className="boton boton-azul" onClick={cargarEstado}>
                  Reintentar
                </button>
              </div>
            </div>
          )}
        </main>

        <PanelDeControl
          hidden={!menuAbierto}
          urlAppBase={URL_APP_BASE}
          estacionamientos={estacionamientos}
          incidencias={incidencias}
          seleccionado={seleccionado}
          placa={placa}
          registro={registro}
          tarea={tarea}
          acciones={acciones}
        />
      </div>
    </div>
  );
}
