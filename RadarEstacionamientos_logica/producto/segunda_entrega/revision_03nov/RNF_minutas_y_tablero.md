# Informe general · Segunda Entrega (todo lo que no es una HU)

Revisor: jefe de calidad · martes 03/nov/26 · foto del tablero de ~12:00 p. m. (`board.json`).
Horas en hora de Venezuela (VET = UTC − 4).

## Veredicto

**Todavía no está listo para enviar.**

- **RNF: aprobables.** Los 4 empiezan con «El sistema debe…», tienen la subcaracterística ISO 25010
  correcta, salen de su rango del Brief y traen número, unidad y prueba. Quedan ambigüedades que un
  probador estricto marcaría (caché de la PWA, qué cambio se mira en pantalla, cómo se intenta ver
  una placa ajena) y el nombre «Facilidad de Iteración». Hay textos listos abajo, unos 15 minutos.
- **Minutas y retrospectiva: no están.** La Reunión 2, la Reunión 4 y la retrospectiva están vacías
  («por completar» o solo la descripción). La profesora ya preguntó dos veces si nos reunimos, y el
  correo dice «Las minutas de nuestras reuniones están en Seguimiento y Control». Así como está, esa
  frase es falsa.
- **Tablero:** el nombre, la visibilidad y la profesora como miembro están bien. Pero hay
  contradicciones a la vista: la Reunión 2 está marcada como completada y está vacía; hay casillas
  marcadas sin el trabajo hecho (diagrama de la HU 8.1); hay comentarios y checklists que dicen
  «nada de enlaces» al lado de los enlaces; y unas 15 tarjetas tienen la fecha vencida.
- **Revisión cruzada: 4 de 5.** Falta la de Samuel a la HU 4.1 de Aaron (la tarjeta no tiene
  ningún comentario).

---

## 1. Hallazgos por gravedad

Leyenda: 🔴 resta puntos seguro · 🟠 probable que la profesora lo marque · 🟡 mejora.

### 🔴 / bloqueantes del correo

**B1 · HU 8.1 sin diagrama, tabla ni enlace, con la casilla marcada.** *(Los detalles de la HU los
revisan otros. Aquí lo cuento por la coherencia del tablero y del correo.)*
- Dónde: la tarjeta HU 8.1 tiene **0 adjuntos**. Su checklist dice
  `[x] Diagrama de actividades adjunto como imagen o PDF`. La tarjeta «Segunda Entrega» dice
  `[x] 2 · Diagrama de actividades de la HU 8.1` (Manuel lo marcó el 02/11 a las 2:34 a. m.).
- Riesgo: el diagrama vale 3 pts y la card 1 pt, o sea **hasta 4 pts**. El correo dice «con el
  diagrama de actividades adjunto» para las cinco HU.
- Corrección: Manuel sube el PNG exportado, la tabla y el enlace antes del envío. Si no llega a
  tiempo: se desmarcan las dos casillas y se cambia la frase del correo (ver §5).

### 🟠 Probable que la profesora lo marque

**O1 · Minuta de la Reunión 2 vacía y marcada como completada.** (Responsable: Aaron)
- Dónde: «Reunión 2 · Seguimiento (09/10/2026)». La descripción dice `**Asistentes:** por completar`
  y `**Acuerdos:** por completar`, y la checklist «Minuta» está en 0/4. **La fecha está marcada como
  completada** (Sebastian la marcó el 13/10). Es la tarjeta donde la profesora escribió el 19/10:
  «ustedes no se vana a reunir???», y nadie le respondió.
- Corrección: Aaron escribe lo que de verdad pasó, con el formato de la Reunión 1 (asistentes, temas,
  acuerdos y responsables con fecha) y marca la checklist. **No hay que inventar asistentes.** Si no
  hubo reunión, se escribe así: «No hubo reunión el 09/10; el seguimiento se hizo por <medio> el
  <fecha>», y se desmarca «completada». Después conviene responder el comentario de la profesora con
  una línea (lo decide el equipo).

