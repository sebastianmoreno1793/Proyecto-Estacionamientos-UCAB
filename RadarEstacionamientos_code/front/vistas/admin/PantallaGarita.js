"use client";
// @PANTALLA Admin Garita (/admin/garita) — avisos de los sensores, avisos rechazados, sensores con falla y placas leídas
// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Lista de avisos recibidos y sensores que dejaron de avisar
// @HU-3.2 Simular sensores y placas · Aaron — Placas leídas
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Avisos rechazados, por qué, y sensores con falla
// Vista «interfaz» · Administrar › Garita. Las placas son datos personales: solo las ve el administrador.
// Muestra también lo que dicen las tácticas de disponibilidad (FiltroDeAvisos y MonitorDeSensores).
import { useEffect, useMemo, useState } from "react";
import { GaritaControlador } from "@/controladores/GaritaControlador";
import MenuAdmin from "@/vistas/comunes/MenuAdmin";
import { Formato } from "@/vistas/comunes/Formato";
import MensajeDatosNoValidos from "@/vistas/comunes/MensajeDatosNoValidos";
import estilos from "@/estilos/formularios.module.css";

// Por qué se rechazó un aviso: «no existe» es un rechazo (RN4); lo demás es una anomalía (RN3).
const MOTIVOS = {
  no_existe: "Rechazado: el estacionamiento no existe",
  lleno: "Anomalía: entrada con el estacionamiento lleno",
  vacio: "Anomalía: salida sin carros dentro",
  tipo: "Anomalía: tipo de movimiento desconocido",
};

export default function PantallaGarita() {
  const controlador = useMemo(() => new GaritaControlador(), []);
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    controlador.actividad().then(setDatos);
  }, [controlador]);

  if (!datos) return <main className={estilos.pagina}><p className={estilos.ayuda}>Cargando…</p></main>;
  const { movimientos, rechazados, lecturas, sensores, etiquetas } = datos;
  const nombre = (id) => etiquetas[id] ?? id ?? "sin estacionamiento";

  return (
    <main className={`${estilos.pagina} ancha`}>
      <h1>Administrar</h1>
      <MenuAdmin />
      <MensajeDatosNoValidos error={datos.ok ? null : datos.error} />

      {/* Tácticas de disponibilidad: sensor con N anomalías seguidas y sensor que no avisa (timeout). */}
      <section className={estilos.tarjeta}>
        <h2>Sensores</h2>
        {sensores.conFalla.length === 0 && sensores.sinAviso.length === 0 ? (
          <p className={estilos.ayuda}>Todos los sensores están avisando con normalidad.</p>
        ) : (
          <ul className={estilos.lista}>
            {sensores.conFalla.map((id) => (
              <li key={`falla-${id}`}>
                Con falla · {nombre(id)} · {sensores.limiteDeAnomalias} o más avisos imposibles seguidos
              </li>
            ))}
            {sensores.sinAviso.map((s) => (
              <li key={`sin-${s.estacionamientoId}`}>
                Sin avisar · {nombre(s.estacionamientoId)} · hace {s.minutosSinAviso} min (límite {sensores.tiempoLimiteMinutos} min)
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={estilos.tarjeta}>
        <h2>Entradas y salidas ({movimientos.length})</h2>
        {movimientos.length === 0 ? (
          <p className={estilos.ayuda}>Todavía no llega ningún aviso.</p>
        ) : (
          <ul className={estilos.lista}>
            {movimientos.map((m) => (
              <li key={m.id}>
                {m.tipo === "ENTRADA" ? "Entrada" : "Salida"} · {nombre(m.estacionamientoId)} · {Formato.fechaHora(m.hora)}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* HU 4.1 (RN3 y RN4): lo que llegó y no cambió el aforo, con la hora y el motivo. */}
      <section className={estilos.tarjeta}>
        <h2>Avisos rechazados ({rechazados.length})</h2>
        {rechazados.length === 0 ? (
          <p className={estilos.ayuda}>Ningún aviso fue rechazado.</p>
        ) : (
          <ul className={estilos.lista}>
            {rechazados.map((r) => (
              <li key={r.id}>
                {MOTIVOS[r.motivo] ?? r.motivo} · {nombre(r.estacionamientoId)} · {Formato.fechaHora(r.hora)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={estilos.tarjeta}>
        <h2>Placas leídas en la garita ({lecturas.length})</h2>
        {lecturas.length === 0 ? (
          <p className={estilos.ayuda}>El lector de placas no ha leído ninguna todavía.</p>
        ) : (
          <ul className={estilos.lista}>
            {lecturas.map((l) => (
              <li key={l.id}>
                <strong>{l.placa}</strong> · {l.sentido === "ENTRADA" ? "entró" : "salió"} · {Formato.fechaHora(l.hora)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
