// Service worker ÚNICO del Radar (D-008). Nadie registra otro: si una HU necesita algo del
// service worker, se agrega aquí.
//
//  - App shell en caché: la app abre sin red; si una página no está guardada, «Sin conexión».
//  - /api/* va SIEMPRE a la red: los datos en vivo nunca salen de la caché (RNF tolerancia a fallos).
//  - La versión nueva espera a que el usuario pulse «Actualizar» (mensaje "ACTUALIZAR").
//  - Notificaciones (HU 8.1): manejadores `push` y `notificationclick`.
//
// Al cambiar este archivo, sube VERSION para que los teléfonos reciban la versión nueva.

const VERSION = "radar-v4";
const CACHE_SHELL = `${VERSION}-shell`;
const CACHE_ESTATICOS = `${VERSION}-estaticos`;
const SIN_CONEXION = "/sin-conexion";
// Páginas con datos personales (placas, correos, incidencias): nunca se guardan en el teléfono,
// así no quedan a la vista de otra persona después de «Salir».
const PRIVADAS = ["/admin", "/vehiculos", "/incidencias", "/cuenta", "/sugerencia"];
const SHELL = ["/", "/mapa", SIN_CONEXION, "/manifest.webmanifest", "/icono-192.png", "/icono-512.png", "/maqueta/campus.jpg"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE_SHELL).then((cache) => cache.addAll(SHELL)));
  // No hay skipWaiting aquí: la versión nueva espera a que el usuario pulse «Actualizar».
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((c) => !c.startsWith(VERSION)).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (evento) => {
  if (evento.data?.tipo === "ACTUALIZAR") self.skipWaiting();
});

self.addEventListener("fetch", (evento) => {
  const { request } = evento;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // mapas de OpenStreetMap: siempre a la red
  if (url.pathname.startsWith("/api/")) return; // datos en vivo: nunca de la caché
  // Datos que pide Next al navegar con <Link> (encabezado RSC): siempre a la red, si no se verían viejos.
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;
  if (PRIVADAS.some((ruta) => url.pathname.startsWith(ruta))) return;

  // Páginas: primero la red (para ver lo último); sin red, la copia guardada o «Sin conexión».
  if (request.mode === "navigate") {
    evento.respondWith(
      fetch(request)
        .then((respuesta) => {
          if (respuesta.ok && respuesta.type === "basic") {
            const copia = respuesta.clone();
            caches.open(CACHE_SHELL).then((cache) => cache.put(request, copia));
          }
          return respuesta;
        })
        .catch(async () => (await caches.match(request)) ?? (await caches.match(SIN_CONEXION))),
    );
    return;
  }

  // Archivos de Next con hash en el nombre: no cambian nunca, primero la caché.
  if (url.pathname.startsWith("/_next/static/")) {
    evento.respondWith(
      caches.match(request).then(
        (guardada) =>
          guardada ??
          fetch(request).then((respuesta) => {
            const copia = respuesta.clone();
            caches.open(CACHE_ESTATICOS).then((cache) => cache.put(request, copia));
            return respuesta;
          }),
      ),
    );
    return;
  }

  // Íconos e imágenes propias: la guardada al instante y se actualiza por detrás.
  evento.respondWith(
    caches.match(request).then((guardada) => {
      const deRed = fetch(request)
        .then((respuesta) => {
          if (respuesta.ok) {
            const copia = respuesta.clone();
            caches.open(CACHE_ESTATICOS).then((cache) => cache.put(request, copia));
          }
          return respuesta;
        })
        .catch(() => guardada);
      return guardada ?? deRed;
    }),
  );
});

// ---------- Notificaciones (HU 8.1, Manuel Rosales) ----------

self.addEventListener("push", (evento) => {
  // Mismos nombres que lib/notificaciones/Notificacion.js (titulo, cuerpo, url). Acepta texto plano.
  let datos = {};
  try {
    datos = evento.data ? evento.data.json() : {};
  } catch {
    datos = { cuerpo: evento.data?.text() };
  }
  evento.waitUntil(
    self.registration.showNotification(datos.titulo || "Radar UCAB", {
      body: datos.cuerpo || datos.mensaje || "Hay novedades en los estacionamientos.",
      icon: "/icono-192.png",
      badge: "/icono-192.png",
      data: { url: datos.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (evento) => {
  evento.notification.close();
  const destino = new URL(evento.notification.data?.url || "/", self.location.origin).href;
  evento.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ventanas) => {
      const abierta = ventanas.find((v) => v.url === destino && "focus" in v);
      if (abierta) return abierta.focus();
      return self.clients.openWindow ? self.clients.openWindow(destino) : undefined;
    }),
  );
});