**O2 · Minuta de la Reunión 4 vacía.** (Responsable: Sebastian)
- Dónde: «Reunión 4 · Preparación de la Segunda Entrega». Dice `por completar`, la checklist está en
  0/4 y la fecha venció (02/11, 8:00 a. m.). El borrador está en el repo:
  `producto/segunda_entrega/reunion4_convocatoria_y_minuta.md`. Ahí solo está marcada la asistencia
  de Sebastian y la hora y la plataforma siguen en blanco.
- Corrección: completar con datos reales. Si la revisión cruzada fue por comentarios y no en una
  llamada, decirlo así, porque es verificable en el tablero. Texto base para pegar (ajustar los
  asistentes):

```
**Fecha:** 01–02/11/2026 · **Modalidad:** <virtual por … / revisión asíncrona por comentarios en Trello>

**Asistentes:** <solo quienes participaron>

**Temas tratados:**
- Estado de la Segunda Entrega por integrante.
- Revisión cruzada de las HU 1.1, 4.1, 5.1, 8.1 y 9.1 (comentarios en cada tarjeta).
- Los 4 Requisitos No Funcionales.
- Minutas pendientes y retrospectiva de la Iteración 1.

**Acuerdos:**
1. Formato común de las HU: tabla de 3 columnas con el Autor, diagrama PNG adjunto y enlace de viewer.diagrams.net.
2. Corregir cada HU según la revisión cruzada.
3. Dejar en final los 4 RNF en la tarjeta «Especificación de Requisitos No Funcionales».
4. Completar las minutas de las Reuniones 2 y 3 y la retrospectiva.
5. Revisión final y envío del enlace a mperezpu@ucab.edu.ve.

**Responsables y fechas:**
- Cada autor: acuerdo 2 (02/11).
- Manuel, German, Aaron y Samuel: acuerdo 3 (02/11).
- Aaron (Reunión 2), German (Reunión 3) y Manuel (retrospectiva): acuerdo 4 (02/11).
- Sebastian Moreno: acuerdos 1 y 5 (03/11).

**Minuta registrada por:** Sebastian Moreno
```

**O3 · Retrospectiva vacía.** (Responsable: Manuel)
- Dónde: «Cierre de la Iteración 1 y retrospectiva (16/10/2026)», en la lista Cierre. Solo tiene la
  descripción; la checklist está en 0/3 y la fecha venció el 16/10.
- Corrección: escribir las tres partes y que cada cambio tenga responsable y fecha. Estructura para
  pegar (el contenido lo pone el equipo; los ejemplos entre paréntesis son hechos del tablero que
  pueden servir):

```
**Retrospectiva del Sprint 1 (16/10/2026)** · Asistentes: <…>

**Qué salió bien:**
- <p. ej.: varias HU de la Iteración 1 llegaron con código revisado por Pull Request>
- <…>

**Qué no salió bien:**
- <p. ej.: no registramos la minuta de la Reunión 2 y la profesora preguntó si nos reunimos>
- <p. ej.: el Brief tuvo problemas de trazabilidad entre Backlog, Trello y Tabla 3 (nota 2,1/3)>
- <…>

**Qué cambiamos en el Sprint 2 (responsable y fecha):**
1. <Minuta en Trello el mismo día de cada reunión> — <responsable> — <fecha>
2. <…> — <responsable> — <fecha>

**Registrada por:** Manuel Rosales
```

**O4 · Casillas y comentarios que contradicen el estado actual.** La profesora los ve al abrir las
tarjetas.
- La tarjeta RNF tiene un comentario de Sebastian (02/11, 2:41 p. m.) que dice que «Facilidad de
  Iteración» pasó a «Capacidad de interacción, que es el nombre ISO 25010» y que ordenó la tarjeta
  «como la plantilla ERS §2 (2.1 a 2.8)». La tarjeta de hoy dice lo contrario. El propio comentario
  señala el error.
- En las HU 1.1, 5.1 y 8.1 el último ítem de la checklist dice
  «(no enlace a la herramienta de diagramación)». Sin embargo, la 1.1 y la 5.1 sí tienen el enlace.
  Los comentarios de Sebastian en la 1.1 y la 5.1 piden «Quita los enlaces a viewer.diagrams.net».
