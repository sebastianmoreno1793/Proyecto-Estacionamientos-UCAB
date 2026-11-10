"use client";
// @HU-8.1 Activar las notificaciones · Manuel — invitación y interruptor de Perfil

// HU 8.1 · Activar las notificaciones.
//
// Dos formas de mostrarse:
//  - modo="invitacion" (en Inicio y en el Mapa, al entrar con sesión): la solicitud con «Permitir» y «Bloquear».
//    CA1: «Permitir» → activadas + una notificación de prueba.
//    CA2: «Bloquear» → bloqueadas, sin prueba, y se le dice cómo activarlas después.
//    Paso 2.2 del escenario: si ya respondió, no vuelve a salir en este navegador.
//  - modo="perfil" (en Perfil): un interruptor siempre visible, para activarlas o apagarlas después.
//    CA3: apagarlo deja la preferencia «bloqueadas» y encenderlo (con permiso del navegador) «activadas».
//
// Toda la lógica (permiso del navegador, preferencia guardada, Service Worker) está en
// front/notificaciones/GestorNotificaciones.js; este componente solo muestra el estado.

import { useEffect, useState } from "react";
import { GestorNotificaciones, gestorNotificaciones } from "@/notificaciones/GestorNotificaciones";

// @HU-8.1 Activar las notificaciones · Manuel
// Muestra las notificaciones: como invitación en Inicio y Mapa (app/page.js, app/mapa/page.js) o como interruptor en Perfil. HU 8.1.
export default function Notificaciones({ modo = "perfil" }) {
  // null mientras no sabemos el estado (el servidor no tiene `Notification`).
  const [estadoPermiso, setEstadoPermiso] = useState(null);
  const [preferencia, setPreferencia] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [recienBloqueadas, setRecienBloqueadas] = useState(false);

  // Lee el permiso del navegador y la preferencia guardada; corre una sola vez, al montar.
  useEffect(() => {
    setEstadoPermiso(gestorNotificaciones.obtenerEstadoPermiso());
    setPreferencia(gestorNotificaciones.obtenerPreferencia());
  }, []);

  // Pide permiso al navegador; si lo da, quedan activadas y se manda una notificación de prueba (CA1).
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
    } catch {
      setMensaje("No se pudieron activar. Revisa el permiso del navegador.");
    } finally {
      setOcupado(false); // siempre se libera el botón, aunque algo falle
    }
  }

  // Guarda que el usuario las bloqueó en el Radar y le muestra cómo activarlas después (CA2).
  function bloquear() {
    gestorNotificaciones.bloquear();
    setPreferencia(GestorNotificaciones.PREFERENCIA_BLOQUEADAS);
    setRecienBloqueadas(true);
  }

  // Manda una notificación de prueba desde Perfil y dice si se pudo.
  async function probar() {
    setOcupado(true);
    try {
      const enviada = await gestorNotificaciones.enviarNotificacionPrueba();
      setMensaje(enviada ? "Notificación de prueba enviada." : "No se pudo enviar la notificación de prueba.");
    } catch {
      setMensaje("No se pudo enviar la notificación de prueba.");
    } finally {
      setOcupado(false);
    }
  }

  if (estadoPermiso === null) return null;

  // ---------- Solicitud en Inicio o Mapa: solo si nunca respondió (paso 2.2) ----------
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
    if (!gestorNotificaciones.debeMostrarSolicitud()) return null; // paso 2.2 (la regla vive en el gestor)
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

  // Responde al interruptor de Perfil: apagarlo las bloquea; encenderlo guarda la preferencia o pide permiso. [sesion]
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
