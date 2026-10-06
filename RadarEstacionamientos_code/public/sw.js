// Escuchar el evento 'push' desde el servidor o evento local
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const titulo = data.titulo || 'Radar UCAB 🚗';
  const opciones = {
    body: data.mensaje || 'Nueva actualización sobre el estacionamiento.',
    icon: '/icon-192.png', // asegúrate de tener un icono en public/
    badge: '/badge.png',
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(titulo, opciones)
  );
});

// Escuchar el clic sobre la notificación para abrir la web
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlDestino = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Si la página ya está abierta, enfocarse en ella; si no, abrir una ventana nueva
      for (let client of windowClients) {
        if (client.url === urlDestino && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlDestino);
      }
    })
  );
});