- Corrección:
  (a) En la 1.1, la 5.1 y la 8.1, cambiar el texto del ítem a
  `Diagrama de actividades adjunto como imagen y con enlace de draw.io que abre sin pasos previos`,
  igual que en la 4.1 y la 9.1.
  (b) Agregar un comentario corto en la tarjeta RNF:
  `03/11 · Por acuerdo del equipo volvimos al orden de nuestra lista de características; el contenido de los 4 RNF es el mismo de la revisión del 02/11.`
  Otra opción es editar el comentario del 02/11.

**O5 · Falta la revisión cruzada de Samuel a la HU 4.1.**
- Dónde: la tarjeta HU 4.1 no tiene **ningún comentario**. En «Segunda Entrega», el ítem
  `[ ] 5 · Revisar a Aaron (HU 4.1)` sigue sin marcar.
- Corrección: Samuel deja el comentario con la checklist del plan (un solo verbo, Conversación con
  6 partes, criterios comprobables, diagrama, nombres del Brief). Ojo: en la Card de la 4.1 el verbo
  es «quiero **ver** el aforo…» y el título dice «Actualizar el aforo». Lo marcó el mensaje del
  grupo y lo resuelve quien revisa la HU.

**O6 · Ambigüedades en los RNF que impiden un caso de prueba objetivo.** El detalle y los textos
listos están en §2. En riesgo: hasta ~2 de los 8 pts de RNF si la profesora es estricta.

**O7 · El correo nombra mal la tarjeta de RNF.**
- El correo dice «la tarjeta «Requisitos No Funcionales (ERS §2)»», pero la tarjeta se llama
  **«Especificación de Requisitos No Funcionales»**.
- Corrección: usar el nombre real. Texto en §5.

### 🟡 Mejoras

- **M1 · Reunión 3: un acuerdo sin fecha.** Dice «Sebastian Moreno: acuerdo 5 (13/10) y acuerdo 6
  (pendiente)». El acuerdo 6 ya está hecho: la profesora entró como miembro del tablero el **19/10**
  (acción `addMemberToBoard` de esa fecha) y comentó ese mismo día. Texto para pegar:
  `- Sebastian Moreno: acuerdo 5 (13/10) y acuerdo 6 (hecho el 19/10: la profesora es miembro del tablero).`
- **M2 · Reunión 1: acuerdos 2, 3 y 4 sin responsable ni fecha.** Los «Responsables y fechas» solo
  cubren el acuerdo 1 (el reparto de las HU). Agregar, por ejemplo:
  `- Sebastian Moreno: acuerdos 2 y 3 (05/10). Todo el equipo: acuerdo 4 (09/10 y 13/10).`
- **M3 · Fechas vencidas en rojo** en unas 15 tarjetas: HU 3.1, 4.1, 4.2, 5.1, 7.2, 8.1 y 9.1;
  Maqueta general; Arquitectura base; Monitoreo; Control de calidad; Reunión 4; Retrospectiva; RNF;
  Segunda Entrega. **No hay que cambiar fechas para disimular.** Sí hay que marcar como completadas
  las tarjetas cuyo trabajo ya esté hecho: RNF y Segunda Entrega al enviar, y Reunión 4 y
  Retrospectiva cuando tengan su contenido. Al revés, hay que desmarcar la Reunión 2 si sigue vacía.
- **M4 · Adjuntos viejos que pueden confundir al corregir el diagrama** (cada error resta 1 pt):
  - HU 1.1: «(versión oscura, reemplazada)», «Especificación (versión anterior)» y
    «Diagrama de actividades (versión anterior)».
  - HU 5.1: «diagrama_actividades_HU5.1 (versión anterior).png», que Aaron y Sebastian pidieron
    borrar, y además el v2.
  - HU 9.1: «diagrama_actividades_HU9.1 (versión anterior).png».
  - Corrección: borrarlos, o al menos que la portada y la descripción apunten solo al vigente.
