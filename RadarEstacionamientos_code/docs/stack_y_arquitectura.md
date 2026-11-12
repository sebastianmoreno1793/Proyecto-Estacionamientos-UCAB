# Stack y arquitectura

**Estado:** 🟡 Vigente con reservas — stack elegido por el equipo; falta decidir la base de datos.

## Elegido

- Aplicación web en JavaScript con **Next.js**, independiente de los sistemas oficiales de la UCAB.
- Repositorio en **GitHub**, despliegue en **Vercel**.
- Herramientas: VS Code. Planificación del sprint en **Trello**.

## Capas del código: front y back (Sprint 1)

El código de la app está separado en dos carpetas, para que cada parte se pueda explicar y
probar por su lado:

| Capa | Carpeta | Qué hace |
|---|---|---|
| Front | `front/app/` | Solo las rutas (una carpeta por pantalla y `api/` que conecta cada URL con el back). |
| Front | `front/partes_de_pantallas/<pantalla>/` | Lo que se ve, agrupado por pantalla (inicio, mapa, perfil, reportar, admin…). |
| Front | `front/envio_de_formularios/` | Los formularios: reciben lo que escribió la persona y llaman al back. |
| Back | `back/pedidos_y_respuestas/` | Un archivo por endpoint: lee la petición, revisa permisos y responde con su código HTTP. |
| Back | `back/reglas_y_datos/<tema>/` | `reglas.js` (validar y calcular, sin guardar) y `datos.js` (guardar y leer). |
| Back | `back/piezas_compartidas/`, `control_de_acceso/`, `datos_del_campus/` | Almacén y canal en vivo; sesión y clave de sensores; datos fijos del campus. |
| Back | `back/pruebas_automaticas/` | Pruebas automáticas (`node --test`), una por tema y una por criterio de aceptación. |

Camino de una petición: pantalla → `fetch /api/...` → `back/pedidos_y_respuestas/<tema>.js` → `reglas_y_datos/<tema>/reglas.js`
y `datos.js`. Los formularios van directo de `front/envio_de_formularios/` a `back/reglas_y_datos/`. El back no
depende de Next, por eso se prueba sin levantar el servidor.

## Dos sistemas (D-006)

- **App del Radar** (`RadarEstacionamientos_code/`, puerto 3000): el producto para la persona.
- **Maqueta 3D del campus** (`RadarEstacionamientos_simulador/`, puerto 3001, Three.js con datos
  de OpenStreetMap y SRTM): le manda a la app las señales de sensores, garita, incidencias y
  administración, solo por su API pública.
- Especificación: `arquitectura_dual_app_y_maqueta.md`.

## Por decidir (ver `../preguntas_abiertas.md`)

- Base de datos.
- ~~Librería de mapa~~ → resuelto (27/oct/26): no hay mapa de calles. La pantalla de inicio es una
  imagen de la maqueta del campus con el semáforo en SVG encima (D-007), sin librerías ni costo.
- ~~Mecanismo de inicio de sesión~~ → resuelto en código (HU 1.1): cuenta con correo UCAB y
  contraseña cifrada, sesión con cookie `radar_sesion` (`back/control_de_acceso/sesion.js`). Se guarda en
  memoria hasta que se decida la base de datos.
- ~~Canal de actualización en vivo del mapa~~ → resuelto en código: `GET /api/eventos` (lo usan la app y la maqueta).
