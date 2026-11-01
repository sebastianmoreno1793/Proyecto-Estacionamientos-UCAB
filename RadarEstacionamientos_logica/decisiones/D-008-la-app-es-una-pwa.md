# D-008 — ⭐ El Radar es una PWA instalable (obligatoria para todo el equipo)

**Estado:** 🟢 Tomada
**Fecha:** 27/oct/26
**Decide:** Sebastian Moreno

> **Para el equipo:** ninguna funcionalidad puede romper la instalación, el arranque sin red ni
> el aviso de versión nueva. Hay **un solo service worker**: `public/sw.js`. Nadie registra
> otro; si tu HU necesita algo del service worker (por ejemplo, las notificaciones de la HU 8.1),
> se agrega a ese archivo.

## Contexto

El Brief dice que el acceso es **solo por navegador web, sin app móvil** (restricción). El
conductor lo abre desde el celular. Una **PWA** respeta la restricción, porque sigue siendo una
página web, y se instala en la pantalla de inicio como una app: abre a pantalla completa, con
ícono propio y sin barra del navegador. Además, es lo que necesitan las notificaciones de la
HU 8.1.

Sebastian ya hizo dos PWA (Thinkdy y Te Cambio) con el mismo patrón: el service worker nuevo
**espera** a que el usuario pulse «Actualizar».

## Decisión

1. **Manifest** (`app/manifest.js`): nombre «Radar de Estacionamientos UCAB», nombre corto
   «Radar UCAB», `display: standalone`, `lang: es`, color de tema Azul Carnet `#12315c` e íconos
   de 192 y 512 px, más uno *maskable*. Ícono para iPhone (`apple-icon`) de 180 px.
2. **Service worker único** (`public/sw.js`):
   - **App shell** en caché: la app abre sin red y muestra la página «Sin conexión» si una
     página no está guardada.
   - **Los datos en vivo nunca salen de la caché:** `/api/*` va siempre a la red. Si no hay red,
     el mapa dice «Sin conexión» y no muestra cifras viejas como si fueran actuales
     (tolerancia a fallos, RNF 3).
   - **Actualización con aviso:** la versión nueva espera hasta que el usuario pulse
     «Actualizar».
   - Incluye los manejadores `push` y `notificationclick` de la HU 8.1.
3. **Se instala desde el navegador:** «Agregar a pantalla de inicio» en iPhone y «Instalar app»
   en Android y Chrome. No hay tienda de aplicaciones.
4. **Se prueba en el teléfono** (el navegador integrado de las herramientas no registra service
   workers): Lighthouse → PWA sin fallas, y prueba en modo avión.

## Por qué

- Cumple la restricción del Brief («solo navegador web») y aun así se siente como una app.
- Habilita las notificaciones (HU 8.1) y el arranque rápido desde la caché.
- Es el mismo patrón de Thinkdy y Te Cambio: ya está probado.

## Consecuencias

- El PR #45 (HU 8.1) trae su propio `public/sw.js`: al actualizarse sobre `main`, debe
  **quitar su archivo** y usar el de esta decisión, que ya trae sus manejadores. Sus íconos
  pasan a ser `/icono-192.png`.
- Despliegue con HTTPS (Vercel), porque un service worker no funciona sin HTTPS, salvo en
  `localhost`.

## Cuándo revisarla

Si la profesora pide una app nativa (rompería la restricción del Brief) o si el despliegue no
puede dar HTTPS.
