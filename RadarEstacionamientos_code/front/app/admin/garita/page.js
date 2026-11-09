// Administrar › Garita (/admin/garita): avisos de los sensores, avisos rechazados y placas
// leídas (HU 3.1, 3.2 y 4.1). Solo administrador.
import { connection } from "next/server";
import MenuAdmin from "@/componentes/MenuAdmin";
import { listarAvisosRechazados, listarEstacionamientos, listarMovimientos } from "@back/logica/estacionamientos/datos";
import { listarLecturasDePlaca } from "@back/logica/garita/datos";
import { formatearFechaHora } from "@back/logica/fechas";
import { esAdministrador, obtenerUsuarioActual } from "@/servidor/sesion";
import estilos from "../../formularios.module.css";

export const metadata = { title: "Actividad de la garita · Administración" };

// Por qué se rechazó un aviso: «no existe» es un rechazo (RN4); lo demás es una anomalía (RN3).
const MOTIVOS = {
  no_existe: "Rechazado: el estacionamiento no existe",
  lleno: "Anomalía: entrada con el estacionamiento lleno",
  vacio: "Anomalía: salida sin carros dentro",
  desactivado: "Anomalía: aviso de un estacionamiento cerrado",
  tipo: "Anomalía: tipo de movimiento desconocido",
};

// Lo que registraron los sensores (HU 3.1) y el lector de placas de la garita (HU 3.2).
// Las placas son datos personales: solo las ve el personal autorizado.
export default async function PaginaActividad() {
  await connection();
  if (!esAdministrador(await obtenerUsuarioActual())) {
    return (
      <main className={estilos.pagina}>
        <h1>Actividad de la garita</h1>
        <p>Esta página es solo para el personal autorizado.</p>
      </main>
    );
  }

  const etiquetas = Object.fromEntries((await listarEstacionamientos()).map((e) => [e.id, e.etiqueta]));
  const movimientos = await listarMovimientos(30);
  const lecturas = await listarLecturasDePlaca(30);
  const rechazados = await listarAvisosRechazados(30);

  return (
    <main className={`${estilos.pagina} ancha`}>
      <h1>Administrar</h1>
      <MenuAdmin />

      <section className={estilos.tarjeta}>
        <h2>Entradas y salidas ({movimientos.length})</h2>
        {movimientos.length === 0 ? (
          <p className={estilos.ayuda}>Todavía no llega ningún aviso.</p>
        ) : (
          <ul className={estilos.lista}>
            {movimientos.map((m) => (
              <li key={m.id}>
                {m.tipo === "ENTRADA" ? "Entrada" : "Salida"} · {etiquetas[m.estacionamientoId] ?? m.estacionamientoId}{" "}
                · {formatearFechaHora(m.hora)}
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
                {MOTIVOS[r.motivo] ?? r.motivo} ·{" "}
                {etiquetas[r.estacionamientoId] ?? r.estacionamientoId ?? "sin estacionamiento"} ·{" "}
                {formatearFechaHora(r.hora)}
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
                <strong>{l.placa}</strong> · {l.sentido === "ENTRADA" ? "entró" : "salió"} ·{" "}
                {formatearFechaHora(l.hora)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
