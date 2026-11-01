import { connection } from "next/server";
import { listarEstacionamientos, listarMovimientos } from "@/lib/estacionamientos/datos";
import { listarLecturasDePlaca } from "@/lib/garita/datos";
import { formatearFechaHora } from "@/lib/fechas";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";
import estilos from "../../formularios.module.css";

export const metadata = { title: "Actividad de la garita · Administración" };

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

  return (
    <main className={estilos.pagina}>
      <h1>Actividad de la garita</h1>
      <p className={estilos.ayuda}>
        Los últimos avisos de los sensores y las placas que leyó la garita. Se actualiza al recargar.
      </p>

      <section className={estilos.tarjeta}>
        <h2>Entradas y salidas ({movimientos.length})</h2>
        {movimientos.length === 0 ? (
          <p className={estilos.ayuda}>Todavía no llega ningún aviso.</p>
        ) : (
          <ul className={estilos.lista}>
            {movimientos.map((m) => (
              <li key={m.id}>
                {m.tipo === "ENTRADA" ? "🟢 Entrada" : "🔴 Salida"} · {etiquetas[m.estacionamientoId] ?? m.estacionamientoId} ·{" "}
                {formatearFechaHora(m.hora)}
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
                <strong>{l.placa}</strong> · {l.sentido === "ENTRADA" ? "entró" : "salió"} · {formatearFechaHora(l.hora)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
