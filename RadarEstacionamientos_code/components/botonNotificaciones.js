'use client';

import { useState, useEffect } from 'react';
import { gestorNotificaciones } from '@/lib/notificaciones/gestorNotificaciones';
import styles from './BotonNotificaciones.module.css';

export default function BotonNotificaciones() {
  const [estadoPermiso, setEstadoPermiso] = useState('default');
  const [abierto, setAbierto] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    setEstadoPermiso(gestorNotificaciones.obtenerEstadoPermiso());
  }, []);

  const manejarSolicitud = async () => {
    setOcupado(true);
    setMensaje('');
    try {
    const nuevoEstado = await gestorNotificaciones.pedirPermiso();
    setEstadoPermiso(nuevoEstado);

    if (nuevoEstado === 'denied') {
        setMensaje('El navegador bloqueó las notificaciones. Puedes permitirlas en sus ajustes y volver a comprobarlo desde este menú.');
      } else if (nuevoEstado === 'default') {
        setMensaje('No se activaron las notificaciones. Puedes intentarlo de nuevo desde este menú cuando quieras.');
      } else if (nuevoEstado === 'unsupported') {
        setMensaje('Este navegador no soporta notificaciones web.');
      } else {
        setMensaje('Notificaciones activadas.');
      }
    } catch (error) {
      const permisoActual = gestorNotificaciones.obtenerEstadoPermiso();
      const detalle = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      setEstadoPermiso(permisoActual);
      setMensaje(
        permisoActual === 'granted'
          ? `El permiso está concedido, pero no se pudo activar el servicio de notificaciones. ${detalle}`
          : `No se pudo solicitar el permiso de notificaciones. ${detalle}`,
      );
      console.error('Error al activar las notificaciones:', error);
    } finally {
      setOcupado(false);
    }
  };

  const manejarNotificacionPrueba = async () => {
    setOcupado(true);
    setMensaje('');
    try {
      await gestorNotificaciones.registrarServiceWorker();
    await gestorNotificaciones.enviarNotificacionPrueba();
      setMensaje('Notificación de prueba enviada.');
      } catch (error) {
        const detalle = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
        setMensaje(`No se pudo enviar la notificación de prueba. ${detalle}`);
        console.error('Error al enviar la notificación de prueba:', error);
      } finally {
        setOcupado(false);
      }
    };
    
  const revisarPermiso = () => {
    const nuevoEstado = gestorNotificaciones.obtenerEstadoPermiso();
    setEstadoPermiso(nuevoEstado);
    setMensaje(
      nuevoEstado === 'granted'
        ? 'El permiso está activado. Ya puedes recibir notificaciones.'
        : nuevoEstado === 'default'
          ? 'Puedes activar las notificaciones ahora desde este menú.'
          : '',
    );
  };

  return (
    <div className={styles.contenedor}>
      <section
        className={styles.menu}
        id="menu-notificaciones"
        aria-labelledby="titulo-notificaciones"
        hidden={!abierto}
      >
        <h2 className={styles.titulo} id="titulo-notificaciones">
          Notificaciones del Campus
        </h2>

        {estadoPermiso === 'unsupported' && (
          <p className={styles.ayuda}>
            Este navegador no soporta notificaciones web.
          </p>
        )}

        {estadoPermiso === 'default' && (
          <div className={styles.opciones}>
            <p className={styles.ayuda}>
              Actívalas para enterarte de la disponibilidad y de novedades del campus.
              Si lo dejas para después, puedes volver a este menú para habilitarlas.     
            </p>
          <button 
className={styles.accion}
              type="button"
              onClick={manejarSolicitud}
              disabled={ocupado}
            >
              {ocupado ? 'Activando…' : 'Activar notificaciones'}
            </button>
          </div>
        )}

        {estadoPermiso === 'granted' && (
          <div className={styles.opciones}>
            <p className={styles.estadoActivo}>Las notificaciones están activadas.</p>
            <button
              className={styles.accionSecundaria}
              type="button"
              onClick={manejarNotificacionPrueba}
              disabled={ocupado}
            >
              {ocupado ? 'Enviando…' : 'Probar notificación'}
            </button>
          </div>
        )}

        {estadoPermiso === 'denied' && (
          <div className={styles.opciones}>
            <p className={styles.ayuda}>
              El navegador bloqueó las notificaciones. Para volver a activarlas, permite
              las notificaciones de este sitio en los ajustes del navegador y luego
              comprueba el permiso aquí.
            </p>
            <button
              className={styles.accionSecundaria}
              type="button"
              onClick={revisarPermiso}
            >
              Volver a comprobar
            </button>
          </div>
        )}

        {mensaje && (
          <p className={styles.mensaje} role="status" aria-live="polite">
            {mensaje}
          </p>
        )}
      </section>

      <button
        className={styles.disparador}
        type="button"
        aria-expanded={abierto}
        aria-controls="menu-notificaciones"
        onClick={() => setAbierto(!abierto)}
      >
        <svg
          className={styles.icono}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Notificaciones</span>
      </button>
    </div>
  );
}
