"use client";

// HU 6.1 · Una fila del catálogo: modificar o quitar un edificio.
import { useActionState, useState } from "react";
import { borrarEdificio, guardarEdificio } from "@/acciones/edificios";
import CamposEdificio from "@/componentes/admin/CamposEdificio";
import estilos from "@/estilos/formularios.module.css";

// Muestra una fila del catálogo en /admin/edificios para modificar o quitar un edificio. HU 6.1.
// Usa dos acciones del servidor: guardarEdificio y borrarEdificio. [accion]
export default function FilaEdificio({ edificio }) {
  const [estado, guardar, guardando] = useActionState(guardarEdificio, {});
  const [estadoQuitar, quitar, quitando] = useActionState(borrarEdificio, {});
  // Quitar pide una segunda confirmación para no borrar un edificio por accidente.
  const [confirmando, setConfirmando] = useState(false);
  const aviso = estadoQuitar.error ? estadoQuitar : estado;

  return (
    <li className={estilos.tarjeta}>
      <div className={estilos.encabezado}>
        <h2>{edificio.nombre}</h2>
        <span className={estilos.marcas}>
          <span className={estilos.etiqueta}>{edificio.ubicacion ? "Con ubicación" : "Sin ubicación"}</span>
        </span>
      </div>

      {/* Envía los cambios del edificio a la acción guardarEdificio. [accion] */}
      <form action={guardar} className={estilos.campos}>
        <input type="hidden" name="id" value={edificio.id} />
        <CamposEdificio edificio={edificio} valores={estado.valores} />
        <button type="submit" className={estilos.boton} disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </form>

      {/* Envía el id a la acción borrarEdificio; «Quitar» pide confirmar y «Cancelar» lo deshace. [accion] */}
      <form action={quitar} className={estilos.campos}>
        <input type="hidden" name="id" value={edificio.id} />
        {confirmando ? (
          <>
            <span>¿Quitar este edificio del catálogo?</span>
            <button type="submit" className={`${estilos.boton} ${estilos.peligro}`} disabled={quitando}>
              {quitando ? "Quitando…" : "Sí, quitar"}
            </button>
            <button type="button" className={estilos.botonSecundario} onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <button type="button" className={estilos.botonSecundario} onClick={() => setConfirmando(true)}>
            Quitar
          </button>
        )}
      </form>

      <p aria-live="polite" className={aviso.error ? estilos.error : estilos.exito}>
        {aviso.error ?? aviso.mensaje}
      </p>
    </li>
  );
}
