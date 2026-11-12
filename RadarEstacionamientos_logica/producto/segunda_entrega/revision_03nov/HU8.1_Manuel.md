# Revisión · HU 8.1 · Activar las notificaciones (Manuel Rosales)

Revisión hecha el 03/nov/26 sobre la foto del tablero de las ~12:00 p. m. (`tarjeta.md` y `board.json`),
el repo de lógica y el repo de código (solo lectura). Horas en hora de Venezuela (UTC−4).

## Veredicto

**No está lista:** la card está bien, pero no hay diagrama ni tabla. Si se entrega así: **1 / 4**
(especificación 1/1 por la card con un solo verbo · diagrama 0/3 porque no hay diagrama).
Con las correcciones de abajo puede llegar a **4 / 4**.

## Lo que se comprobó

- **La tarjeta no tiene adjuntos.** En `board.json`: `attachments: []`, `badges.attachments: 0`,
  sin portada (`idAttachmentCover` vacío). Las acciones de la tarjeta muestran que todo lo que subió
  Manuel se borró:

  | Cuándo (VET) | Acción | Archivo |
  |---|---|---|
  | 02/nov 1:54 a. m. | addAttachmentToCard | `diagrama_actividades_HU8.1.png` |
  | 02/nov 1:55 a. m. | marca «Diagrama de actividades adjunto…» | — |
  | 02/nov 8:56 p. m. | addAttachmentToCard | `HU 8.1 · Activar las notificaciones web.docx` |
  | 02/nov 8:57 p. m. | deleteAttachmentFromCard | `diagrama_actividades_HU8.1.png` |
  | 02/nov 8:58 p. m. | deleteAttachmentFromCard | el `.docx` |
  | 02/nov 9:12 p. m. | addAttachmentToCard | `HU 8.1.Activar las Notificaciones.drawio.png` |
  | 02/nov 9:12 p. m. | updateCard (desc): épica, paso 5 y CA1–CA2 | — |
  | 02/nov 9:45 p. m. | deleteAttachmentFromCard | `HU 8.1.Activar las Notificaciones.drawio.png` |
  | 02/nov 9:45 p. m. | marca «Especificar · Criterio de aceptación 1, 2 y 3» | — |

  La descripción **no tiene ningún enlace** a viewer.diagrams.net. Como los PNG se borraron, no pude
  ver el último diagrama; los errores del anterior salen de los comentarios de la tarjeta y de
  `revision_y_propuestas_02nov.md`.
