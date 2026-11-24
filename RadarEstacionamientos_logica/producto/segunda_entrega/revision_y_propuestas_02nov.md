# Revisión del equipo y propuestas para Trello · lun 02/nov/26

**Estado:** 🟢 Aprobado por Sebastian y subido a Trello el 02/nov/26 (puntos 1, 2, 3 y 5 de §4;
también se ajustó la última línea de la descripción de la HU 9.1 al nombre del v2). Falta el punto 4,
la minuta de la Reunión 4.
Foto del tablero «EQUIPO 87 3» del 02/nov/26, 2:25 p.m. (JSON público del tablero y adjuntos).

## 1. Quién hizo qué (desde la revisión del 01/nov a mediodía)

| Integrante | Qué subió | Cuándo | Falta |
|---|---|---|---|
| **Samuel** | HU 1.1 especificada (Card, Conversación, 3 criterios) + diagrama PNG · RNF 4 Confidencialidad con su prueba · Minuta de la Reunión 1 completa | 01/nov, 5:34 p.m. – 11:07 p.m. | Revisar a Aaron (HU 4.1) |
| **Aaron** | HU 4.1 especificada + diagrama PNG (v2) · RNF 3 Tolerancia a fallos con su prueba · Revisó a German (comentario en la HU 5.1) | 01/nov 11:13 p.m. – 02/nov 12:16 a.m. | Minuta de la Reunión 2 |
| **German** | Corrigió la HU 5.1 (OpenStreetMap, borde punteado, «Gestión de Puestos», nodo separado) + diagrama v2 · RNF 1 con perfil de red fijo (9 / 1,5 Mbps, 60 ms) | 02/nov, 12:09 – 12:16 a.m. | Minuta de la Reunión 3 · revisar a Manuel · los 3 detalles que le marcó Aaron |
| **Manuel** | HU 8.1 especificada + diagrama PNG · **reescribió el RNF 2** | 02/nov, 1:54 – 6:46 a.m. | Retrospectiva · revisar a Sebastian |
| **Sebastian** | HU 9.1 y diagrama (01/nov) · **diagrama rehecho hoy con el modelo del equipo** | — | Revisión final y correo · minuta de la Reunión 4 · revisar a Samuel |

Las cinco HU tienen especificación y diagrama. Siguen vacías: las minutas de las Reuniones 2, 3 y 4
y la retrospectiva.

## 2. Mis tareas

### 2.1 Diagrama de la HU 9.1 (rehecho)

El de ayer usaba rombos de unión que reciben dos flechas. Aaron le marcó eso a German como error
(«en el modelo cada rombo recibe una sola flecha y los caminos se unen con la barra negra y
círculos numerados»), así que al nuestro le habrían restado puntos por lo mismo. El nuevo
(`diagrama_actividades_HU9.1.png` y `.pdf`) sigue el modelo de las HU 1.1, 4.1 y 5.1:

- Título con el autor, carriles con cabecera azul, notas «Se inicia / Finaliza el Caso de Uso».
- Pasos numerados igual que el escenario de uso (1 a 10, con 2.1, 2.2, 6.1 y 7.1).
- Cada rombo recibe una sola flecha; las uniones son barras con conectores ① y ②.
- Nodos objeto con flecha punteada: «Formulario de incidencia» e «Incidencia».

La especificación (`HU9.1_especificacion.md` y la descripción en Trello) no cambia.

### 2.2 Requisitos No Funcionales: texto final propuesto para la tarjeta

Hay dos problemas en la tarjeta de hoy, y uno es grave:

1. **Manuel reemplazó el RNF 2 a las 6:46 a.m.** El que estaba (el acordado: 9 de cada 10 usuarios
   reconocen un estacionamiento con puesto en 10 s) pasó a ser «retroalimentación visual en 0,2 s»
   al pulsar la campana. Eso mide **tiempo de respuesta** (comportamiento temporal), no
   auto-descriptividad, y no sale del rango del Brief («La información debe entenderse de un
   vistazo, utilizando los colores del semáforo y un lenguaje claro»). Así como está, probablemente
   pierde los 2 puntos.
2. **El RNF 3 dice «mostrarlo como sin datos»**, y el Brief dice «ocultar solo ese
   estacionamiento». Además: «Facilidad de Iteración» debe ser **Capacidad de interacción**, y el
   orden de las características no es el de la plantilla ERS §2.

Texto propuesto para reemplazar la descripción de la tarjeta (respeta lo que redactó cada uno):

---

**Requisitos No Funcionales · ERS §2 (Requisitos suplementarios)**

Los 4 RNF salen de los 4 rangos de calidad del Brief aprobado. Cada uno con su característica y
subcaracterística ISO 25010, medible y con su procedimiento de prueba.

