"use client";

// HU 8.1 · Activar las notificaciones.
//
// Dos formas de mostrarse:
//  - modo="invitacion" (en el mapa): aviso flotante la primera vez, con «Activar» y «Ahora no».
//    Si el usuario ya decidió (activó, bloqueó o pospuso), no vuelve a salir.
//  - modo="perfil" (en «Mi perfil»): siempre visible, para activarlas después (criterio de la HU).
//
// Toda la lógica (permiso del navegador, preferencia guardada, Service Worker) está en
// lib/notificaciones/gestorNotificaciones.js; este componente solo muestra el estado.

import { useEffect, useState } from "react";
import { GestorNotificaciones, gestorNotificaciones } from "@/lib/notificaciones/gestorNotificaciones";
import estilos from "@/app/formularios.module.css";

export default function BotonNotificaciones({ modo = "perfil" }) {
  // null mientras no sabemos el estado (el servidor no tiene `Notification`).
  const [estadoPermiso, setEstadoPermiso] = useState(null);
  const [preferencia, setPreferencia] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    setEstadoPermiso(gestorNotificaciones.obtenerEstadoPermiso());
    setPreferencia(gestorNotificaciones.obtenerPreferencia());
  }, []);

  async function activar() {
    setOcupado(true);
    const nuevoEstado = await gestorNotificaciones.pedirPermiso();
    setEstadoPermiso(nuevoEstado);
    setPreferencia(gestorNotificaciones.obtenerPreferencia());
    if (nuevoEstado === "granted") setMensaje("Listo: te enviamos una notificación de prueba.");
    setOcupado(false);
  }

  function posponer() {
    gestorNotificaciones.posponer();
    setPreferencia(GestorNotificaciones.PREFERENCIA_POSPUESTAS);
  }

  async function probar() {
    const enviada = await gestorNotificaciones.enviarNotificacionPrueba();
    setMensaje(enviada ? "Notificación de prueba enviada." : "No se pudo enviar la notificación de prueba.");
  }

  if (estadoPermiso === null) return null;

  // ---------- Invitación en el mapa: solo si nunca decidió ----------
  if (modo === "invitacion") {
    if (estadoPermiso !== "default" || preferencia) return null;
    return (
      <div className="aviso-flotante" role="dialog" aria-label="Activar notificaciones">
        <p>¿Te avisamos cuando haya puesto o una incidencia en tu estacionamiento?</p>
        <button type="button" className="boton-texto" onClick={posponer}>
          Ahora no
        </button>
        <button type="button" className="boton-principal" onClick={activar} disabled={ocupado}>
          Activar
        </button>
      </div>
    );
  }

  // ---------- En el perfil: siempre se puede ver y cambiar ----------
  return (
    <section className={estilos.tarjeta} aria-labelledby="titulo-notificaciones">
      <h2 id="titulo-notificaciones">Notificaciones</h2>

      {estadoPermiso === "unsupported" && (
        <p className={estilos.ayuda}>Este navegador no permite notificaciones web.</p>
      )}

      {estadoPermiso === "default" && (
        <>
          <p className={estilos.ayuda}>
            Actívalas para enterarte de la disponibilidad de puestos y de las incidencias.
          </p>
          <button type="button" className={estilos.boton} onClick={activar} disabled={ocupado}>
            Activar notificaciones
          </button>
        </>
      )}

      {estadoPermiso === "granted" && (
        <>
          <p className={estilos.exito}>Las notificaciones están activadas.</p>
          <button type="button" className={estilos.botonSecundario} onClick={probar}>
            Enviar una de prueba
          </button>
        </>
      )}

      {estadoPermiso === "denied" && (
        <p className={estilos.ayuda}>
          Las bloqueaste en el navegador. Para activarlas, permite las notificaciones de este sitio
          en los ajustes del navegador y vuelve a esta página.
        </p>
      )}

      <p className={estilos.exito} role="status">
        {mensaje}
      </p>
    </section>
  );
}
