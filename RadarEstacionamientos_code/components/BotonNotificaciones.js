"use client";

// HU 8.1 · Activar las notificaciones.
//
// Dos formas de mostrarse:
//  - modo="invitacion" (en el mapa, al iniciar sesión): la solicitud con «Permitir» y «Bloquear».
//    CA1: «Permitir» → activadas + una notificación de prueba.
//    CA2: «Bloquear» → bloqueadas, sin prueba, y se le dice cómo activarlas después.
//    CA3: si ya respondió, no vuelve a salir en este navegador.
//  - modo="perfil" (en «Mis vehículos», que hace de perfil): siempre visible, para activarlas después.
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
  const [recienBloqueadas, setRecienBloqueadas] = useState(false);

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
    // Si las bloquea en el diálogo del navegador, también se le dice cómo activarlas (CA2).
    if (nuevoEstado === "denied") setRecienBloqueadas(true);
    setOcupado(false);
  }

  function bloquear() {
    gestorNotificaciones.bloquear();
    setPreferencia(GestorNotificaciones.PREFERENCIA_BLOQUEADAS);
    setRecienBloqueadas(true);
  }

  async function probar() {
    const enviada = await gestorNotificaciones.enviarNotificacionPrueba();
    setMensaje(enviada ? "Notificación de prueba enviada." : "No se pudo enviar la notificación de prueba.");
  }

  if (estadoPermiso === null) return null;

  // ---------- Solicitud en el mapa: solo si nunca respondió (CA3) ----------
  if (modo === "invitacion") {
    if (recienBloqueadas) {
      return (
        <div className="aviso-flotante" role="status">
          <p>Listo, no te enviaremos notificaciones. Puedes activarlas cuando quieras en «Mis vehículos».</p>
          <button type="button" className="boton-texto" onClick={() => setRecienBloqueadas(false)}>
            Entendido
          </button>
        </div>
      );
    }
    if (estadoPermiso !== "default" || preferencia) return null;
    return (
      <div className="aviso-flotante" role="dialog" aria-label="Activar las notificaciones">
        <p>¿Te avisamos cuando haya puesto o una incidencia en tu estacionamiento?</p>
        <button type="button" className="boton-texto" onClick={bloquear}>
          Bloquear
        </button>
        <button type="button" className="boton-principal" onClick={activar} disabled={ocupado}>
          Permitir
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
          <button type="button" className={estilos.botonSecundario} onClick={activar} disabled={ocupado}>
            Activar notificaciones
          </button>
        </>
      )}

      {estadoPermiso === "granted" && (
        <>
          <p className={estilos.ayuda}>Las notificaciones están activadas.</p>
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

      {/* Sin verde: en el Radar el verde solo significa «hay puesto» (DESIGN.md, Regla Color con Significado). */}
      <p className={estilos.ayuda} role="status">
        {mensaje}
      </p>
    </section>
  );
}