- **M5 · El autor está escrito de tres formas:** «Autor: Goncalves, Samuel» (1.1, 4.1, 9.1),
  «**Especificada por:** German Alfonzo» (5.1) y «Especificado por: Manuel Rosales» (8.1). Todas
  cumplen la consigna («se indica quién la especificó»). Si hay tiempo, unificar en
  «Autor: Apellido, Nombre».
- **M6 · Los números de los RNF no coinciden.** En la descripción van 1, 2, 4 y 5
  (Auto-descriptividad, Comportamiento temporal, Tolerancia a fallos, Confidencialidad). En las
  checklists de RNF y de «Segunda Entrega» siguen «RNF 1 · Comportamiento temporal», «RNF 2 ·
  Auto-descriptividad», «RNF 3», «RNF 4». Conviene quitar los números de las checklists
  (`RNF · Comportamiento temporal (German)`, etc.).
- **M7 · HU 2.1 está al final de la lista Ejecución**, después de la 9.1. Moverla debajo de la 1.1.
- **M8 · German aparece dos veces como miembro del tablero** («German Alfonzo» y «Germán Matheo
  Alfonzo Marczuk»), y las dos cuentas están en las tarjetas de Entregas. Quitar la cuenta que no usa.
- **M9 · Tarjeta «📦 Entrega 2 (12 pts)».** Está en la lista «Entregas del proyecto», que está
  **archivada**, así que la profesora no la ve. Su descripción quedó vieja («Contenido por confirmar
  con la profesora», «hora por confirmar»). No tiene checklist. No urge.
- **M10 · Estado «sin datos».** El RNF de tolerancia a fallos crea un estado «sin datos» que D-009
  no lista (D-009: Hay puesto / No hay puesto / Cerrado). No resta puntos en esta entrega. Conviene
  anotarlo en D-009 o en la HU 4.4 para la defensa.

Lo que **está bien** en la coherencia:
- El tablero se llama «EQUIPO 87 3 · Radar de Estacionamientos UCAB» (renombrado el 27/10), es
  público y la profesora es miembro.
- Los 5 títulos de HU coinciden letra por letra con la Tabla 3 del Brief y el backlog.
- Las 5 épicas usan el nombre del Brief (Gestión de perfiles, Aforo, Gestión de Puestos, Sugerencia
  y notificaciones, Gestión de Incidencias).
- Las 12 HU de la Iteración 1 están en Ejecución y la 1.2 está archivada.
- El Backlog solo tiene historias R2.
- Los PR #49, #50 y #51 ya están fusionados (27/10). Esa parte de la tarea 3 de Sebastian está hecha.

---

## 2. RNF (tarjeta «Especificación de Requisitos No Funcionales»)

| RNF | «El sistema debe…» | Subcaracterística ISO 25010 (U07) | Rango del Brief | Medible | Prueba objetiva |
|---|---|---|---|---|---|
| 1 · Auto-descriptividad (Manuel) | ✔ | ✔ Auto-descriptividad es de **Capacidad de interacción** (lámina, ventana 38: «haciendo su uso inmediatamente evidente…») | ✔ «entenderse de un vistazo… colores del semáforo» (no cubre «lenguaje claro»; se acepta) | ✔ 9/10 usuarios, ≤ 10 s | ⚠ ver A1–A3 |
| 2 · Comportamiento temporal (German) | ✔ | ✔ Eficiencia de desempeño (ventana 28) | ✔ «cargarse y actualizarse en pocos segundos» | ✔ ≤ 3 s en 9/10 cargas, red fija; ≤ 5 s | ⚠ ver A4–A6 |
| 3 · Tolerancia a fallos (Aaron) | ✔ (ya corregido) | ✔ Fiabilidad (ventana 40) | ✔ «ocultar solo ese estacionamiento…» (interpretado como ocultar su ocupación; se explica) | ✔ 10 min, ≤ 5 s, 100 % en 5 pruebas | ⚠ ver A6–A7 |
| 4 · Confidencialidad (Samuel) | ✔ | ✔ Seguridad (ventana 34) | ✔ «placas y vehículos solo los ve su dueño y el personal autorizado» | ✔ 100 % en 10 intentos | ⚠ ver A8–A9 |

