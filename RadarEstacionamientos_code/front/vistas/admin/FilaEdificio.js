"use client";
// @PANTALLA Admin Edificios › Fila de un edificio con «Guardar» y «Quitar»
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Fila de un edificio con los botones Guardar y Quitar

// HU 6.1 · Una fila del catálogo: modificar o quitar un edificio.
import { useActionState, useEffect, useMemo, useState } from "react";
import { EdificioControlador } from "@/controladores/EdificioControlador";
import CamposEdificio from "@/vistas/admin/CamposEdificio";
import estilos from "@/estilos/formularios.module.css";

// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German
// Muestra una fila del catálogo en /admin/edificios para modificar o quitar un edificio. HU 6.1.
// Usa EdificioControlador.modificar() y .quitar() (fetch PATCH y DELETE). [fetch]
export default function FilaEdificio({ edificio, alCambiar = () => {} }) {
  const controlador = useMemo(() => new EdificioControlador(), []);
  const [estado, guardar, guardando] = useActionState((_anterior, formulario) => controlador.modificar(edificio.id, formulario), {});
  const [estadoQuitar, quitar, quitando] = useActionState(() => controlador.quitar(edificio.id), {});

  // Si se guardó o se quitó, la lista se vuelve a pedir.
  useEffect(() => {
    if (estado.interfaz === "MensajeHecho" || estadoQuitar.interfaz === "MensajeHecho") alCambiar();
  }, [estado, estadoQuitar, alCambiar]);
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

      {/* Envía los cambios del edificio a EdificioControlador.modificar(). [fetch]
          noValidate apaga los avisos del navegador: los mensajes los da EdificioValidador. */}
      <form action={guardar} className={estilos.campos} noValidate>
        <CamposEdificio edificio={edificio} valores={estado.valores} />
        <button type="submit" className={estilos.boton} disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </form>

      {/* «Quitar» pide confirmar y «Cancelar» lo deshace; al confirmar llama a EdificioControlador.quitar(). [fetch] */}
      <form action={quitar} className={estilos.campos}>
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
