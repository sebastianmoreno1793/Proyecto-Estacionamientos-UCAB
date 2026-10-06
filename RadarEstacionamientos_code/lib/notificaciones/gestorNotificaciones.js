/*
 * Registra el Service Worker en el navegador.
 *
 * @async
 * @function registrarServiceWorker
 * @returns {Promise<ServiceWorkerRegistration|null>} Devuelve el objeto de registro si tiene éxito, o `null` si falla o no es soportado.
 */
export async function registrarServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registro = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registrado con éxito:', registro.scope);
    return registro;
  } catch (error) {
    console.error('Error al registrar el Service Worker:', error);
    return null;
  }
}

/*
 * Solicita permiso al usuario para enviar notificaciones web.
 * Si el permiso es concedido, registra el Service Worker y envía una notificación de prueba.
 * Guarda la preferencia del usuario en localStorage.
 *
 * @async
 * @function pedirPermisoNotificaciones
 * @returns {Promise<NotificationPermission|'unsupported'>} Estado del permiso ('granted', 'denied', 'default') o 'unsupported' si la API no está disponible.
 */
export async function pedirPermisoNotificaciones() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    alert('Este navegador no soporta notificaciones web.');
    return 'unsupported';
  }

  const permiso = await Notification.requestPermission();
  
  if (permiso === 'granted') {
    localStorage.setItem('notificaciones_preferencia', 'activadas');
    await registrarServiceWorker();
    await enviarNotificacionPrueba();
  } else if (permiso === 'denied') {
    localStorage.setItem('notificaciones_preferencia', 'bloqueadas');
  }

  return permiso;
}
/*
 * Muestra una notificación local de prueba utilizando la API del Service Worker activo.
 *
 * @async
 * @function enviarNotificacionPrueba
 * @returns {Promise<void>}
 */
export async function enviarNotificacionPrueba() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  const registro = await navigator.serviceWorker.ready;
  
  if (registro && Notification.permission === 'granted') {
    registro.showNotification('Radar UCAB 🚗', {
      body: '¡Notificaciones configuradas correctamente! Te avisaremos cuando haya puestos disponibles.',
      icon: '/favicon.ico',
      data: { url: '/' }
    });
  }
}

/*
 * Obtiene el estado actual de los permisos de notificación del navegador.
 *
 * @function obtenerEstadoNotificaciones
 * @returns {NotificationPermission|'unsupported'} Estado del permiso ('granted', 'denied', 'default') o 'unsupported' si no es compatible.
 */
export function obtenerEstadoNotificaciones() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}