# Revisión del 27/oct/26: lo que hizo el equipo frente a lo que pide la profesora

**Estado:** 🟢 Vigente — foto del 27/oct/26, a una semana de la Segunda Entrega (mar 03/nov).
Fuentes: repositorio de GitHub, tablero de Trello (API pública), Google Doc del Brief y Módulo 7
(ver `../negocio/modulo7/`).

## 1. Resumen

| Tema | Cómo está | Qué pide la profesora | Qué hacer |
|---|---|---|---|
| **Brief** | Aprobado: «OK con el brief» (19/oct), nota 2,1/3. La versión aprobada es el **Google Doc de Samuel del 16–17/oct** | — | ✅ El `.docx` del repo se reemplazó por esa versión (27/oct) |
| **Trazabilidad de nombres** | Samuel renombró en Trello y en el Brief las HU con verbos CRUD (16/oct). El backlog del repo y los **Issues de GitHub** siguen con los nombres viejos | Mismos códigos y nombres en todas partes | Renombrar los Issues (lista en §3). El backlog del repo ya está alineado |
| **Especificación de HU (ERS)** | **Ninguna tarjeta tiene especificación.** Las casillas «Especificar · Criterio 1, 2, 3» están marcadas como hechas en 5.1, 5.4 y 9.1, pero no hay texto | Card + Conversación + Criterios, como actividad de la tarjeta (Plantilla ERS) | Cada uno especifica una HU antes del 03/nov (§4) |
| **Diagramas de actividades** | No hay ninguno | Uno por HU especificada, como imagen o PDF adjunto | Cada uno hace el suyo |
| **RNF** | Los 4 rangos de calidad están en el Brief. No hay RNF redactados | 4 RNF con subcaracterística ISO 25010, medibles y testeables | Una tarjeta nueva «Requisitos No Funcionales» (§4) |
| **Reuniones** | Las tarjetas «Reunión 1, 2 y 3» están **vacías**. La profesora preguntó dos veces si nos íbamos a reunir | Evidencia de que el equipo se reúne | Llenar cada reunión con su minuta y agendar las que vienen (§5) |
| **Código** | Fusionado en `main`: HU 5.1 (German), 5.4 y 9.1 (Sebastian). Abiertos sin revisar desde el 05–06/oct: PR #44 HU 6.1 (German) y PR #45 HU 8.1 (Manuel). Sin código: HU 1.1 y 2.1 (Samuel), 3.1, 4.1 y 4.2 (Aaron), 7.2 (Manuel). La 3.2 (maqueta 3D) está en la rama `hu-3.2-mapa-3d-campus`, sin fusionar | Para la Tercera Entrega (10–12/nov) se defiende el Sprint 1 | Revisar y fusionar #44 y #45; abrir el PR de la maqueta; repartir lo pendiente |
| **Iteración 1** | En el Brief aprobado, la HU 1.2 salió y entró la **2.1 Registrar mis vehículos**. Samuel archivó 17 tarjetas de R2 en Trello | — | El backlog del repo ya lo refleja. Las tarjetas archivadas siguen en el Brief (Figma) |

## 2. Lo que hizo cada uno (según el repo y el Trello)