**2.1 Eficiencia de desempeño**

**RNF 1 · Comportamiento temporal** — Redactado por: German Alfonzo
Rango de calidad del Brief: «El mapa debe cargarse y actualizarse en pocos segundos, para que el conductor decida antes de llegar al campus.»

El sistema debe mostrar el mapa del campus con todos los estacionamientos y su color en **3 segundos o menos**, medidos desde que el usuario abre el Radar hasta que se ven todos los estacionamientos con su color, con la red limitada a 9 Mbps de bajada, 1,5 Mbps de subida y 60 ms de latencia, en al menos 9 de cada 10 cargas; y debe reflejar un cambio de ocupación en **5 segundos o menos** después del aviso del sensor.

Cómo se prueba:
- Carga: en las herramientas del navegador, crear un perfil de red de 9 Mbps de bajada, 1,5 Mbps de subida y 60 ms de latencia, y abrir el Radar 10 veces. Se mide desde que se abre el Radar hasta que se ven todos los estacionamientos con su color. Al menos 9 de 10 cargas deben tardar 3 s o menos.
- Actualización: enviar 10 avisos de entrada desde el simulador de sensores y cronometrar cada uno. Los 10 cambios deben verse en 5 s o menos.

**2.2 Compatibilidad** — No aplica: el Brief no fija un rango de calidad para esta característica.

**2.3 Capacidad de interacción**

**RNF 2 · Auto-descriptividad** — Redactado por: Manuel Rosales
Rango de calidad del Brief: «La información debe entenderse de un vistazo, utilizando los colores del semáforo y un lenguaje claro.»

El sistema debe permitir que al menos **9 de cada 10** usuarios de prueba que nunca han usado el Radar, sin recibir instrucciones, identifiquen en **10 segundos o menos** un estacionamiento donde hay puesto, solo con el semáforo de dos estados (verde: hay puesto; rojo: no hay puesto) y su leyenda.

Cómo se prueba:
- Preparación: 10 estudiantes o profesores que no conocen el Radar. La maqueta muestra al menos un estacionamiento en verde y uno en rojo.
- Prueba: se abre el mapa y se le pregunta a cada uno «¿dónde puedes estacionar ahora?». Se cronometra desde que ve el mapa hasta que señala un estacionamiento. Nadie le explica los colores.
- Aceptación: al menos 9 de 10 señalan un estacionamiento en verde en 10 s o menos.

**2.4 Fiabilidad**

**RNF 3 · Tolerancia a fallos** — Redactado por: Aaron Zarraga
Rango de calidad del Brief: «Si un sensor falla, el sistema debe ocultar solo ese estacionamiento y seguir funcionando con los demás.»

Si un estacionamiento no recibe avisos de su sensor durante **10 minutos**, el sistema debe **ocultar la ocupación de solo ese estacionamiento** (deja de mostrar su color y lo marca «sin datos») y seguir actualizando los demás en 5 segundos o menos, en el **100 %** de las pruebas.

Cómo se prueba:
- Preparación: con el simulador de sensores activo, detener solo los avisos de un estacionamiento durante 10 minutos.
- Fallo aislado: al pasar los 10 minutos, ese estacionamiento ya no muestra su color (hay o no hay puesto) y aparece como «sin datos».
- Los demás siguen: enviar una entrada a otro estacionamiento y comprobar que su ocupación cambia en 5 s o menos.
- Se repite con 5 estacionamientos distintos y debe cumplirse en las 5 pruebas (100 %).

**2.5 Seguridad**

**RNF 4 · Confidencialidad** — Redactado por: Samuel Goncalves
Rango de calidad del Brief: «El sistema debe ser seguro con los datos: cada usuario solo accede a lo permitido para su rol, y las placas y los vehículos solo los ve su dueño y el personal autorizado.»

El sistema debe mostrar las placas y los vehículos registrados solo a su dueño y al personal con rol de vigilancia o administración: en el **100 %** de los intentos de un usuario sin ese rol de consultar los vehículos de otra persona, el sistema no muestra ninguna placa ajena y responde «acceso denegado».

Cómo se prueba:
- Preparación: crear dos cuentas de estudiante (A y B) y una con rol de vigilancia o administración. Con la cuenta B, registrar un vehículo.
- Acceso ajeno: con la cuenta A, intentar ver los vehículos de B (desde la pantalla de vehículos y buscando directamente la placa de B). El sistema debe responder «acceso denegado» y no mostrar ninguna placa de B.
- Acceso permitido: con la cuenta B (dueño) y con la cuenta de vigilancia o administración, consultar el mismo vehículo. Ahí sí debe mostrarse la placa.
- Se repite con 10 placas distintas y debe cumplirse en los 10 intentos (100 %).

