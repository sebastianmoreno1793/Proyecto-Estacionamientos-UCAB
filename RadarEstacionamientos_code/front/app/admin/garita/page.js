// @PANTALLA Admin Garita (/admin/garita) — avisos de los sensores, avisos rechazados y placas leídas
// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Pantalla de la garita: lista de avisos recibidos
// @HU-3.2 Simular sensores y placas · Aaron — Pantalla de la garita: placas leídas
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Pantalla de la garita: avisos rechazados y por qué
// Administrar › Garita (/admin/garita): avisos de los sensores, avisos rechazados y placas
// leídas (HU 3.1, 3.2 y 4.1). Solo administrador.
import { connection } from "next/server";
import MenuAdmin from "@/partes_de_pantallas/menu/MenuAdmin";
import { listarAvisosRechazados, listarEstacionamientos, listarMovimientos } from "@back/reglas_y_datos/estacionamientos/datos.js";
import { listarLecturasDePlaca } from "@back/reglas_y_datos/garita/datos.js";
import { formatearFechaHora } from "@back/piezas_compartidas/fechas.js";
import { esAdministrador, obtenerUsuarioActual } from "@/sesion_del_usuario/sesion";
import estilos from "@/estilos/formularios.module.css";

export const metadata = { title: "Actividad de la garita · Administración" };

// Por qué se rechazó un aviso: «no existe» es un rechazo (RN4); lo demás es una anomalía (RN3).
const MOTIVOS = {
  no_existe: "Rechazado: el estacionamiento no existe",
  lleno: "Anomalía: entrada con el estacionamiento lleno",
  vacio: "Anomalía: salida sin carros dentro",
  tipo: "Anomalía: tipo de movimiento desconocido",
};

// @HU-3.1 Recibir avisos de entrada y salida · Aaron
// @HU-3.2 Simular sensores y placas · Aaron
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
// Arma /admin/garita con las entradas y salidas de los sensores (HU 3.1), los avisos rechazados
// (HU 4.1) y las placas leídas (HU 3.2). Las placas son datos personales: solo las ve el administrador. [sesion]
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