- **Código (rama `origin/hu-8.1-notificaciones`, PR #45, sin fusionar):** `GestorNotificaciones` pide
  el permiso; con «Permitir» guarda `activadas` y muestra **una** notificación de prueba; con
  «Bloquear» guarda `bloqueadas` y no la muestra; si el conductor **cierra la ventana sin responder**
  no guarda nada (hay prueba para cada caso). No hay opción para desactivar ni para reactivar dentro
  del Radar, y en `main` no hay «perfil» (el menú solo tiene «Mis vehículos» y «Salir»). Cuando el
  permiso está bloqueado, el botón dice que hay que cambiarlo en los ajustes del navegador.
- **D-008 (la app es una PWA):** las notificaciones de la 8.1 van por el único service worker,
  `public/sw.js`, que ya tiene en `main` los manejadores `push` y `notificationclick`. Por eso los
  detalles técnicos (API de notificaciones, service worker) son **restricciones**, no reglas de negocio.
- **Brief (Mapa de Impacto, `correcciones_brief_profesora.md`):** la HU 8.1 está en la meta
  **«Llegar a clase a tiempo»**, cuyo impacto es «llegan más rápido a su salón». La épica 8 en el Brief
  es **«Sugerencia y notificaciones»** y sus HU de R2 son 8.2 Aviso en la garita y 8.3 Abrir mapa
  sugerido. La palabra **«emergencias» no aparece** en ningún documento del repo de lógica.

## Hallazgos (por gravedad)

| # | Grav. | Pts en riesgo | Dónde | Hallazgo | Corrección |
|---|---|---|---|---|---|
| 1 | 🔴 | 3 (diagrama) | Adjuntos y descripción | **No hay diagrama de actividades:** ni PNG ni enlace de viewer.diagrams.net. Sin diagrama, 0/3. | Hacer el diagrama de la sección «Diagrama correcto», exportarlo a PNG (Archivo › Exportar como › PNG, sin nada seleccionado) y poner el enlace (Archivo › Exportar como › URL). Probar el enlace en una ventana privada. |
| 2 | 🟠 | credibilidad | Checklist ERS | El ítem «Diagrama de actividades adjunto…» está **marcado sin diagrama** (lo marcó el 02/nov 1:55 a. m. y luego borró el PNG). | Desmarcarlo hasta subir el PNG y el enlace. |
| 3 | 🟠 | formato del equipo | Adjuntos | **Falta la tabla de 3 columnas** con «Autor: Rosales, Manuel» arriba. | Armarla con el texto de la sección «Contenido de la tabla» y subirla como portada, como en la 9.1. |
| 4 | 🟠 | 1 pt de diagrama si no coinciden | Conversación › escenario | El **paso 5** («Si las desactiva el sistema actualiza su estado») es ambiguo: no dice quién desactiva, dónde ni a qué estado pasa. El paso 4 («Si acepta…») mete una condición en el flujo básico. Los flujos alternos no están escritos como alternos. El paso 2 junta tres acciones y usa jerga («estado 'default'», «autorización nativa»). Dice «usuario» y la card dice «conductor». | Usar el escenario corregido: «Bloquear» pasa a ser el alterno 3.1/3.2 y el flujo básico sigue con 4, 5 y 6. |
| 5 | 🟠 | — | Reglas de negocio | **RN1 es técnica** (API de Notificaciones, Service Workers, estado `'activadas'`). Es la única regla. | Pasar lo técnico a Restricciones y escribir tres reglas de negocio (RN1–RN3, abajo). |
| 6 | 🟠 | — | Criterios | **CA1 tiene la frase rota:** «…queda como `activadas`, **queda registrado** y se muestra…» (al quitar `/sw.js` quedó sin sujeto). Además usa `activadas` y «permiso predeterminado» (jerga). | Ver CA1 corregido. |
| 7 | 🟠 | — | Criterios | **CA2 junta dos casos** (deniega ahora / ya lo tenía denegado) y nombra «la campana», que no aparece en el escenario. | Separarlos: el caso de «Bloquear» es el CA2 y el de «ya respondió» es el CA3. Quitar «la campana». |
| 8 | 🟠 | — | Criterios | **CA3 junta dos acciones** (desactivar y reactivar), no sale del escenario y no existe en el código: dentro del Radar no hay opción para desactivar. Mezcla «desactivada» con «bloqueada». | Sacarlo y pasarlo al Alcance. El nuevo CA3 prueba la RN1 (no se vuelve a preguntar). |
| 9 | 🟠 | trazabilidad | Card › «para» | «…recibir avisos **en tiempo real** sobre la disponibilidad de estacionamientos **y emergencias**». Las emergencias no están en el Brief ni en el backlog, y «en tiempo real» es un requisito de desempeño, no de esta HU. | «…para recibir los avisos del Radar sobre los puestos libres y llegar a tiempo a clase» (meta «Llegar a clase a tiempo»). El «quiero» sigue con un solo verbo. |
| 10 | 🟠 | — | Descripción | Nombra «diagrama\_actividades\_HU8.1.png», que **no existe** (se borró el 02/nov 8:57 p. m.). | Cambiar la línea por el enlace del diagrama y el nombre real del PNG nuevo. |
| 11 | 🟡 | — | Checklist ERS | El último ítem tiene el **texto viejo**: «…como imagen o PDF (no enlace a la herramienta de diagramación)». | Renombrarlo a «Diagrama de actividades adjunto como imagen y con enlace de draw.io que abre sin pasos previos», como en la 9.1. |
| 12 | 🟡 | — | Dependencias | «API de notificaciones del navegador» es técnica. Falta decir de qué HU es base. | Moverla a Restricciones. Agregar D-008 y que es la base de la 8.2 y la 8.3. |
| 13 | 🟡 | — | Alcance | Tiene un solo ítem («Envío de notificaciones reales»). | Ver el Alcance corregido: avisos reales (8.2 y 8.3), desactivar y reactivar desde el perfil. |
| 14 | 🟡 | — | Descripción | Falta «**Autor:** Rosales, Manuel» (formato del equipo; la 9.1 lo tiene). | Agregarlo debajo del título de la especificación. |
| 15 | 🟡 | decisión | Criterio de la Iteración 1 (Issue #10) | Dice «si no acepta, puede activarlas después **desde su perfil**». No hay perfil en `main`, y un navegador no vuelve a preguntar cuando el permiso ya está bloqueado. | En el texto propuesto el sistema le indica cómo activarlas **desde la configuración del navegador**, y el perfil queda en el Alcance. Manuel lo confirma con Sebastian; si el equipo quiere el perfil, hay que agregarlo al escenario y al diagrama. |
| 16 | 🟡 | — | Restricciones | Falta la restricción del iPhone: allí las notificaciones web solo funcionan si el Radar está instalado en la pantalla de inicio (D-008). | Agregarla (comprobarla en un iPhone antes de la defensa). |

## Texto corregido de la especificación (listo para pegar en la descripción)

> Arriba van la imagen de la tabla, el enlace del diagrama y la imagen del diagrama, como en la 9.1.
> Cambia `<ENLACE_VIEWER>` por el enlace de Archivo › Exportar como › URL.

```markdown
![HU 8.1 · Especificación](<se pega sola al subir la tabla como portada>)

**Diagrama de actividades:** [Ver diagrama de actividades de la HU 8.1](<ENLACE_VIEWER>)

![HU 8.1 · Diagrama de actividades](<se pega sola al subir diagrama_actividades_HU8.1.png>)

---

**Responsable:** Manuel Rosales
**Épica:** 8 · **Release:** R1

**Criterio de aceptación:**
Al iniciar sesión, el sistema pide permiso para enviar notificaciones. Si el usuario acepta, recibe una notificación de prueba; si no acepta, puede activarlas después desde su perfil.

**Issue en GitHub:** https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/10

## Especificación ERS · Segunda Entrega

**Autor:** Rosales, Manuel

### 1. Historia de Usuario (Card)

**Como** conductor de la comunidad UCAB (estudiante o profesor), **quiero activar** las notificaciones del Radar, **para** recibir los avisos sobre los puestos libres y llegar a tiempo a clase.

### 2. Conversación

**Épica:** 8 · Sugerencia y notificaciones (R1). Viene de la meta «Llegar a clase a tiempo» del Mapa de Impacto: los estudiantes y profesores llegan más rápido a su salón.

**Escenario de uso:**

Antes de empezar: el conductor todavía no ha respondido la solicitud de notificaciones en ese navegador (RN1).

1. El conductor inicia sesión con su correo institucional (HU 1.1).
2. El sistema le muestra la solicitud del navegador para permitir las notificaciones del Radar.
3. El conductor responde la solicitud: pulsa «Permitir» o «Bloquear».
   - 3.1 Si pulsa «Bloquear», el sistema registra sus notificaciones como bloqueadas y no le envía la notificación de prueba.
   - 3.2 El sistema le indica cómo activarlas después desde la configuración de su navegador, y termina.
4. El sistema registra sus notificaciones como activadas.
5. El sistema le envía una sola notificación de prueba.
6. El conductor ve la notificación de prueba.

**Reglas de negocio:**

- RN1. La solicitud se muestra al iniciar sesión, y solo mientras el conductor no la haya respondido con «Permitir» o «Bloquear». Si la cierra sin responder, se le vuelve a mostrar en el próximo inicio de sesión.
- RN2. La notificación de prueba se envía una sola vez y solo si el conductor pulsa «Permitir».
- RN3. Si el conductor bloquea las notificaciones, el Radar no le envía ningún aviso hasta que él las permita en la configuración de su navegador.

**Alcance (lo que NO entra en esta historia):**

- Enviar los avisos reales de puestos libres: HU 8.2 · Aviso en la garita y HU 8.3 · Abrir mapa sugerido (R2).
- Desactivar o volver a activar las notificaciones desde el perfil.
- Elegir qué avisos recibir.

**Dependencias:**

- HU 1.1 · Crear cuenta con el correo institucional (para la sesión).
- D-008 · El Radar es una app web instalable: las notificaciones se muestran a través de ella.
- Es la base de las HU 8.2 y 8.3.

**Restricciones:**

- Solo el Campus Montalbán.
- Solo por navegador web, en computador y en celular (D-003, D-008).
- Sin costos adicionales (D-005).
- El navegador debe permitir notificaciones web. En iPhone, solo funcionan si el Radar está instalado en la pantalla de inicio (D-008).
- Si el conductor bloqueó las notificaciones, el Radar no puede volver a pedírselas: solo él puede permitirlas desde la configuración de su navegador.

### 3. Criterios de aceptación

1. **Dado** un conductor que inicia sesión y todavía no ha respondido la solicitud de notificaciones, **cuando** pulsa «Permitir», **entonces** el sistema registra sus notificaciones como activadas y le envía una sola notificación de prueba.
2. **Dado** un conductor que inicia sesión y todavía no ha respondido la solicitud de notificaciones, **cuando** pulsa «Bloquear», **entonces** el sistema registra sus notificaciones como bloqueadas, no le envía la notificación de prueba y le indica cómo activarlas desde la configuración de su navegador.
3. **Dado** un conductor que ya respondió la solicitud con «Permitir» o «Bloquear», **cuando** vuelve a iniciar sesión en el mismo navegador, **entonces** el sistema no le muestra la solicitud otra vez ni le envía otra notificación de prueba.

**Diagrama de actividades:** [Ver diagrama de actividades de la HU 8.1](<ENLACE_VIEWER>) (y la imagen adjunta, diagrama_actividades_HU8.1.png).
```

Por qué así:

- Los números del escenario son los que pidió el grupo: «Registra… bloqueadas» es el alterno
  **3.1** y la notificación de prueba es la continuación **5**.
- El caso «ya respondió» va como condición previa y RN1, y no como rombo en el paso 2. Así el
  diagrama tiene **un solo rombo** y menos lugares donde perder puntos. El CA3 prueba esa regla.
- Cada regla tiene un criterio que la prueba: RN1 → CA3, RN2 → CA1 y CA2, RN3 → CA2.
- Todo cuadra con el código del PR #45: hay un caso para «Permitir», otro para «Bloquear» y otro
  para «cierra sin responder» (no guarda nada), y la notificación de prueba es una sola.

## Contenido de la tabla (3 columnas, como la de la 9.1)

**Encima de la tabla:**
**HU 8.1 · Activar las notificaciones**
Autor: Rosales, Manuel

**Encabezados:** 1 Historia de Usuario | 2 Conversación | 3 Criterios de Aceptación

**Columna 1 · Historia de Usuario**
> Como conductor de la comunidad UCAB (estudiante o profesor), **quiero activar** las notificaciones
> del Radar para recibir los avisos sobre los puestos libres y llegar a tiempo a clase.

**Columna 2 · Conversación**
> **Épica:** 8 · Sugerencia y notificaciones (R1), de la meta «Llegar a clase a tiempo» del Mapa de Impacto.
>
> **Escenario de uso** (antes de empezar: el conductor no ha respondido la solicitud en ese navegador):
> 1. El conductor inicia sesión con su correo institucional.
> 2. El sistema le muestra la solicitud del navegador para permitir las notificaciones.
> 3. El conductor responde: pulsa «Permitir» o «Bloquear».
>    3.1 Si pulsa «Bloquear», el sistema registra sus notificaciones como bloqueadas y no envía la prueba.
>    3.2 El sistema le indica cómo activarlas desde la configuración de su navegador.
> 4. El sistema registra sus notificaciones como activadas.
> 5. El sistema le envía una sola notificación de prueba.
> 6. El conductor ve la notificación de prueba.
>
> **Reglas de negocio:** la solicitud se muestra al iniciar sesión solo mientras el conductor no la haya
> respondido (si la cierra sin responder, se le vuelve a mostrar); la notificación de prueba se envía una
> sola vez y solo si pulsa «Permitir»; si las bloquea, el Radar no le envía avisos hasta que él las permita
> en su navegador.
>
> **Alcance:** no incluye los avisos reales de puestos libres (HU 8.2 y 8.3), desactivar o reactivar las
> notificaciones desde el perfil ni elegir qué avisos recibir.
>
> **Dependencias:** HU 1.1 · Crear cuenta con el correo institucional; el Radar como app web instalable
> (D-008). Es la base de las HU 8.2 y 8.3.
>
> **Restricciones:** solo el Campus Montalbán; solo navegador web, en computador y en celular; sin costos
> adicionales; el navegador debe permitir notificaciones web (en iPhone, con el Radar instalado en la
> pantalla de inicio); si las bloqueó, solo él puede permitirlas desde la configuración de su navegador.
>
> **Diagrama de actividades:** ver enlace en la descripción de la tarjeta.

**Columna 3 · Criterios de Aceptación**
> 1. Si el conductor todavía no ha respondido la solicitud y pulsa «Permitir», el sistema registra sus
>    notificaciones como activadas y le envía una sola notificación de prueba.
> 2. Si el conductor todavía no ha respondido la solicitud y pulsa «Bloquear», el sistema registra sus
>    notificaciones como bloqueadas, no le envía la notificación de prueba y le indica cómo activarlas
>    desde la configuración de su navegador.
> 3. Si el conductor ya respondió la solicitud, al volver a iniciar sesión en el mismo navegador el
>    sistema no se la muestra otra vez ni le envía otra notificación de prueba.

Formato: fondo blanco, encabezados en gris claro y negrita, letra sin serifa. Exportar como PNG
(no una captura) con el nombre `HU 8.1 · Especificación.png` y ponerlo como portada de la tarjeta.

## Diagrama correcto (para dibujar en draw.io)

**Título** (arriba, fuera de los carriles):
`HU 8.1 · Activar las notificaciones — Diagrama de Actividades — Autor: Rosales, Manuel`

**Carriles:** dos, con cabecera azul claro: **«Conductor (estudiante o profesor)»** a la izquierda y
**«Sistema»** a la derecha.
- **No hace falta un carril «Navegador».** La ventana de permiso es el medio con el que el Sistema
  pregunta; el navegador no hace nada por su cuenta (en la 4.1 el sensor sí actúa solo, por eso tiene
  carril). Un tercer carril solo agrega flechas y dudas sobre quién decide.

**Nodos, en orden de arriba abajo:**

1. **Inicio** (círculo negro) en el carril del Conductor, con nota amarilla unida por línea punteada:
   «Se inicia el Caso de Uso».
2. **`1) Inicia sesión con su correo institucional`** (Conductor).
3. Flecha al carril del Sistema → **`2) Muestra la solicitud para permitir las notificaciones`** (Sistema).
4. Flecha de vuelta al carril del Conductor → **`3) Responde la solicitud`** (Conductor). Esta es la
   acción que faltaba antes del rombo.
5. Flecha de `3)` a un **rombo en el carril del Sistema**: el conductor pulsa y el sistema verifica la
   respuesta. El rombo recibe **una sola** flecha (la de `3)`).
6. **Salida [Bloquear]** del rombo (hacia un lado, dentro del carril del Sistema):
   - **`3.1) Registra las notificaciones como bloqueadas`** (Sistema), con flecha **punteada** al nodo
     objeto (rectángulo) **«Preferencia de notificaciones»**.
   - → **`3.2) Indica cómo activarlas desde el navegador`** (Sistema).
   - → **Fin** (círculo con anillo) con nota «Finaliza el Caso de Uso».
7. **Salida [Permitir]** del rombo (hacia abajo, en el carril del Sistema):
   - **`4) Registra las notificaciones como activadas`** (Sistema), con flecha punteada al mismo nodo
     objeto «Preferencia de notificaciones» (o a uno propio a su lado).
   - → **`5) Envía una notificación de prueba`** (Sistema), con flecha punteada al nodo objeto
     **«Notificación de prueba»** (opcional).
   - Flecha al carril del Conductor → **`6) Ve la notificación de prueba`** (Conductor).
   - → **Fin** con nota «Finaliza el Caso de Uso».

**Reglas que hay que cumplir** (cada error resta 1 punto):

- Los números del diagrama son **los mismos** del escenario (1, 2, 3, 3.1, 3.2, 4, 5, 6), con un
  **espacio** después del paréntesis: `3) Responde…`, no `3)Responde…`.
- Cada acción **empieza con verbo** y está **dentro** del carril de quien la hace, nunca sobre la
  línea entre carriles.
- Las guardas van **entre corchetes** y en las dos salidas del rombo: `[Permitir]` y `[Bloquear]`.
- **No hay uniones** en este escenario: los dos caminos terminan cada uno en su fin, así que no hace
  falta barra ni conectores. Si algún día un alterno vuelve al flujo básico, se une con **barra negra
  y conectores numerados** (1, 2…, distintos de los números de los pasos), nunca con un rombo que
  reciba dos flechas.
- Las flechas a los nodos objeto son **punteadas**.
- No hay semáforo en esta HU, así que D-009 no aplica.

**Errores del diagrama anterior que no hay que repetir** (de los comentarios de Sebastian del 02/nov
y del mensaje del grupo; el PNG ya no está en la tarjeta):

1. Era una **captura de draw.io en modo edición**: puntos azules de selección, flechas celestes,
   título cortado y media imagen en blanco. → Exportar con Archivo › Exportar como › PNG, con nada
   seleccionado.
2. El **rombo [Bloquear] / [Permitir] estaba en el carril del usuario** y sin una acción antes. → El
   rombo va en el carril del Sistema, después de `3) Responde la solicitud`.
3. **«5) Registra preferencias como bloqueadas» estaba sobre la línea entre carriles**, y además era
   un alterno numerado como paso del flujo básico. → `3.1)` dentro del carril del Sistema.
4. **«4.1) Envía notificación de prueba» era la continuación** del flujo básico, no un alterno. → `5)`.
5. **La numeración iba 2.1, 6, 3, 4, 5** y no seguía el escenario. → La de arriba.
6. **El título decía «Sistema de Notificaciones Web Push y Preferencias».** → El título de arriba,
   con el nombre del Brief y el autor.
