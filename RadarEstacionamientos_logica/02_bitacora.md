# Bitácora

**Estado:** 🟢 Vigente — una entrada por sesión de trabajo, la más reciente arriba.

## 04/oct/26 — Plan de trabajo por etapas (Trello)

- Se comparó el Brief con el ejemplo de la profesora: su tablero de Trello va por **etapas del proyecto**
  (Inicio, Planificación, Ejecución, Seguimiento y Control), no por Por hacer / En proceso / Hecho.
- Se creó `producto/tablero_trello_por_etapas.md` con las tarjetas, fechas y checklists de cada etapa,
  listas para pegar en Trello. Las tarjetas de gestión (reuniones, monitoreo, cierre) son propuesta del equipo.
- Brief: la sección 5 explica las etapas, numera la tabla de HU (Tabla 3), agrega la Tabla 4 de tareas
  de gestión y se registró en el Histórico de Revisiones. Se actualizaron los números de página
  de la tabla de contenido (todo corrió una página).
- En el archivo del tablero se agregó la tabla para renombrar las HU de Trello con los nombres del Brief.
- Falta: montar el tablero, nueva captura (Figura 3) y enlace público.

## 05/oct/26 — Trello propio y conexión con GitHub

- En el tablero de Germán todos (salvo él) eran observadores, sin permiso de edición. Se creó un
  tablero nuevo administrado por Sebastian: *Radar de Estacionamientos UCAB - Sprint 1*
  (trello.com/b/WQSBIFTj), en el workspace *Radar Estacionamientos UCAB*. Listas: Por hacer (Sprint 1),
  En proceso, En revisión, Hecho y Siguientes iteraciones (R2); 32 tarjetas con responsable, fechas,
  criterio y enlace al Issue. El tablero de Germán no se modificó.
- Automatización `.github/workflows/trello.yml`: Issue asignado → En proceso; PR con `Closes #N` →
  En revisión; Issue cerrado → Hecho; reabierto → Por hacer. Usa la app de Trello *GitHub Radar*.
- Brief: **sin cambios por ahora.** Se había sobrescrito por error la versión con el plan por etapas
  (commit 2a5ea42, otra sesión); se restauró. Falta decidir si el tablero va por etapas (como el
  ejemplo de la profesora) o por estado, antes de cambiar enlace y captura en el Brief.

## 05/oct/26 — Lógica y código juntos en el repo

- A pedido de Sebastian, el repo ahora tiene las dos carpetas visibles para el equipo: la raíz
  del repo es *Ingeneria de Software* y dentro están `RadarEstacionamientos_logica/` y
  `RadarEstacionamientos_code/`. Esto reemplaza lo anotado abajo ("la carpeta de lógica queda
  fuera"). README, CONTRIBUTING, `.github/` y `.gitignore` pasaron a la raíz.
- Regla: el código va solo en `_code`; la lógica la cambia la sesión de lógica y el equipo
  reporta errores por Issue con la etiqueta `documentación`.

## 05/oct/26 — Tareas en GitHub

- Se crearon 20 etiquetas propias (R1, R2, historia, bloqueado, documentación, una por épica y una por persona),
  los milestones Iteración 1 (vence 16/oct/26) e Iteración 2, y 32 Issues: 12 de R1 con criterio de
  aceptación, fechas y rama sugerida, y 20 de R2.
- Se subieron plantillas de Issue (historia, error) y de Pull Request, y `CONTRIBUTING.md` con el flujo
  rama → PR con `Closes #N` → revisión → merge.
- La protección de `main` no se pudo activar: GitHub la pide con Pro o repo público. Queda como acuerdo
  del equipo hasta activar el Student Developer Pack.
- Manuel invitado como colaborador (`marosaless`).

## 05/oct/26 — Repositorio en GitHub

- Se creó el repo privado `Proyecto-Estacionamientos-UCAB` en la cuenta universitaria
  `sebastianmoreno1793` (solo para este proyecto). El repo es `RadarEstacionamientos_code/`;
  la carpeta de lógica queda fuera, según el método.
- Regla del equipo: una rama por historia y Pull Request revisado; nada directo a `main`.

## 04/oct/26 — README con el método de trabajo

- Se agregó al `README.md` la explicación del método de dos sesiones, el flujo de trabajo
  y las reglas de la carpeta.

## 04/oct/26 — Brief revisado y carpeta organizada

- Se revisó el Brief contra la guía de la profesora (`negocio/guia_profesora_como_se_elabora_el_brief.pdf`).
  Lo más importante: el Brief **se escribe en lenguaje de negocio, no técnico** (la versión
  técnica que se probó antes quedó descartada).
- Cambios aplicados al Brief: encabezado con nombre, versión y fecha; tabla de contenido
  automática; criterios de aceptación de la Iteración 1; mapa de historias completo (10
  épicas, R1 y R2); restricción de costos; fechas dd/mmm/aa; nombres corregidos (German
  Alfonzo); cédulas en la portada; enlace de Figma clicable; paginación sin tablas cortadas.
- Se creó la estructura del método de dos sesiones (`_logica` y `_code`).
- Se dejó **un solo Brief** en `entregables/`. Las copias viejas (v1.5 técnica y duplicados)
  se retiraron de la carpeta.
- Hora pico del campus: 10:00 a.m. y 2:00 p.m. (dato de Sebastian).
