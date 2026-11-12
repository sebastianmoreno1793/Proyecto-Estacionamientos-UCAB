// @HU-8.1 Activar las notificaciones · Manuel — Service worker: muestra la notificación de prueba
// Service worker ÚNICO del Radar (D-008). Nadie registra otro: si una HU necesita algo del
// service worker, se agrega aquí.
//
//  - App shell en caché: las páginas ya visitadas abren sin red.
//  - /api/* va SIEMPRE a la red: los datos en vivo nunca salen de la caché (RNF tolerancia a fallos).
//  - La versión nueva espera a que el usuario pulse «Actualizar» (mensaje "ACTUALIZAR").
//  - Notificaciones (HU 8.1): la notificación de prueba la muestra el navegador con
//    `registration.showNotification` (front/notificaciones_del_navegador/Notificacion.js). El envío de
//    notificaciones reales (push) queda fuera del alcance de la HU 8.1.
//
// Al cambiar este archivo, sube VERSION para que los teléfonos reciban la versión nueva.

const VERSION = "radar-v7";
const CACHE_SHELL = `${VERSION}-shell`;
const CACHE_ESTATICOS = `${VERSION}-estaticos`;
// Páginas con datos personales (placas, correos, incidencias): nunca se guardan en el teléfono,
// así no quedan a la vista de otra persona después de «Salir».
const PRIVADAS = ["/admin", "/perfil", "/reportar", "/sugerencia"];
// «/» y «/mapa» no van aquí: sin sesión llegarían como redirección a /entrar. Se guardan al visitarlos.
const SHELL = ["/manifest.webmanifest", "/icono-192.png", "/icono-512.png", "/maqueta/campus.jpg"];

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
  if (url.origin !== self.location.origin) return; // otros sitios: siempre a la red
  if (url.pathname.startsWith("/api/")) return; // datos en vivo: nunca de la caché
  // Datos que pide Next al navegar con <Link> (encabezado RSC): siempre a la red, si no se verían viejos.
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;
  if (PRIVADAS.some((ruta) => url.pathname.startsWith(ruta))) return;

  // Páginas: primero la red (para ver lo último); sin red, la copia guardada si la hay.
  if (request.mode === "navigate") {
    evento.respondWith(
      // @FETCH Todas › páginas (service worker) — pide la página a internet; sin conexión muestra la copia guardada
      fetch(request)
        .then((respuesta) => {
          // No se guarda una redirección (p. ej. a /entrar): servirla sin red daría error.
          if (respuesta.ok && respuesta.type === "basic" && !respuesta.redirected) {
            const copia = respuesta.clone();
            caches.open(CACHE_SHELL).then((cache) => cache.put(request, copia));
          }
          return respuesta;
        })
        .catch(async () => (await caches.match(request)) ?? Response.error()),
    );
    return;
  }

  // Archivos de Next con hash en el nombre: no cambian nunca, primero la caché.
  if (url.pathname.startsWith("/_next/static/")) {
    evento.respondWith(
      caches.match(request).then(
        (guardada) =>
          guardada ??
          // @FETCH Todas › archivos de la app (service worker) — usa la copia guardada y, si no la hay, la pide a internet
          fetch(request).then((respuesta) => {
            if (!respuesta.ok) return respuesta; // un 404 no se guarda
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
      // @FETCH Todas › íconos e imágenes (service worker) — muestra la copia guardada y la actualiza por detrás
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