7. **Faltaba el espacio después del número.** → `3) Responde`.

**Cómo publicarlo:**

- PNG: Archivo › Exportar como › PNG (zoom 100 % o 200 %, fondo blanco), con el nombre
  `diagrama_actividades_HU8.1.png`, adjunto a la tarjeta.
- Enlace: Archivo › Exportar como › URL. Debe empezar por `https://viewer.diagrams.net/?…#R…`, como
  el de la 9.1. Pruébalo en una ventana privada: tiene que abrir sin iniciar sesión.

## Checklist de la tarjeta

| Ítem | Estado hoy | Qué hacer |
|---|---|---|
| Especificar · Criterio de aceptación 1, 2 y 3 | ✔ Marcados (02/nov, 9:45 p. m.) | Nada. Ya se hizo lo que pidió el grupo. |
| ERS · Especificada por / 1 / 2 / 3 | ✔ Marcados | Dejarlos marcados después de pegar el texto corregido. |
| ERS · «Diagrama de actividades adjunto como imagen o PDF (no enlace…)» | ✘ Marcado **sin diagrama** y con el **texto viejo** | Renombrarlo a «Diagrama de actividades adjunto como imagen y con enlace de draw.io que abre sin pasos previos» y marcarlo **solo** cuando estén el PNG y el enlace. |

