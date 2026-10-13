# Bitácora

**Estado:** 🟢 Vigente — una entrada por sesión de trabajo, la más reciente arriba.

## 13/oct/26 — Segunda ronda: Trello por etapas, épica de ranking y rangos de calidad

- Se leyeron en el Google Doc de la profesora los comentarios que faltaban (orden de metas, épica de ranking,
  "solo dejar 4" rangos, estructura de Trello, comentarios en Trello) y se vio la pizarra de la clase del 13/oct.
  El audio de la clase se transcribió con el reconocimiento de voz de macOS: salió parcial y con ruido, así que
  la fuente fiable fue la foto de la pizarra y el Doc.
- **Trello** (tablero público WQSBIFTj) reestructurado con la sesión de Sebastian: listas ETAPA 1 Inicio, 2 Planificación,
  3 Ejecución (12 HU), 4 Seguimiento y Control, 5 Cierre y Backlog (27 HU, con las nuevas 5.5, 9.3, 9.4 y 11.1–11.4).
  Cada HU lleva checklist de 12 actividades. Listas "Entregas del proyecto", "Por hacer/En proceso/En revisión/Hecho" y
  "Siguientes iteraciones" **archivadas** (se pueden restaurar). Etiquetas nuevas: En proceso, En revisión, Hecho, Gestión.
- **Brief (.docx)**: Tabla 1 en el orden pedido y con meta Ranking; épica 11 y Figuras 1 y 2 regeneradas; 4 rangos de
  calidad; Tabla 4 por 5 etapas (con Maqueta general y Arquitectura base, fechas propuestas 12–14/oct por confirmar);
  texto de actividades; Figura 3 nueva (captura del tablero); enlace público de Trello; fila del 13/oct ampliada.
- **Pendiente**: Figma (sin herramienta para editarlo; el tablero sigue con 5 columnas viejas), permiso de comentarios
  de la profesora en Trello, pegar el Brief corregido en el Google Doc (el Doc en línea es la versión del 06/oct),
  y ajustar `.github/workflows/trello.yml`, que mueve tarjetas entre listas que ya no existen.

## 13/oct/26 — Brief (.docx) corregido y figuras del mapa regeneradas

- Se corrigió `entregables/BRIEF EQUIPO 3 15787.docx` con lo de `producto/correcciones_brief_profesora.md`:
  fila nueva en el Histórico de Revisiones (13/oct/26), Tabla 1 (Mapa de Impacto) con épica e historia por
  integrante, criterios de aceptación de HU 4.1 (escribe), 4.2 (lee) y 5.4 (antes 10.1), Tabla 3 con los tres
  nombres corregidos, frase de las cuatro actividades por historia y de las reuniones en Trello.
- Figuras 1 y 2 (mapa de historias) regeneradas con el mismo estilo del Figma, con las 10 épicas renombradas
  y todas las HU (nuevas: 2.5, 4.4, 5.4, 5.5, 9.3, 9.4). **Ojo:** son una imagen hecha por script, no una
  exportación; el tablero de Figma en línea sigue con los nombres viejos hasta que el equipo lo edite.
- Tabla 1 corregida: las **metas** quedan como estaban y las **épicas van en la columna Entregable** con su
  historia y responsable (aclaración de Sebastian: las épicas son los entregables, las metas son cómo se cumplen).
  Referencia visual: `producto/tabla1_mapa_de_impacto_corregida.png`.
- Tabla 1 sin responsables (no se indica quién hace cada historia). Maquetación del .docx revisada con
  LibreOffice (PDF de prueba): Histórico de Revisiones cabe en una página, se quitó la página en blanco tras la
  Tabla 1 y ninguna tabla queda partida entre páginas; el documento pasó a 10 páginas.
- Pendiente: actualizar el tablero de Figma, la captura de Trello (Figura 3) y la tabla de contenido
  (clic derecho → Actualizar campo, porque cambió la paginación); revisar el .docx en Word.

## 13/oct/26 — Correcciones de la profesora al Brief

- La profesora comentó el Google Doc del Brief el 09/oct/26 (12 comentarios). Detalle y resolución en
  `producto/correcciones_brief_profesora.md`; guía de defensa en `producto/guia_defensa_brief_y_comentarios.pdf`.
- Backlog reestructurado conservando los números de HU e Issues: épicas renombradas (Gestión de estacionamientos,
  Aforo, Gestión de incidencias, Notificaciones), HU 4.1 pasa a escritura y 4.2 a lectura, HU 10.1 → 5.4,
  HU 9.3 → 4.4, HU 10.4 → 2.5. Nuevas: 5.5 (#46), 9.3 (#47), 9.4 (#48).
- GitHub: etiquetas de épica renombradas, actividades por historia en los Issues de R1, Issues de R1 asignados
  a su responsable, Issues 33–39 (entregas del curso, incluida la táctica) cerrados como "no planificados".
  Los Issues de R2 no se asignaron: el workflow de Trello los movería a "En proceso".
- Pendiente: pegar las correcciones en el Google Doc, actualizar Figma y Trello (renombrar, reuniones,
  actividades, quitar entregas del curso) y confirmar con la profesora el destino de la épica 10.

## 05/oct/26 — Fechas de entrega en GitHub

- Con el Plan de Evaluación (IS PLAN DE CLASE V3) se crearon 6 milestones con fecha (Entrega 1 a 5 y
  Revisión del Brief) y 7 Issues (#33–#39) con checklist, etiquetas `entrega` y `presentación`.
- Calendario en `producto/calendario_de_entregas.md`. El contenido de las entregas 2–5 está por confirmar;
  la tercera entrega dice "10/9" y se asumió 10/nov.
- En Trello se creó la lista **Entregas del proyecto** con 7 tarjetas fechadas (8:00 a.m., hora por confirmar),
  con todo el equipo como miembro para que salgan en el Planner de cada uno.

## 05/oct/26 — Mapa de historias con el estilo de Figma

- Figuras 1 y 2 del Brief reemplazadas por el mapa en el estilo del Figma del equipo (épicas en rosado,
  Iteración 1 en verde agua, siguientes iteraciones en amarillo), con las 10 épicas y las HU de R1 y R2.
- Se registró en el Histórico de Revisiones; la tabla de contenido se actualizó (9 páginas).

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