### Ambigüedades y texto para pegar

- **A1 · RNF 1, «La maqueta muestra…».** En este proyecto, «maqueta» es tanto la maqueta 3D que
  simula los sensores (D-006) como la pantalla de inicio de la app (D-007). Un probador externo no
  sabe cuál de las dos probar. Con «al menos uno verde y uno rojo», quien señala al azar acierta el
  50 %. Reemplazar la línea de Preparación por:
  `- Preparación: 10 estudiantes o profesores que no conocen el Radar. La pantalla de inicio del Radar muestra al menos 2 estacionamientos en verde (hay puesto) y 2 en rojo (no hay puesto), y ninguno cerrado ni «sin datos».`
- **A2 · RNF 1, cuándo empieza y qué cuenta como acierto.** Reemplazar Prueba y Aceptación por:
  `- Prueba: se abre el Radar y, cuando el mapa termina de cargar, se le pregunta a cada uno «¿dónde puedes estacionar ahora?». Se cronometra desde la pregunta hasta que toca o señala un estacionamiento. Nadie le explica los colores.`
  `- Aceptación: al menos 9 de 10 señalan un estacionamiento en verde en 10 s o menos. Señalar uno rojo o pasar de 10 s cuenta como fallo.`
- **A3 · RNF 1, nombre de la característica.** Ver §2.1.
- **A4 · RNF 2, la caché de la PWA (D-008).** Desde la segunda carga, la app sale de la caché y
  carga casi al instante. Además, no se dice si el tiempo incluye iniciar sesión. Dos probadores
  medirían cosas distintas. En la frase, después de «medidos desde que el usuario», agregar:
  `, con la sesión ya iniciada y la caché del navegador vacía,`
  En la prueba de Carga, agregar: `Antes de cada carga, activar «Desactivar caché» (Disable cache) en las herramientas del navegador.`
- **A5 · RNF 2, qué cambio se mira.** Con D-009 una entrada casi nunca cambia el color (sigue
  verde mientras quede 1 libre). Lo que cambia es la cifra «N libres». La frase tampoco dice el
  porcentaje (la prueba exige 10 de 10). Cambiar el final de la frase por:
  `…y debe reflejar un cambio de ocupación (la cantidad de puestos libres que muestra el estacionamiento) en **5 segundos o menos** después del aviso del sensor, en el **100 %** de los avisos.`
  Y la prueba de Actualización por:
  `- Actualización: con el Radar abierto, enviar 10 avisos de entrada desde el simulador de sensores y cronometrar desde que se envía cada aviso hasta que cambia la cantidad de libres de ese estacionamiento. Los 10 cambios deben verse en 5 s o menos.`
- **A6 · RNF 3, mismo punto que A5.** Cambiar «comprobar que su ocupación cambia en 5 s o menos» por:
  `comprobar que la cantidad de libres que muestra ese estacionamiento cambia en 5 s o menos.`
- **A7 · RNF 3, cuándo se comprueba.** «Al pasar los 10 minutos» no dice con qué margen. Texto:
  `- Fallo aislado: se comprueba a los 10 minutos y 5 segundos de detener los avisos: ese estacionamiento ya no muestra su color (hay o no hay puesto) y aparece como «sin datos».`
  (🟡 de diseño, no de prueba: un estacionamiento sin carros durante 10 minutos, por ejemplo de
  noche, también quedaría «sin datos». Para la defensa conviene que el sensor mande una señal de vida.)
- **A8 · RNF 4, cuántos vehículos.** La preparación registra **un** vehículo, pero la prueba «se
  repite con 10 placas distintas». Texto:
  `- Preparación: crear dos cuentas de estudiante (A y B) y una con rol de vigilancia o administración. Con la cuenta B, registrar 10 vehículos con placas distintas.`
