'use client';

import { useState, useEffect } from 'react';
import { 
  pedirPermisoNotificaciones, 
  obtenerEstadoNotificaciones, 
  enviarNotificacionPrueba 
} from '@/lib/notificaciones/gestorNotificaciones';

export default function BotonNotificaciones() {
  const [estadoPermiso, setEstadoPermiso] = useState('default');

  useEffect(() => {
    setEstadoPermiso(obtenerEstadoNotificaciones());
  }, []);

  const manejarSolicitud = async () => {
    const nuevoEstado = await pedirPermisoNotificaciones();
    setEstadoPermiso(nuevoEstado);
  };

  const manejarNotificacionPrueba = async () => {
    await enviarNotificacionPrueba();
  };

  if (estadoPermiso === 'unsupported') {
    return <p className="text-sm text-gray-500">Las notificaciones no están soportadas en este navegador.</p>;
  }

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg max-w-sm my-4 bg-white shadow-sm">
      <h3 className="font-bold text-lg">Notificaciones del Campus</h3>
      
      {estadoPermiso === 'default' && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Activa las notificaciones para enterarte de disponibilidad y emergencias.
          </p>
          <button 
            onClick={manejarSolicitud}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Activar Notificaciones
          </button>
        </div>
      )}

      {estadoPermiso === 'granted' && (
        <div>
          <p className="text-sm text-green-600 font-medium mb-2">
            ✓ Las notificaciones están activadas
          </p>
          <button 
            onClick={manejarNotificacionPrueba}
            className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-300"
          >
            Probar Notificación
          </button>
        </div>
      )}

      {estadoPermiso === 'denied' && (
        <p className="text-sm text-red-500">
          Bloqueaste las notificaciones. Si deseas activarlas, debes cambiar los permisos en los ajustes de tu navegador.
        </p>
      )}
    </div>
  );
}