| Integrante | Sprint 1 (Brief aprobado) | Repo | Trello |
|---|---|---|---|
| Samuel | 1.1 Crear cuenta con el correo institucional · 2.1 Registrar mis vehículos | Sin código | Corrigió el Brief (16/oct), renombró tarjetas, armó el Trello por etapas y archivó R2 |
| Aaron | 3.1 · 3.2 · 4.1 · 4.2 | Sin código propio. La 3.1 y la 3.2 (API y maqueta) las hizo Sebastian en la rama `hu-3.2` | Sin cambios |
| German | 5.1 · 6.1 | 5.1 fusionada (PR #40). 6.1 en el PR #44 (abierto, sin conflictos) | Sin cambios |
| Manuel | 8.1 · 7.2 | 8.1 en el PR #45 (abierto, sin conflictos) | Sin cambios |
| Sebastian | 5.4 · 9.1 | 5.4 y 9.1 fusionadas (PR #43). Maqueta 3D y API en `hu-3.2` | Montó el tablero por etapas (13/oct) |

### Observaciones sobre los PR abiertos

- **PR #44 · HU 6.1 (German).** Tiene buena forma: pruebas (`tests/edificios.test.js`), «Closes #8»
  y pasos para probar. Pero el **título usa el nombre viejo** («Mantener el catálogo»), y el Brief
  aprobado dice «Registrar y actualizar el catálogo de edificios UCAB». Además incluye **quitar**
  edificios: con el CRUD de la profesora, eliminar sería otra historia. Hay que confirmar con el
  equipo si se deja o se separa.
- **PR #45 · HU 8.1 (Manuel).** Funciona con un botón en la página de inicio. El criterio dice «al
  **iniciar sesión** el sistema pide permiso… si no acepta, puede activarlas después **desde su
  perfil**», y todavía no hay inicio de sesión (HU 1.1) ni perfil: **cumple a medias**. El
  componente se llama `botonNotificaciones.js` (en minúscula) y el resto usa PascalCase. No
  tiene pruebas.

## 3. Trazabilidad: nombres que hay que igualar

Manda el **Brief aprobado** (Tabla 3 y Mapa de Impacto). El Trello ya usa estos nombres.

| HU | Nombre aprobado (Brief y Trello) | Nombre en el Issue de GitHub (hay que cambiarlo) |
|---|---|---|
| 1.1 | Crear cuenta con el correo institucional | Entrar con el correo de la UCAB (#1) |
| 5.1 | Consultar los estacionamientos en el mapa del campus | Ver el mapa del campus con los estacionamientos (#7) |
| 5.4 | Modificar la capacidad y el estado de un estacionamiento | Habilitar estacionamientos y fijar su capacidad (#12) |
| 5.5 | Crear y eliminar un estacionamiento | Crear, modificar y quitar estacionamientos (#46) |
| 6.1 | Registrar y actualizar el catálogo de edificios UCAB | Mantener el catálogo de edificios UCAB (#8) |
| 9.1 | Crear una incidencia | Reportar una incidencia (#11) |
| 9.2 | Actualizar el estado de una incidencia (vigilancia) | Atender una incidencia: cambiar su estado (#28) |
| 9.3 | Consultar el listado y el estado de las incidencias | Ver el listado y el estado de las incidencias (#47) |
| 9.4 | Eliminar una incidencia | Corregir o eliminar una incidencia (#48) |
| 2.1 | Registrar mis vehículos (pasa a Iteración 1) | Milestone «Iteración 2» (#14): moverlo a «Iteración 1» |
| 1.2 | Sale del Sprint 1 | Milestone «Iteración 1» (#2): moverlo a «Iteración 2» |

## 4. Plan para la Segunda Entrega (03/nov)

**Reparto: cada uno especifica una HU suya del Sprint 1.**

| Integrante | HU sugerida para especificar | Por qué esa |
|---|---|---|
| Samuel | 1.1 Crear cuenta con el correo institucional | La profesora comentó justo esa tarjeta |
| Aaron | 4.1 Actualizar el aforo con cada entrada o salida | Es la que la profesora usó para explicar escritura vs. consulta |
| German | 5.1 Consultar los estacionamientos en el mapa del campus | Ya está hecha y es fácil de diagramar |
| Manuel | 8.1 Activar las notificaciones | Tiene flujo alterno claro: acepta / no acepta |
| Sebastian | 9.1 Crear una incidencia | Su card ya tiene un solo verbo |

**Dentro de cada tarjeta de HU en Trello:**
1. Una **checklist o actividad «Especificación»** con las 3 partes de la Plantilla ERS
   (o la tabla pegada en la descripción).
2. Una línea **«Especificada por: <nombre>»**.
3. El **diagrama de actividades adjunto como imagen (PNG) o PDF**. Nada de enlaces a draw.io ni a
   Lucidchart.
4. Las casillas de «Especificar · Criterio 1, 2, 3» se marcan solo cuando el texto esté.

**Tarjeta nueva «Requisitos No Funcionales (ERS §2)»**, en Ejecución, con los 4 RNF (propuesta de
Sebastian, pendiente de acordar en equipo):

| Rango de calidad del Brief | Característica → subcaracterística ISO 25010 | RNF testeable (propuesta) |
|---|---|---|
| El mapa carga y se actualiza en pocos segundos | Eficiencia de desempeño → comportamiento temporal | El mapa con la ocupación de los 14 estacionamientos se muestra en ≤ 3 s en 4G, y un cambio de ocupación aparece en ≤ 5 s después del aviso del sensor |
| Se entiende de un vistazo | Capacidad de interacción → auto-descriptividad | 9 de cada 10 usuarios de prueba identifican el estacionamiento con más puestos libres en ≤ 10 s sin ayuda, solo con los colores del semáforo |
| Si un sensor falla, se oculta solo ese estacionamiento | Fiabilidad → tolerancia a fallos | Si un estacionamiento no recibe avisos por 10 min, se muestra «sin datos» y los demás siguen actualizándose |
| Seguro con los datos según el rol | Seguridad → confidencialidad | Un usuario sin rol de vigilancia o administración que pide las placas de otro recibe «acceso denegado» (100 % de los intentos en la prueba) |

## 5. Plan para mejorar el Trello (como lo pide la profesora)

Ya está bien: las 5 etapas (Inicio, Planificación, Ejecución, Seguimiento y Control, Cierre) y
el Backlog; las fechas; la checklist de actividades en cada HU; el tablero público con la
profesora como miembro.

Lo que falta:

1. **Reuniones con contenido.** En «Reunión 1, 2 y 3» poner fecha, asistentes, temas, acuerdos y
   responsables. Crear «Reunión 4 · Seguimiento (lun 02/nov)» antes de la entrega y una por
   semana después.
2. **Especificación como actividad** en cada HU de Ejecución (§4). Es lo que la profesora marcó en
   la HU 1.1.
3. **Responsable como miembro de la tarjeta.** Hoy las HU no tienen miembros: el nombre solo
   está en la descripción. Asignar a cada uno y mantener la etiqueta de color.
4. **Casillas honestas.** Desmarcar «Especificar · Criterio 1–3» en 5.1, 5.4 y 9.1 hasta que la
   especificación esté escrita. Hoy la profesora ve «hecho» donde no hay nada.
5. **Iteración 2.** Crear «Sprint 2» con fechas, y las tarjetas de la Segunda (03/nov) y Tercera
   Entrega (10–12/nov) en Planificación o Seguimiento.
6. **Cierre de la Iteración 1 (16/oct):** retrospectiva con qué salió bien, qué no y qué se
   cambia. Hoy la tarjeta está vacía.
7. **Identificación:** el tablero se identifica como «EQUIPO 87 3» (instrucción de la Segunda
   Entrega). Hoy se llama «Radar de Estacionamientos UCAB - Sprint 1».
8. **Tarjetas sueltas «Entrega 1 … 5»:** están en una lista archivada. Moverlas a Seguimiento y
   Control o borrarlas, para que no confundan.
9. **Maqueta y arquitectura:** la tarjeta «Arquitectura base» puede enlazar
   `arquitectura/arquitectura_dual_app_y_maqueta.md` y marcar lo ya decidido.

### Aplicado el 27/oct/26 (con la aprobación de Sebastian)

Con el workflow `.github/workflows/trello-mejoras-27oct.yml` (rama `trello-mejoras-27oct`): primero
un ensayo y después la escritura. Se verificó contra el tablero público.

- ✅ Tablero renombrado «EQUIPO 87 3 · Radar de Estacionamientos UCAB» (punto 7).
- ✅ Responsable como miembro en las 20 tarjetas HU (punto 3). German tiene dos cuentas en Trello: se
  usó «Germán Matheo Alfonzo Marczuk».
- ✅ «Especificar · Criterio 1–3» desmarcados en 5.1, 5.4 y 9.1 (punto 4).
- ✅ Checklist «Especificación ERS · Segunda Entrega (03/11/2026)» en 1.1, 4.1, 5.1, 8.1 y 9.1, con
  «Especificada por» (punto 2 y §4). Si alguien elige otra HU, se mueve la checklist.
- ✅ Tarjeta «Requisitos No Funcionales (ERS §2) · Segunda Entrega» con los 4 RNF **propuestos**
  y la casilla «Acordar los 4 RNF en equipo».
- ✅ Reuniones 1–3 con objetivo y checklist «Minuta» (asistentes y acuerdos **por completar**: no
  hay registro de lo que se habló). Reunión 4 creada para antes del 03/nov (punto 1).
- ✅ Cierre de la Iteración 1 con la checklist «Retrospectiva» (punto 6).
- ✅ Arquitectura base: se agregó la arquitectura dual y se marcó «Documentar la arquitectura» (punto 9).
- ✅ HU 2.1 marcada como R1 en su descripción.
- ⏸️ Sin hacer: crear el «Sprint 2» (punto 5), porque sus fechas las decide el equipo. Las tarjetas
  sueltas de entregas (punto 8) siguen en la lista archivada: no se ven.

**GitHub (27/oct):** los 9 Issues de §3 se renombraron; #14 (HU 2.1) pasó a «Iteración 1» y quedó
asignado a Samuel; #2 (HU 1.2) pasó a «Iteración 2».

## 6. Huecos del producto (segunda pasada, 27/oct/26)

Se revisó la app corriendo, en computador y en celular, contra el Brief y los rangos de calidad.

| # | Hueco | Estado |
|---|---|---|
| 1 | **El mapa de inicio no mostraba la ocupación.** Dibujaba los estacionamientos desde un archivo fijo, sin semáforo ni puestos libres, aunque la API ya los calculaba (HU 4.2, de Aaron, sin código) | ✅ Resuelto en la rama `hu-4.2-semaforo-diseno-pwa`: semáforo en el mapa, píldora con los libres, lista ordenada, total del campus y tarjeta del estacionamiento |
| 2 | **El mapa no se actualizaba solo** (el canal en vivo existía, pero nadie lo escuchaba) | ✅ El mapa escucha `GET /api/eventos`: el aviso del sensor cambia la cifra en menos de 1 s y el estacionamiento late. Indicador «En vivo / Reconectando / Sin conexión» |
| 3 | **No era PWA** (el Brief pide web, y el conductor la usa desde el celular) | ✅ D-008: manifest, íconos, service worker único, «Actualizar» y página «Sin conexión» |
| 4 | **Diseño sin guía**: menú que se rompía en el celular, emoji como íconos, cada pantalla con su estilo | ✅ D-007 + `DESIGN.md`: estilo iOS institucional, pestañas abajo en el celular, íconos SVG, claro y oscuro |
| 5 | Reportar desde el mapa obligaba a buscar otra vez el estacionamiento | ✅ «Reportar un problema aquí» lo deja elegido |
| 6 | **Sin inicio de sesión real** (HU 1.1, Samuel): en producción no hay usuario, así que **nadie puede reportar** | ⏳ Pendiente. Bloquea el despliegue |
| 7 | **Los datos viven en memoria** y se pierden al reiniciar. En Vercel cada instancia tiene su propia memoria: el canal en vivo **no funcionaría desplegado** | ⏳ Pendiente: decidir la base de datos (`preguntas_abiertas.md`). Bloquea el despliegue |
| 8 | **«Sin datos»** (RNF 3, tolerancia a fallos): un estacionamiento cuyo sensor calla no se marca | ⏳ Pendiente (HU 4.4, R2): guardar la hora del último aviso |
| 9 | HU 7.2 «Sugerir el más cercano» (Manuel) sin código; depende del catálogo de edificios (PR #44) | ⏳ Pendiente |
| 10 | El PR #45 (HU 8.1) trae su propio `sw.js` | ⏳ Debe quitarlo y usar el de D-008, que ya trae sus manejadores `push` y `notificationclick` |
| 11 | Falta correr `/impeccable critique` sobre el mapa y los formularios | ⏳ Pendiente (la skill ya está en el repo) |