- **A9 · RNF 4, por dónde se intenta el acceso ajeno.** «Desde la pantalla de vehículos y buscando
  directamente la placa de B» no es un camino que exista para un estudiante: su pantalla solo
  muestra lo suyo y no hay buscador. Un probador necesita la vía concreta. Texto:
  `- Acceso ajeno: con la sesión de A, intentar ver cada vehículo de B abriendo la dirección (URL) o la consulta a la API que usa la pantalla de vehículos, cambiando el identificador por el de B. El sistema debe responder «acceso denegado» y no mostrar ninguna placa de B.`

### 2.1 Orden «1. Facilidad de Iteración, 2. Eficiencia de Desempeño…» frente a la plantilla ERS

**Riesgo en una línea:** el orden distinto al de la plantilla (2.1 Eficiencia … 2.3 Capacidad de
interacción) casi seguro no resta puntos, porque se corrige por subcaracterística y las cuatro están
bien. Lo que sí puede marcar es el **nombre** «Facilidad de **Iteración**», que no existe en la
ISO 25010 ni en la lámina 20 de la U07 («capacidad de interacción»). Además, el comentario del 02/11
en la misma tarjeta dice que está mal.
*Sin cambiar la decisión del orden:* como mínimo, corregir la palabra a «Facilidad de
**Interacción**», salvo que la lista del equipo venga literal de la profesora.

---

## 3. Minutas y retrospectiva

| Tarjeta | Asistentes | Temas | Acuerdos | Responsables con fecha | Checklist | Estado |
|---|---|---|---|---|---|---|
| Reunión 1 (05/10) · Samuel | ✔ 5 | ✔ 2 | ✔ 4 | ⚠ solo el acuerdo 1 (M2) | 4/4 | Completa, con un detalle |
| Reunión 2 (09/10) · Aaron | ✘ «por completar» | ✘ | ✘ «por completar» | ✘ | 0/4 | **Vacía**, y marcada completada (O1) |
| Reunión 3 (13/10) · German | ✔ 5 + la profesora | ✔ 5 | ✔ 6 | ⚠ acuerdo 6 «(pendiente)» sin fecha (M1) | 4/4 | Completa, con un detalle |
| Reunión 4 (01/11) · Sebastian | ✘ «por completar» | ✘ | ✘ «por completar» | ✘ | 0/4 | **Vacía** (O2) |
| Retrospectiva (16/10) · Manuel | ✘ | ✘ | ✘ | ✘ | 0/3 | **Vacía**, solo la descripción (O3) |

---

## 4. Tareas sin marcar por integrante

Fuente: tarjeta «Segunda Entrega · Documentación del Sprint 1», comparada con el estado real.

| Integrante | Tarea sin marcar | Estado real | Otro pendiente que no es de las HU |
|---|---|---|---|
| **Samuel** | 5 · Revisar a Aaron (HU 4.1) | ✘ La HU 4.1 no tiene ningún comentario | — |
| **Aaron** | 4 · Minuta de la Reunión 2 | ✘ Vacía, pero la fecha está marcada completada | — |
| **German** | — (5/5) | ✔ Minuta R3 y revisión a Manuel hechas | Detalle de M1 en su minuta (acuerdo 6 sin fecha) |
| **Manuel** | 4 · Retrospectiva de la Iteración 1 | ✘ Vacía | ⚠ **La tarea 2 está marcada sin estar hecha**: la HU 8.1 no tiene adjuntos (B1) |
| **Sebastian** | 3 · Revisión final, envío y fusión de los PR | ◐ PR #49, #50 y #51 fusionados el 27/10; faltan la revisión y el envío | Comentario aclaratorio en RNF (O4); nombre de la tarjeta en el correo (O7) |
| **Sebastian** | 4 · Convocar la Reunión 4 y escribir su minuta | ✘ Vacía (hay borrador en el repo) | — |

La tarjeta «📦 Entrega 2 (12 pts)» **no tiene checklist**. Está en una lista archivada (M9).
La tarjeta RNF tiene su checklist en 5/5.

### Revisión cruzada (comentarios en las tarjetas de HU)

