# front · lo que ve el usuario

Las pantallas de la app (Next.js). Le piden los datos al back de dos maneras:

1. **El navegador los pide con `fetch`** a una dirección `/api/...` (Inicio, sugerencia, mapa en
   vivo). Es lo mismo que hace Postman. En VS Code: ⌘⌥H y escribe `fetch`.
2. **Al enviar un formulario** (`envio_de_formularios/`): el servidor recibe lo que escribió el
   usuario y llama directo a `back/reglas_y_datos`. Busca `[accion]`.

| Carpeta | Qué tiene | Simulador |
|---|---|---|
| `app/` | Una carpeta por pantalla: el nombre de la carpeta es la dirección (`app/mapa/` es `/mapa`) y adentro está su `page.js`. `app/api/` conecta cada dirección `/api/...` con el back | ✅ `app/api/` (las direcciones que llama) |
| `partes_de_pantallas/` | Los pedazos que forman cada pantalla: el mapa, la tarjeta, los formularios, las pestañas | — |
| `envio_de_formularios/` | Lo que pasa al tocar «Enviar», «Guardar» o «Entrar» (crear cuenta, reportar, agregar vehículo…) | — |
| `notificaciones_del_navegador/` | Pedir permiso para avisar y mostrar la notificación de prueba (HU 8.1) | — |
| `sesion_del_usuario/` | Saber quién está conectado: guarda, lee y borra la cookie de la sesión | — |
| `estilos/` | Colores, letras y formas de toda la app (ver `DESIGN.md`) | — |
| `public/` | Íconos, la imagen del campus y el archivo que deja usar la app sin internet (`sw.js`) | ✅ `maqueta/campus.jpg` sale del simulador |
| `pruebas_automaticas/` | Revisan solas que las notificaciones funcionen (`npm test`) | — |

`app/` y `public/` llevan ese nombre porque Next lo exige.

¿Dónde está una pantalla? ⌘⌥H y escribe `pantalla` (o `pantalla login`, `pantalla mapa`…).