## Estado de los puntos del mensaje del grupo que le tocan a Manuel

| # | Punto | Estado | Nota |
|---|---|---|---|
| 1 | *(Para todos)* enlace de viewer.diagrams.net en la descripción, además del PNG | ❌ Pendiente | No hay ni enlace ni PNG. |
| 2 | *(Para todos)* tabla de 3 columnas con el Autor | ❌ Pendiente | Sin adjuntos. El contenido está arriba. |
| 3 | Falta la tabla y el enlace del diagrama | ❌ Pendiente | Igual que 1 y 2. |
| 4 | La descripción dice «diagrama_actividades_HU8.1.png» pero el adjunto tiene otro nombre | ❌ Pendiente y peor | Ahora no hay ningún adjunto; la descripción sigue nombrando el PNG borrado. |
| 5 | RN1 es técnica: va en Restricciones | ❌ Pendiente | Sin cambios desde el 02/nov 2:32 a. m. |
| 6 | Paso 5 del escenario ambiguo | ❌ Pendiente | El 02/nov 9:12 p. m. lo cambió de «Si las desactiva o gestiona manualmente…» a «Si las desactiva el sistema actualiza su estado». Sigue ambiguo. |
| 7 | Diagrama: rombo en el carril del Sistema; «5) Registra… bloqueadas» → 3.1; «4.1) Envía notificación de prueba» → 5; espacio después del número | ❌ No se puede comprobar | No hay diagrama en la tarjeta. Seguir la descripción de arriba. |
| 8 | Marcar en la checklist «Especificar · Criterio 1, 2 y 3» | ✔ Hecho | Marcados el 02/nov a las 9:45 p. m. |

Otros puntos de las revisiones de German y Sebastian:
- ✔ Épica con el nombre del Brief: corregida a «Sugerencia y notificaciones» (02/nov, 9:12 p. m.).
- ⚠ Términos técnicos en los criterios: quitó `default` y `/sw.js`, pero quedan `activadas`
  y «predeterminado», y la frase del CA1 quedó rota.
- ❌ Separar los casos del CA2 y las dos acciones del CA3: pendiente.
