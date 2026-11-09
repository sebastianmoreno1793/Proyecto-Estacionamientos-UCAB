"use client";

// HU 8.1 · Activar las notificaciones.
//
// Dos formas de mostrarse:
//  - modo="invitacion" (en el mapa, al iniciar sesión): la solicitud con «Permitir» y «Bloquear».
//    CA1: «Permitir» → activadas + una notificación de prueba.
//    CA2: «Bloquear» → bloqueadas, sin prueba, y se le dice cómo activarlas después.
//    CA3: si ya respondió, no vuelve a salir en este navegador.
//  - modo="perfil" (en Perfil): un interruptor siempre visible, para activarlas o apagarlas después.
//
// Toda la lógica (permiso del navegador, preferencia guardada, Service Worker) está en
// front/notificaciones/GestorNotificaciones.js; este componente solo muestra el estado.

import { useEffect, useState } from "react";
import { GestorNotificaciones, gestorNotificaciones } from "@/notificaciones/GestorNotificaciones";

export default function Notificaciones({ modo = "perfil" }) {
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
    try {
      const nuevoEstado = await gestorNotificaciones.pedirPermiso();
      setEstadoPermiso(nuevoEstado);
      setPreferencia(gestorNotificaciones.obtenerPreferencia());
      if (nuevoEstado === "granted") {
        setMensaje(
          gestorNotificaciones.pruebaEnviada
            ? "Listo: te enviamos una notificación de prueba."
            : "Quedaron activadas, pero no se pudo mostrar la notificación de prueba.",
        );
      }
      // Si las bloquea en el diálogo del navegador, también se le dice cómo activarlas (CA2).
      if (nuevoEstado === "denied") setRecienBloqueadas(true);
    } finally {
      setOcupado(false); // siempre se libera el botón, aunque algo falle
    }
  }

  function bloquear() {
    gestorNotificaciones.bloquear();
    setPreferencia(GestorNotificaciones.PREFERENCIA_BLOQUEADAS);
    setRecienBloqueadas(true);
  }

  async function probar() {
    setOcupado(true);
    try {
      const enviada = await gestorNotificaciones.enviarNotificacionPrueba();
      setMensaje(enviada ? "Notificación de prueba enviada." : "No se pudo enviar la notificación de prueba.");
    } finally {
      setOcupado(false);
    }
  }

  if (estadoPermiso === null) return null;

  // ---------- Solicitud en el mapa: solo si nunca respondió (CA3) ----------
  if (modo === "invitacion") {
    if (recienBloqueadas) {
      return (
        <div className="aviso-flotante" role="status">
          {/* CA2: se le indica cómo activarlas desde la configuración del navegador. */}
          <p>Sin notificaciones. Puedes activarlas en Perfil o en la configuración de tu navegador.</p>
          <button type="button" className="boton-texto" onClick={() => setRecienBloqueadas(false)}>
            Entendido
          </button>
        </div>
      );
    }
    if (!gestorNotificaciones.debeMostrarSolicitud()) return null; // CA3 (la regla vive en el gestor)
    return (
      <div className="aviso-flotante" role="dialog" aria-label="Activar las notificaciones">
        <p>Notificaciones del Radar</p>
        <button type="button" className="boton-texto" onClick={bloquear}>
          Bloquear
        </button>
        <button type="button" className="boton-principal" onClick={activar} disabled={ocupado}>
          {ocupado ? "Activando…" : "Permitir"}
        </button>
      </div>
    );
  }

  // ---------- En el perfil: un interruptor (D-007 v2) ----------
  // Encendido = el navegador dio permiso y el usuario no las bloqueó en el Radar.
  const encendidas = estadoPermiso === "granted" && preferencia !== GestorNotificaciones.PREFERENCIA_BLOQUEADAS;

  function cambiar(evento) {
    if (!evento.target.checked) return bloquear(); // apagar: «Bloquear» del Radar (CA2)
    if (estadoPermiso === "granted") {
      gestorNotificaciones.guardarPreferencia(GestorNotificaciones.PREFERENCIA_ACTIVADAS);
      setPreferencia(GestorNotificaciones.PREFERENCIA_ACTIVADAS);
      return;
    }
    activar(); // pide el permiso al navegador y manda la prueba (CA1)
  }

  return (
    <section className="tarjeta-grande" aria-labelledby="titulo-notificaciones">
      <label className="fila">
        <span id="titulo-notificaciones" className="nombre-puesto">
          Notificaciones
        </span>
        <input
          type="checkbox"
          role="switch"
          className="conmutador"
          checked={encendidas}
          onChange={cambiar}
          disabled={ocupado || estadoPermiso === "unsupported" || estadoPermiso === "denied"}
        />
      </label>

      {estadoPermiso === "unsupported" && <span className="suave">Este navegador no las permite.</span>}
      {estadoPermiso === "denied" && (
        <span className="suave">Bloqueadas en el navegador. Permítelas en su configuración.</span>
      )}
      {encendidas && (
        <button
          type="button"
          className="boton-texto"
          style={{ alignSelf: "flex-start" }}
          onClick={probar}
          disabled={ocupado}
        >
          {ocupado ? "Enviando…" : "Enviar una de prueba"}
        </button>
      )}
      {/* Sin verde: en el Radar el verde solo significa «hay puesto». */}
      <span className="suave" role="status">
        {mensaje}
      </span>
    </section>
  );
}
