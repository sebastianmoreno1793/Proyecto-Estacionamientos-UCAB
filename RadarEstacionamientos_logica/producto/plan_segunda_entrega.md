# Plan de la Segunda Entrega · mar 03/nov/26 (12 pts)

**Estado:** 🟢 Vigente — repartido el 27/oct/26 por Sebastian. Cada integrante tiene **cinco
tareas**, la misma carga. Las tareas están como Issue en GitHub (milestone «Entrega 2 (03/nov)»)
y en Trello, en la tarjeta «Segunda Entrega · Documentación del Sprint 1».

Qué pide la profesora: `../negocio/modulo7/README.md` › Segunda Entrega. Cómo se califica:
card con un solo verbo (1 pt) + diagrama de actividades (3 pts, cada error resta 1) + 4 RNF
(2 pts c/u) = **12**.

## Reparto

| Integrante | 1 · Especifica (Trello) | 2 · Diagrama de actividades | 3 · Redacta | 4 · Registra | 5 · Revisa a |
|---|---|---|---|---|---|
| Samuel | HU 1.1 Crear cuenta con el correo institucional | HU 1.1 | RNF 4 · Seguridad → confidencialidad | Minuta de la Reunión 1 (05/oct) | Aaron (HU 4.1) |
| Aaron | HU 4.1 Actualizar el aforo con cada entrada o salida | HU 4.1 | RNF 3 · Fiabilidad → tolerancia a fallos | Minuta de la Reunión 2 (09/oct) | German (HU 5.1) |
| German | HU 5.1 Consultar los estacionamientos en el mapa del campus | HU 5.1 | RNF 1 · Eficiencia de desempeño → comportamiento temporal | Minuta de la Reunión 3 (13/oct) | Manuel (HU 8.1) |
| Manuel | HU 8.1 Activar las notificaciones | HU 8.1 | RNF 2 · Capacidad de interacción → auto-descriptividad | Retrospectiva de la Iteración 1 (tarjeta de Cierre) | Sebastian (HU 9.1) |
| Sebastian | HU 9.1 Crear una incidencia | HU 9.1 | Revisión final con la checklist y envío del correo | Convoca y escribe la minuta de la Reunión 4 | Samuel (HU 1.1) |

Sebastian, además, fusiona los PR #49, #50 y #51, para que la documentación y la maqueta queden
en `main` (los commits y las fusiones los hace él).

## Fechas

| Cuándo | Qué |
|---|---|
| **jue 29/oct** | Borrador de la especificación en la tarjeta de tu HU (las 3 partes) |
| **sáb 31/oct** | Diagrama de actividades adjunto (PNG o PDF) y RNF redactado en la tarjeta «Requisitos No Funcionales» |
| **dom 01/nov** | **Reunión 4** (virtual, la convoca Sebastian): revisión cruzada con la checklist de abajo |
| **lun 02/nov** | Correcciones de la revisión. Minutas y retrospectiva escritas |
| **mar 03/nov** | Sebastian revisa todo y manda el enlace del tablero «EQUIPO 87 3» a mperezpu@ucab.edu.ve antes de clase |

## Cómo se hace cada cosa

### 1 · Especificación de la HU (en Trello, como actividad de la tarjeta)

Va en la checklist «Especificación ERS · Segunda Entrega» de tu tarjeta y el texto en la
descripción, con las tres partes de la Plantilla ERS Ágil v2.0:

1. **Historia de Usuario (Card):** «Como <quién> quiero <qué> para <para qué>». **Un solo verbo**
   en el «quiero» (vale 1 punto).
2. **Conversación:** épica de la que viene · escenario de uso (los pasos, como un diálogo entre la
   persona y el sistema) · reglas de negocio · alcance (qué NO entra) · dependencias · restricciones.
3. **Criterios de aceptación:** tres, que se puedan comprobar.

Escribe «Especificada por: <tu nombre>» y marca las casillas solo cuando el texto esté.

### 2 · Diagrama de actividades (3 pts: cada error resta 1)

- Sale del **escenario de uso** de tu Conversación: cada paso es una acción.
- Un solo nodo de inicio; uno o varios de fin.
- **Carriles:** la persona (conductor, administrador…) y el Sistema.
- Acciones con **verbo** («Elige el estacionamiento», «Registra la incidencia»).
- Cada decisión (◇) con sus **guardas entre corchetes** ([OK] / [cancelar]) y su unión.
- Se adjunta a la tarjeta como **imagen PNG o PDF**. Nada de enlaces a draw.io ni a Lucidchart.
- Si tu HU usa el semáforo, respeta ⭐ D-009: hay puesto (verde) o no hay puesto (rojo).

### 3 · RNF (2 pts c/u)

En la tarjeta «Requisitos No Funcionales (ERS §2)» está la propuesta de cada uno. Tu trabajo es
dejarlo **final**:
- Una frase declarativa: «El sistema debe…».
- La característica y la **subcaracterística ISO 25010** (ver `../negocio/modulo7/laminas/U07_especificacion_requisitos.md`).
- **Medible y testeable:** con número y unidad, para que un probador pueda hacer un caso de prueba.
- Que salga de su **rango de calidad del Brief**.

### 4 · Minuta o retrospectiva (la profesora preguntó dos veces si nos reunimos)

En la tarjeta de la reunión, completa la checklist «Minuta»: **asistentes, temas, acuerdos y
responsables con fecha**. La retrospectiva lleva qué salió bien, qué no y qué cambiamos en el
Sprint 2.

### 5 · Revisión cruzada (en la Reunión 4)

Revisa la HU de tu compañero con esta checklist y déjale un comentario en su tarjeta:
- [ ] La card tiene un solo verbo.
- [ ] La Conversación tiene las seis partes.
- [ ] Hay tres criterios y se pueden comprobar.
- [ ] El diagrama tiene inicio, fin, carriles, verbos y guardas en cada decisión.
- [ ] El diagrama es una imagen o un PDF adjunto, no un enlace.
- [ ] Usa los nombres del Brief aprobado (los mismos de Trello y GitHub).

## Después: Tercera Entrega (10–12/nov, defensa del Sprint 1)

Cada uno defiende **su código**. Ya hay base en `main` (HU 5.1, 5.4 y 9.1) y en los PR #49 y #51:
la API, el semáforo, la maqueta y las incidencias. Lo que le toca a cada uno se reparte en la Reunión 4:
- **Samuel:** HU 1.1 y 2.1, sin código todavía. El inicio de sesión real bloquea el despliegue.
- **Aaron:** revisar y hacer suyas las HU 3.1, 3.2, 4.1 y 4.2 (PR #49 y #51).
- **German:** PR #44 (HU 6.1) con el nombre del Brief.
- **Manuel:** PR #45 (HU 8.1) sin su `sw.js` (D-008), y la HU 7.2.
- **Sebastian:** la pantalla de administración (P2 de la crítica de `impeccable`) y la HU 9.1.
