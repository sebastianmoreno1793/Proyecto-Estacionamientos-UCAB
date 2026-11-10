# front · pantallas

La app que ve el usuario (Next.js). Pide los datos al back de dos maneras:

1. **Desde el navegador, con `fetch`** a `/api/...` (Inicio, sugerencia, mapa en vivo). Es lo mismo
   que hace Postman. Busca `[fetch]` en VS Code.
2. **Desde un formulario, con una acción del servidor** (`acciones/`), que llama directo a
   `back/logica`. Busca `[accion]`.

| Carpeta | Qué tiene | Simulador |
|---|---|---|
| `app/` | Solo las rutas: un `page.js` por pantalla (el nombre de la carpeta es la URL), `layout.js` y `api/` | ✅ `app/api/` (las URL que llama) |
| `componentes/` | Las piezas de cada pantalla, agrupadas por pantalla | — |
| `acciones/` | Lo que los formularios le piden al back (crear cuenta, reportar, guardar…) | — |
| `notificaciones/` | HU 8.1: notificaciones del navegador | — |
| `servidor/` | La cookie de sesión (poner, leer, borrar) | — |
| `estilos/` | CSS de toda la app (D-007, ver `DESIGN.md`) | — |
| `public/` | Íconos, la imagen de la maqueta y el service worker (`sw.js`) | ✅ `maqueta/campus.jpg` sale del simulador |
| `pruebas/` | Pruebas de las notificaciones | — |

`app/` y `public/` llevan ese nombre porque Next lo exige.