| Revisa → HU | ¿Comentario? | Cuándo (VET) | Nota |
|---|---|---|---|
| Samuel → 4.1 (Aaron) | ✘ **No** | — | La tarjeta no tiene ningún comentario |
| Aaron → 5.1 (German) | ✔ | 01/11, 8:15 p. m. | Completo, con 3 correcciones |
| German → 8.1 (Manuel) | ✔ | 02/11, 10:16 p. m. | Completo y detallado |
| Manuel → 9.1 (Sebastian) | ✔ | 02/11, 9:33 p. m. | Breve: «Nada por corregir» |
| Sebastian → 1.1 (Samuel) | ✔ | 02/11, 2:40 p. m. | Su punto 4 («quita los enlaces») ya no vale (O4) |

---

## 5. Checklist del correo (`correo_profesora.md`) con el estado real

| # | Ítem | Estado | Detalle |
|---|---|---|---|
| 1 | El tablero se llama «EQUIPO 87 3 · Radar de Estacionamientos UCAB», es público y la profesora es miembro; el enlace lleva ese nombre | ✔ | Comprobado en `board.json`: nombre, `permissionLevel: public`, la profesora es miembro (normal) y la URL coincide |
| 2 | Las 5 HU con checklist 5/5, tabla con Autor, diagrama PNG adjunto y enlace de viewer.diagrams.net | ✘ | 1.1 ✔ · 4.1 ✔ · 5.1 ✔ · 9.1 ✔ · **8.1 ✘** (0 adjuntos, sin tabla ni enlace, pero la checklist marca 5/5). En la 1.1, la 5.1 y la 8.1 el ítem de la checklist dice «no enlace» (O4) |
| 3 | Cada card con un solo verbo | ◐ | 1.1 «crear», 5.1 «consultar», 8.1 «activar», 9.1 «crear» ✔. En la 4.1 la card dice «quiero **ver**…» y el título dice «Actualizar»: lo resuelve quien revisa la HU |
| 4 | Diagramas con D-009 | — | No es de este informe (lo revisan las HU) |
| 5 | RNF en final: «El sistema debe…», característica y subcaracterística, número y unidad, prueba | ✔ con observaciones | Aplicar A1–A9 y decidir «Iteración/Interacción» (§2.1) |
| 6 | Reuniones 1–4 y retrospectiva con asistentes, temas, acuerdos y responsables con fecha | ✘ | R2, R4 y la retrospectiva están vacías. R1 y R3 tienen detalles menores (M1, M2) |
| 7 | Si una HU sigue sin especificar, quitarla de la lista del correo | ◐ | La 8.1 está especificada pero sin diagrama. Si Manuel no lo sube, ajustar la frase del correo (abajo) |

**Cambios al texto del correo:**
- `Los cuatro Requisitos No Funcionales están en la tarjeta «Especificación de Requisitos No Funcionales», en la etapa de Ejecución. Las minutas de nuestras reuniones están en Seguimiento y Control, y la retrospectiva en Cierre.`
- Solo si la HU 8.1 sigue sin diagrama al enviar: cambiar «con el diagrama de actividades adjunto»
  por «con el diagrama de actividades adjunto (el de la HU 8.1 está en preparación)». Lo mejor es no
  enviar hasta que esté.
- La frase sobre las minutas solo se puede enviar si antes se completan la R2, la R4 y la
  retrospectiva (O1–O3).

## Orden sugerido para hoy

1. Manuel: sube el diagrama, la tabla y el enlace de la HU 8.1 y escribe la retrospectiva.
2. Aaron: minuta de la Reunión 2. Samuel: comentario de revisión en la HU 4.1.
3. Sebastian: minuta de la Reunión 4; textos A1–A9 en la tarjeta RNF; comentario aclaratorio
   (O4 b); texto de las checklists de la 1.1, la 5.1 y la 8.1 (O4 a); M1 en la Reunión 3.
4. Marcar las fechas como completadas solo donde el trabajo esté hecho (M3). Enviar el correo con
   el nombre real de la tarjeta de RNF.
