// @HU-9.1 Crear una incidencia · Sebastian — Mensaje «incidencia creada»: el tipo, el estacionamiento, la hora y la línea Enviado › Pendiente › Atendido
// Vista «interfaz» · Confirmación del reporte (como el «ProductoRegistrado» del ejemplo de la profesora).
import Link from "next/link";
import { Icono } from "@/vistas/comunes/Iconos";
import { Formato } from "@/vistas/comunes/Formato";
import { AspectoIncidencia } from "@/vistas/reportar/AspectoIncidencia";

export default function MensajeIncidenciaCreada({ incidencia, alReportarOtro }) {
  const aspecto = AspectoIncidencia.de(incidencia.tipo);
  return (
    <section className="pantalla formulario-ancho" style={{ padding: 0, margin: 0, maxWidth: 520 }} aria-live="polite" aria-labelledby="reporte-titulo">
      <div className={`tarjeta-grande ${aspecto.color}`}>
        <Icono nombre={aspecto.icono} />
        <span id="reporte-titulo" className="titulo-tarjeta">
          {incidencia.nombreTipo}
        </span>
        <span>
          {incidencia.estacionamiento} · {Formato.fechaHora(incidencia.reportadaEn)}
        </span>
      </div>
      <ol className="linea-estado">
        <li className="hecho">
          <span className="marca">
            <Icono nombre="check" />
          </span>
          Enviado
        </li>
        <li>
          <span className="marca" />
          Pendiente
        </li>
        <li className="futuro">
          <span className="marca" />
          Atendido
        </li>
      </ol>
      <Link href="/" className="accion centrada">
        Listo
      </Link>
      <button type="button" className="fila-enlace" onClick={alReportarOtro}>
        Reportar otro
        <Icono nombre="flecha" />
      </button>
    </section>
  );
}