**2.6 Mantenibilidad** — No aplica: el Brief no fija un rango de calidad para esta característica.
**2.7 Flexibilidad** — No aplica: el Brief no fija un rango de calidad para esta característica.
**2.8 Protección** — No aplica: el Brief no fija un rango de calidad para esta característica.

---

Cambios respecto de lo que hay hoy: orden y nombres de la plantilla ERS · rango del Brief citado en
cada uno · RNF 1: «9 de cada 10 cargas» también en la frase y 10 avisos en la prueba · RNF 2: vuelve
el texto acordado y se le agrega la prueba · RNF 3: «ocultar» como dice el Brief · RNF 4 sin cambios.

### 2.3 Mi revisión de Samuel (HU 1.1) — comentario para su tarjeta

> Revisión cruzada (Reunión 4), con la checklist del plan:
> ✔ La card tiene un solo verbo («quiero **crear** una cuenta»).
> ✔ Hay tres criterios y se pueden comprobar.
> ✔ Usa el nombre del Brief (HU 1.1 y épica «Gestión de perfiles»).
> ✔ El diagrama tiene inicio, fin, carriles, verbos y guardas, y está adjunto como imagen.
> Para corregir hoy (cada error del diagrama resta 1 punto):
> 1. **6.1 «Cancela el proceso de creación de cuenta» está en el carril del Sistema**, pero quien cancela es el estudiante: muévelo a su carril.
> 2. **El rombo después de «6) Presiona «Crear cuenta»»** tiene las guardas [Crear cuenta] / [Salir]; si ya presionó «Crear cuenta», no puede salir. Pon el rombo entre el 5 y el 6, con [Crear cuenta] / [Cancelar].
> 3. **Los conectores 6, 7, 8 y 9 tienen los mismos números que los pasos** (y el conector «6» vuelve al paso 5). Numéralos 1, 2, 3 y 4, como en la HU 4.1.
> 4. **Quita los enlaces a viewer.diagrams.net** de la descripción: la profesora pidió «nada de enlaces con las herramientas de diagramación». Ya está la imagen.
> 5. Conversación: el escenario de uso es una sola frase; escríbelo en pasos numerados iguales a los del diagrama (1 Abre el Radar … 13 Muestra el mapa del campus).

## 3. Lo que vi en los demás (para comentarles, no lo arreglo yo)

### Manuel · HU 8.1 — la de más riesgo

- **El PNG es una captura de draw.io en modo edición:** se ven los puntos azules de selección, las flechas celestes, el título cortado arriba y media imagen en blanco. Hay que exportarlo bien (Archivo › Exportar como › PNG, sin la selección).
- **Diagrama:** el rombo [Bloquear] / [Permitir] está en el carril del usuario sin una acción antes (falta «Responde la solicitud del navegador»); «5) Registra preferencias como bloqueadas» queda sobre la línea entre carriles y es del Sistema; los números van 2.1, 6, 3, 4, 5 y no siguen el escenario; el título dice «Sistema de Notificaciones Web Push y Preferencias» en vez de «HU 8.1 · Activar las notificaciones».
- **Especificación:** la épica en el Brief es «Sugerencia y notificaciones» (él puso «Gestión de notificaciones»); el paso 5 del escenario es vago («Si las desactiva o gestiona manualmente…»); una sola regla de negocio; los criterios usan términos técnicos (`default`, `/sw.js`).
- **RNF 2:** ver §2.2.

### German · HU 5.1

Le quedan los tres puntos que le dejó Aaron: los dos rombos seguidos que reciben dos flechas
(usar barra y conectores), la flecha al objeto «Mapa del campus» debe ser punteada, y borrar el
adjunto viejo. Además, el enlace a viewer.diagrams.net que Aaron agregó a su Conversación conviene
quitarlo (misma razón que en la HU 1.1).

### Aaron · HU 4.1

Bien: diagrama limpio, con tres carriles (incluye el sensor), guardas, uniones con barra y
nodos objeto. Solo: quitar el enlace a viewer.diagrams.net y escribir el escenario en pasos.
Le falta la minuta de la Reunión 2.

### Revisiones cruzadas que faltan

Samuel → Aaron, German → Manuel y Manuel → Sebastian no dejaron comentario.

## 4. Lo que haría en Trello cuando lo apruebes

1. HU 9.1: subir el diagrama nuevo, ponerlo de portada y marcar el anterior como «(versión anterior)».
2. Tarjeta de RNF: reemplazar la descripción por el texto de §2.2.
3. HU 1.1: dejar el comentario de §2.3 y marcar «5 · Revisar a Samuel».
4. Reunión 4: llenar la minuta (necesito saber si la reunión se hizo, a qué hora y quiénes fueron).
5. Opcional: comentarios cortos a Manuel y German con lo de §3.
