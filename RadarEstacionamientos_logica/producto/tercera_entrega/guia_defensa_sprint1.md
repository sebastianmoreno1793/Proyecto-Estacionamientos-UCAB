# Guía para la defensa del Sprint 1 (Tercera Entrega)

**Fecha:** jueves 12/nov/26 · Equipo 87 3 · 9 puntos, nota individual.

La profesora va a revisar tres cosas: (1) que el programa ejecute **todas** las HU del sprint,
(2) que cada uno sepa **cómo** el código ejecuta su HU, y (3) **por qué** los archivos están
organizados así. Si alguien está perdido, se penaliza al equipo. Cada integrante debe poder
contar el camino de su HU sin leer: pantalla → acción o API → reglas → datos → prueba.

## 0. Antes de entrar

1. En VS Code: abrir la carpeta del repo, abrir cualquier `.js` y **Run Code** (o F5). Arranca la
   app (http://localhost:3000) y el simulador 3D (http://localhost:3001), y se abre el navegador.
2. Revisar que en `front/.env.local` esté `SALTAR_INICIO_DE_SESION=` **vacío**. Si vale `1`, se
   entra sin cuenta y no se puede mostrar la HU 1.1.
3. Pruebas en vivo (impresionan y demuestran los criterios):
   `cd RadarEstacionamientos_code && npm test` → back 137/137 y front 13/13.
4. Cuentas de prueba (solo en desarrollo):

   | Rol | Correo | Contraseña | Qué ve |
   |---|---|---|---|
   | Administrador | `admin.prueba@ucab.edu.ve` | `123456789` | Todo, más «Administrar» en Perfil (puestos, incidencias, garita, edificios) |
   | Estudiante | `estudiante.prueba@est.ucab.edu.ve` | `123456789` | Inicio, Mapa, Reportar y Perfil |
   | Profesor | `profesor.prueba@ucab.edu.ve` | `123456789` | Lo mismo que el estudiante, con rol Profesor |

   Entra con el administrador
   en la app **antes** de usar el simulador, en el mismo navegador: el simulador usa esa sesión para
   reportar incidencias, cerrar estacionamientos y reiniciar. Los avisos de los sensores y las placas
   no necesitan sesión, porque van con la clave de los sensores.
5. Los datos viven en memoria: al apagar el servidor se borran las cuentas creadas.

## 1. Por qué está organizado así (respuesta corta)

> «Separamos **front** (lo que ve la persona) de **back** (reglas y datos), para que cada parte
> se pueda explicar y probar sola. En el back, cada tema tiene dos archivos: `reglas.js`, que
> valida y calcula sin guardar nada, y `datos.js`, que guarda y lee. Así las reglas de las HU
> se prueban con `node --test` sin abrir el navegador. La API tiene un archivo por endpoint,
> que es la misma puerta que usan los sensores, Postman y el simulador (D-002). El simulador
> está aparte porque no es parte del producto (D-006).»

| Carpeta | Qué va | Ejemplo |
|---|---|---|
| `front/app/` | Solo las rutas: una carpeta por pantalla | `app/mapa/page.js` |
| `front/componentes/<pantalla>/` | Lo que se ve, agrupado por pantalla | `componentes/mapa/MaquetaCampus.js` |
| `front/acciones/` | Formularios: reciben lo escrito y llaman al back | `acciones/cuenta.js` |
| `front/notificaciones/` | Lógica de notificaciones del navegador (HU 8.1) | `GestorNotificaciones.js` |
| `back/api/` | Un archivo por endpoint: permisos y código HTTP | `api/avisos.js` |
| `back/logica/<tema>/` | `reglas.js` (puro) + `datos.js` (guarda) | `logica/estacionamientos/` |
| `back/comun/` | Almacén en memoria y canal en vivo | `comun/almacen.js` |
| `back/seguridad/` | Sesión (cookie) y clave de los sensores | `seguridad/sesion.js` |
| `back/campus/` | Datos fijos del campus (estacionamientos, edificios) | `campus/estacionamientos.js` |
| `back/pruebas/` | Una prueba por tema y una por criterio de aceptación | `pruebas/criterios_sprint1.test.js` |

Preguntas difíciles que pueden salir y qué contestar:
- **«¿Por qué por tema y no por HU?»** Porque varias HU comparten los mismos datos: 3.1, 4.1, 4.2 y
  5.4 trabajan sobre los estacionamientos. Si se separaran por HU, la regla de los puestos libres
  quedaría repetida. Cada archivo dice en su primer comentario qué HU atiende.
- **«¿Por qué los formularios no pasan por la API?»** Las acciones de servidor de Next ya corren en
  el servidor y llaman directo a `back/logica`. La API existe para quien está **fuera** de la app:
  sensores, Postman y el simulador. Las dos usan las mismas reglas.
- **«¿Dónde está la base de datos?»** Todavía no se decide (está en `preguntas_abiertas.md`). Por
  ahora todo vive en memoria, en `comun/almacen.js`. Cambiarla solo toca los `datos.js`.
- **«¿Qué es el canal en vivo?»** `GET /api/eventos` le avisa al mapa y al Inicio cuando entra un
  carro, para que las cifras de la HU 4.2 cambien sin recargar (RNF de tiempo real). La HU 4.3
  completa es del siguiente sprint.

## 2. Camino de cada HU

| HU | Responsable | Pantalla | Camino en el código | Pruebas |
|---|---|---|---|---|
| 1.1 Crear cuenta | Samuel | `/registro` | `componentes/cuenta/FormularioCuenta.js` → `acciones/cuenta.js` (`crearCuenta`) → `logica/usuarios/reglas.js` (`validarRegistro`, `esCorreoUcab`, `rolSegunCorreo`) → `usuarios/datos.js` (`registrarUsuario`, contraseña con scrypt) → `crearSesion` y cookie → redirige a `/mapa` | `usuarios.test.js`, `criterios_sprint1.test.js` |
| 2.1 Mis vehículos | Samuel | `/perfil` | `componentes/perfil/FormularioVehiculo.js` → `acciones/vehiculos.js` → `logica/vehiculos/reglas.js` (placa) → `vehiculos/datos.js` (`registrarVehiculo`, sin placas repetidas) | `vehiculos.test.js` |
| 3.1 Avisos de entrada y salida | Aaron | `/admin/garita` | Sensor, Postman o simulador → `POST /api/avisos` → `back/api/avisos.js` (clave `x-clave-sensor`) → `estacionamientos/datos.js` (`registrarAviso`: estacionamiento, tipo y hora) | `avisos.test.js`, `api.test.js` |
| 3.2 Simular sensores y placas | Aaron | Simulador :3001 | `RadarEstacionamientos_simulador` → su puente `/api/base/...` → las mismas URL de la app (D-002). Placas: `POST /api/garita/lecturas` → `api/garita.js` → `logica/garita/` | `avisos.test.js`, pruebas del simulador (19) |
| 4.1 Actualizar el aforo | Aaron | Mapa e Inicio | `registrarAviso` → `estacionamientos/reglas.js` (`aplicarMovimiento`: la entrada resta un libre, la salida lo suma; nunca menos de 0 ni más que la capacidad; si no se puede, va a anomalías) → `emitir` del canal en vivo | `criterios_sprint1.test.js` (CA1 a CA5) |
| 4.2 Semáforo | Aaron | Mapa e Inicio | `estacionamientos/reglas.js` (`nivelDelSemaforo`: verde si hay ≥ 1 libre, rojo con 0, gris si está cerrado; D-009) → `MaquetaCampus.js` y `Inicio.js` | `semaforo.test.js` |
| 5.1 Mapa del campus | German | `/mapa` | `app/mapa/page.js` (pide sesión) → `MaquetaCampus.js`: `fetch /api/estacionamientos` + canal en vivo; polígonos sobre la imagen; borde punteado = solo profesores; error con «Reintentar» y «Salir». Los nombres salen en la lista lateral y en las píldoras al acercar | `criterios_sprint1.test.js` |
| 5.4 Capacidad y estado | German | `/admin/puestos` | `componentes/admin/FilaPuesto.js` → `acciones/puestos.js` (solo administrador) → `estacionamientos/reglas.js` (`validarCapacidad`) → `datos.js` (`cambiarEstacionamiento`). También por `PATCH /api/estacionamientos/:id` (403 si no es administrador) | `capacidad.test.js`, `api.test.js` |
| 6.1 Catálogo de edificios | German | `/admin/edificios` | `componentes/admin/` → `acciones/edificios.js` → `logica/edificios/reglas.js` → `edificios/datos.js` (agregar, modificar, quitar). La lista la usan Inicio y `/sugerencia` | `edificios.test.js` |
| 7.2 Sugerencia | Manuel | Inicio (chips) y `/sugerencia` | `Inicio.js` → `fetch /api/sugerencia?edificio=` → `api/sugerencia.js` → `logica/sugerencia/datos.js` → `reglas.js` (el abierto con libres más cercano por distancia; sin los de solo profesores) | `sugerencia.test.js`, `api.test.js` |
| 8.1 Notificaciones | Manuel | Inicio, Mapa y Perfil | `componentes/notificaciones/Notificaciones.js` → `front/notificaciones/GestorNotificaciones.js` (`debeMostrarSolicitud`: paso 2.2 · `pedirPermiso` + una prueba: CA1 · `bloquear`: CA2 · interruptor de Perfil: CA3) → el único service worker `public/sw.js` (D-008) | `front/pruebas/notificaciones.test.js` |
| 9.1 Crear una incidencia | Sebastián | `/reportar` | `componentes/reportar/FormularioIncidencia.js` → `acciones/incidencias.js` → `logica/incidencias/reglas.js` (falta algo o está cerrado → mensaje) → `datos.js` (`registrarIncidencia`: fecha, hora, «pendiente», sin mostrar el correo). Confirmación con estacionamiento, tipo, hora y estado. «Cancelar» vuelve al mapa | `incidencias.test.js`, `criterios_sprint1.test.js`, `api.test.js` |

## 3. Demo sugerida (5 minutos)

1. `/registro` con un correo `@gmail.com` → mensaje (1.1 CA2). Con uno `@est.ucab.edu.ve` → mapa (1.1 CA1, 5.1).
2. En el simulador, entrar varios carros a un estacionamiento → el número y el color cambian en el mapa (3.2, 3.1, 4.1, 4.2).
3. Llenarlo hasta 0 → rojo (4.2). En `/admin/puestos`, cerrarlo → gris y deja de sugerirse (5.4, 7.2).
4. Inicio: tocar un edificio → «Más cerca» (7.2). Crear un edificio en `/admin/edificios` (6.1).
5. Perfil: agregar un vehículo (2.1) y el interruptor de notificaciones (8.1).
6. Reportar: enviar vacío → mensaje (9.1 CA2); completo → confirmación «Pendiente» (9.1 CA1).
7. `npm test` en la terminal.

## 4. Lo que el código hace de más (tenerlo explicado)

- 4.1: ignora avisos repetidos con el mismo `idAviso` (protege el aforo si un sensor reenvía).
- 5.1: la tarjeta de detalle del estacionamiento adelanta parte de la HU 5.3.
- 9.1: `/admin/incidencias` adelanta el listado de la HU 9.3.
- Canal en vivo `/api/eventos`: es la base de la HU 4.3 y del requisito de tiempo real.

## 5. Lo que el equipo debe completar en Trello (no se cambió desde aquí)

- **HU 2.1**: no tiene Conversación ni criterios de aceptación. Escribir 3 CA (placa válida y única, se
  ven solo los vehículos propios, pide sesión), que ya se cumplen en el código.
- **HU 8.1 CA2**: dice «la campana». En el programa es el **interruptor de Perfil**; cambiar la palabra.
- HU 3.1, 3.2, 4.2, 5.4, 6.1 y 7.2: solo tienen un criterio resumido. Conviene escribir 2 o 3 en
  Dado / Cuando / Entonces.
- La 7.2 no dice que se excluyen los de solo profesores; la 4.1 no dice qué pasa con un estacionamiento cerrado.
