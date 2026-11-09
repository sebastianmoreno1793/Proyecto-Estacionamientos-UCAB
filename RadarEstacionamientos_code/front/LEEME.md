# front · pantallas

La app que ve el usuario (Next.js). Pide los datos al back de dos maneras:

1. **Desde el navegador, con `fetch`** a `/api/...` (Inicio, sugerencia, mapa en vivo). Es lo
   mismo que hace Postman.
2. **Desde el servidor del front**, con las acciones (`acciones.js`) y las páginas, que llaman
   directo a `back/logica`.

| Carpeta | Qué tiene |
|---|---|
| `app/` | Una carpeta por pantalla (el nombre es la URL) y `api/`, que conecta las URL con el back |
| `componentes/` | Piezas de pantalla que se usan en varias páginas |
| `notificaciones/` | HU 8.1: lógica de las notificaciones del navegador |
| `servidor/` | La cookie de sesión (poner, leer, borrar) |
| `public/` | Íconos, la imagen de la maqueta y el service worker de la PWA (`sw.js`) |
| `pruebas/` | Pruebas de las notificaciones |

`app/` y `public/` llevan ese nombre porque Next lo exige.
