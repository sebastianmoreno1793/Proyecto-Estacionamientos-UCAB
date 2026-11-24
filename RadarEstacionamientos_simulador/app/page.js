"use client";
// @PANTALLA Simulador (/) — el simulador: el campus en 3D y el panel para mandarle cosas a la app

// Simulador del Radar de Estacionamientos UCAB: un mundo virtual que le pasa a la app base
// lo mismo que le pasaría en la realidad (carros que entran y salen, placas en la garita,
// incidencias, cambios del administrador) y la mira reaccionar.
//
// Regla de oro: el simulador NO toca la app por dentro. Todo va por su API pública (la
// misma que usarían los sensores, el lector de placas, Postman o un usuario) y lo que pasa
// en la app llega de vuelta por su canal en vivo (GET /api/eventos).

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Mapa3D from "@/componentes_visuales/Mapa3D";
import PanelDeControl from "@/componentes_visuales/PanelDeControl";
import { SimuladorControlador } from "@/controladores/SimuladorControlador";

const URL_APP_BASE = process.env.NEXT_PUBLIC_URL_APP_BASE ?? "http://localhost:3000";

// La lógica vive en SimuladorControlador; aquí solo se dibuja su estado.
export default function PaginaSimulador() {
  const [controlador] = useState(() => new SimuladorControlador());
  const estado = useSyncExternalStore(controlador.suscribir, controlador.instantanea, controlador.instantanea);
  const { estacionamientos, incidencias, conexion, seleccionado, placa, registro, tarea, ordenes } = estado;
  const [menuAbierto, setMenuAbierto] = useState(true);

  // Canal en vivo de la app base mientras la página está abierta.
  useEffect(() => controlador.conectar(), [controlador]);

  // ---------- Lo que ve el mundo 3D ----------
  const estacionamientos3D = useMemo(
    () => SimuladorControlador.paraElMapa({ estacionamientos, incidencias, seleccionado }),
    [estacionamientos, incidencias, seleccionado],
  );
  const resumen = useMemo(() => SimuladorControlador.resumen({ estacionamientos, incidencias }), [estacionamientos, incidencias]);

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
            <Mapa3D estacionamientos={estacionamientos3D} ultimoEvento={ordenes} onDispararEvento={controlador.alDispararEvento} />
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
                <button className="boton boton-azul" onClick={controlador.cargarEstado}>
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
          acciones={controlador.acciones}
        />
      </div>
    </div>
  );
}
