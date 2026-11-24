# Revisión · HU 4.1 · Actualizar el aforo con cada entrada o salida (Aaron Zarraga) + RNF 3

Material revisado: `tarjeta.md` (foto del 03/nov, ~12:00 p. m.), `HU_4.1_Especificacion_v2.png`,
`diagrama_actividades_HU4.1_v3.png`, `drawio_enlace_0.xml` y `_1.xml` (son idénticos), `RNF/tarjeta.md`.
Contrastado con el backlog, D-002, D-009, el plan de la entrega, las láminas U05/U07, los comentarios
de la profesora sobre el Brief y el modelo de la HU 9.1.

## Veredicto

**Casi lista: los criterios, la tabla y el diagrama están bien hechos. Hay que corregir la Card, que
hoy describe una consulta (la HU 4.2) y no la HU 4.1, y escribir el escenario en pasos numerados.**

| Parte | Hoy (estimado) | Con las correcciones |
|---|---|---|
| Especificación (Card, un verbo) | 0 a 1 / 1: tiene un solo verbo, pero «ver» la vuelve una consulta | 1 / 1 |
| Diagrama de actividades | 2 a 3 / 3: riesgos en el orden «resta → verifica» y en la numeración frente al escenario | 3 / 3 |
| RNF 3 · Tolerancia a fallos | 1,5 a 2 / 2: la prueba no comprueba del todo la palabra «solo» | 2 / 2 |

## Hallazgos (de más a menos grave)

No encontré ningún 🔴 (algo que reste puntos con seguridad). Hay tres 🟠.

| # | Gravedad | Dónde | Qué pasa | Corrección (lista para pegar) |
|---|---|---|---|---|
| 1 | 🟠 · 1 pt de la especificación | Card (descripción y tabla PNG, columna 1) | Dice «quiero **ver** el aforo de cada estacionamiento actualizado…». Tiene un solo verbo, pero ahora la HU es una **consulta**: eso es la HU 4.2 «Consultar el semáforo de ocupación (lee)». El backlog dice que la 4.1 **escribe**. Además, el título de la misma tabla dice «Actualizar el aforo…» y la Card dice «ver», así que la imagen se contradice. La profesora ya escribió en el Brief: «La épica Aforo: su cálculo no es más que una consulta, debe haber un registro o actualización por los sensores […] NO tiene claro este concepto de historia». Con «ver» nos puede repetir ese comentario. Y el diagrama no tiene ninguna acción «Ve» del conductor, así que la Card no coincide con el diagrama. | Dejar el verbo del nombre de la HU, con el conductor como beneficiario y el sistema como quien actualiza: **«Como conductor de la comunidad UCAB (estudiante o profesor), quiero que el sistema actualice el aforo de cada estacionamiento con cada entrada o salida, para saber cuántos puestos libres hay antes de llegar.»** Tiene un solo verbo (actualizar), coincide con el nombre del backlog y del Brief, no le atribuye al conductor algo que no hace y encaja con el diagrama (el conductor cruza y el sistema actualiza). No conviene usar «Como sensor…»: el backlog define la HU como «una acción concreta de una persona». |
| 2 | 🟠 · coherencia entre la especificación y el diagrama | Conversación › Escenario (descripción y tabla) | Está en prosa y en una sola frase. El diagrama tiene los pasos 1 a 12, más el 5.1 y el 9.1. En la prosa faltan «Detecta», «Recibe», «Identifica el tipo» y «Publica». El equipo acordó «escenario en pasos numerados iguales a los del diagrama», y la revisión del 02/nov ya se lo pidió («escribir el escenario en pasos»): **sigue pendiente**. | **Escenario de uso:**<br>1. El conductor (estudiante o profesor) cruza el acceso del estacionamiento.<br>2. El sensor del acceso detecta el paso del carro.<br>3. El sensor envía el aviso de entrada o salida.<br>4. El sistema recibe el aviso (HU 3.1).<br>5. El sistema busca el estacionamiento del aviso.<br>&nbsp;&nbsp;5.1 Si no está en el catálogo, registra el aviso como rechazado con la hora y termina.<br>6. El sistema identifica el tipo de movimiento.<br>7. Si es una entrada, calcula los puestos libres con uno menos.<br>8. Si es una salida, calcula los puestos libres con uno más.<br>9. El sistema verifica que los puestos libres queden entre 0 y la capacidad.<br>&nbsp;&nbsp;9.1 Si quedan fuera, no cambia el aforo, registra la anomalía con la hora y termina.<br>10. El sistema guarda los puestos libres.<br>11. El sistema registra el cambio con la hora.<br>12. El sistema publica los puestos libres (los muestra la HU 4.2).<br>*(Si no se cambia el diagrama, los pasos 7 y 8 dicen «Resta un puesto libre» y «Suma un puesto libre», igual que hoy).* |
| 3 | 🟠 · 1 pt del diagrama | Diagrama, pasos 7, 8 y 9 | El flujo **primero** resta o suma («7) Resta un puesto libre») y **después** verifica los límites. Si quedan 0 libres y llega una entrada, el diagrama ya restó (da −1) antes de detectar la anomalía. Pero la regla y el CA3 dicen que el aviso «no cambia los puestos libres». Se puede defender, porque no se guarda hasta el paso 10, pero leído en el diagrama parece que el aforo cambió. | Cambiar solo el texto de tres acciones (las guardas y las flechas quedan igual): **«7) Calcula los libres con uno menos»**, **«8) Calcula los libres con uno más»** y **«9) Verifica que queden entre 0 y la capacidad»**. Después hay que volver a exportar el PNG **y** generar de nuevo el enlace de viewer.diagrams.net, para que los dos sigan mostrando lo mismo. |
| 4 | 🟡 | Alcance frente al paso «4) Recibe el aviso (HU 3.1)» | El Alcance dice «no incluye recibir los avisos», pero el diagrama tiene la acción «Recibe el aviso». Está bien que esté en el diagrama, porque marca dónde empieza la HU, pero el texto se contradice. | **Alcance:** no incluye cómo llegan y se validan los avisos (HU 3.1), mostrar el semáforo (HU 4.2), marcar «sin datos» (HU 4.4, R2) ni detectar avisos duplicados. |
| 5 | 🟡 | Diagrama, paso 5.1, frente al CA5 | El CA5 dice «queda registrado como rechazado **con la hora**». El paso 5.1 dice «Registra el aviso como rechazado», sin la hora. En cambio, el 9.1 sí dice «con la hora». | Si de todos modos se reexporta (hallazgo 3), poner: **«5.1) Registra el aviso como rechazado con la hora»**. |
| 6 | 🟡 | Conversación › Reglas de negocio | Están en una sola frase y no incluyen la regla principal (cada entrada resta y cada salida suma, con la hora). El modelo de la 9.1 las separa. | **Reglas de negocio:** RN1. Los puestos libres de un estacionamiento nunca bajan de 0 ni superan su capacidad. RN2. Cada entrada resta un puesto libre y cada salida suma uno; cada cambio queda registrado con la hora. RN3. Un aviso que rompa la RN1 no cambia el aforo y queda registrado como anomalía, con la hora. RN4. Un aviso de un estacionamiento que no está en el catálogo no cambia ningún aforo y queda registrado como rechazado, con la hora. *(Cobertura: RN1 → CA3 y CA4; RN2 → CA1 y CA2; RN3 → CA3 y CA4; RN4 → CA5).* |
| 7 | 🟡 | Épica, Dependencias y Restricciones | La épica dice solo «Aforo.», sin número ni meta (la 9.1 dice «9 · Gestión de Incidencias (R1), de la meta…»). Las dependencias no mencionan el catálogo ni la capacidad, que necesitan la RN1 y la RN4, ni que la 4.2 se apoya en esta HU. Las restricciones no citan D-002 ni D-005. | **Épica:** 4 · Aforo (R1), de la meta Puestos del Mapa de Impacto.<br>**Dependencias:** HU 3.1 · Recibir avisos de entrada y salida (le entrega el aviso); HU 3.2 · Simular sensores y placas (genera los avisos); el catálogo de estacionamientos con su capacidad (épica 5; la HU 5.4 fija la capacidad). Es la base de la HU 4.2 · Consultar el semáforo de ocupación.<br>**Restricciones:** solo el Campus Montalbán; ocupación por estacionamiento completo, no por puesto; sensores simulados por software (D-002); sin costos adicionales (D-005). |
| 8 | 🟡 · RNF | RNF 3 › Cómo se prueba | (a) La frase dice «ocultar **solo**», pero la prueba revisa un único estacionamiento más. No comprueba que **todos** los demás sigan con su color. (b) No hay límite inferior: un sistema que oculte el estacionamiento al minuto 1 también pasa la prueba («al pasar los 10 minutos ya no muestra su color»). (c) No dice con qué margen se mira el minuto 10. | Agregar a la prueba: **«A los 9 minutos, ese estacionamiento todavía muestra su color.»** · **«Entre los 10 y los 11 minutos deja de mostrarlo y aparece "sin datos".»** · **«Todos los demás estacionamientos siguen mostrando su color; se envía una entrada a otro y su cambio se ve en 5 s o menos.»** (El margen de 1 minuto es una propuesta: hay que acordarlo con el equipo). |
| 9 | 🟡 · RNF | RNF 3, la frase | «No reciba avisos durante 10 minutos» confunde un sensor dañado con un estacionamiento sin movimiento (de noche, por ejemplo). El Brief habla de «si un sensor **falla**». Se puede probar igual, pero en la defensa pueden preguntar por esto. | Opcional, en la frase: «…que no reciba avisos **ni señal de vida** de su sensor durante 10 minutos…». Si no se cambia, hay que tener lista la respuesta para la defensa. |
| 10 | 🟡 | Diagrama, nodos objeto | Tiene «Aforo» y «Cambio de aforo», con flecha punteada ✔. Faltan como objeto el aviso que manda el sensor y los registros de rechazo y de anomalía. No es un error, solo completaría el diagrama. | Opcional: el nodo objeto **«Aviso»** con flecha punteada desde «3) Envía el aviso…». |
| 11 | 🟡 | Descripción | El rótulo dice «**Escenario:**» y la tabla dice «Escenario de uso:». El enlace del diagrama aparece dos veces (arriba y en la Conversación). La tabla PNG tiene una franja blanca debajo. | Cambiar a «**Escenario de uso:**». Lo demás es cosmético. |

### Revisión del diagrama, punto por punto (modelo del equipo)

| Punto del modelo | Estado |
|---|---|
| Título con la HU y el autor | ✔ «HU 4.1 · Actualizar el aforo con cada entrada o salida — Diagrama de Actividades — Autor: Zarraga, Aaron» |
| Carriles con cabecera azul | ✔ «Estudiante / Profesor» · «Sensor del acceso (simulado)» · «Sistema». El carril del sensor es justo lo que pidió la profesora («actualización según información de los sensores») |
| Inicio y fin con notas | ✔ Un inicio con la nota «Se inicia el Caso de Uso»; tres fines, cada uno con «Finaliza el Caso de Uso» |
| Acciones con verbo y en el carril de quien las hace | ✔ Cruza, Detecta, Envía, Recibe, Busca, Registra, Identifica, Resta, Suma, Verifica, Guarda, Publica |
| Numeración «N) » con espacio | ✔ en el diagrama · ❌ el escenario no tiene números (hallazgo 2) |
| Rombos con una sola entrada y con guardas | ✔ Los tres rombos tienen una sola entrada y están en el carril del Sistema: [No existe]/[Existe] · [Entrada]/[Salida] · [Fuera de los límites]/[Dentro de los límites] |
| Unión con barra y conectores | ✔ Conectores ① y ② hacia una barra negra |
| Nodos objeto con flecha punteada | ✔ «Aforo» y «Cambio de aforo» |
| El enlace y el PNG muestran lo mismo | ✔ El XML del enlace tiene los mismos 34 textos que el PNG, y los dos enlaces de la descripción son idénticos. No abrí el enlace en el navegador: lo comprobé decodificando el XML |
| El PNG es una exportación (no una captura del editor) | ✔ |
| D-009 | No aplica: el diagrama no muestra el semáforo |
| ¿El actor humano hace algo? | Solo «1) Cruza el acceso», una acción física que dispara el caso. No es un error y justifica el carril. Pero con la Card de hoy («quiero **ver**») el conductor nunca ve nada en el diagrama: se resuelve con el hallazgo 1 |
| Orden de la lógica | 🟠 Primero resta y después verifica (hallazgo 3) |

Nota: en UML estricto, la barra **sincroniza**: espera todos los caminos que llegan. Aquí llega un solo
camino ([Entrada] o [Salida]), así que lo correcto sería un rombo de fusión. El equipo usa la barra
por la lámina 15 de la U05 («UNION, sincroniza») y porque la revisión cruzada marcó los rombos de
unión como error. No hay que cambiarlo, pero conviene saberlo por si la profesora pregunta.

### RNF 3 · Tolerancia a fallos (Aaron)

- ✔ Empieza con «El sistema debe ocultar solo la ocupación del estacionamiento…».
- ✔ Sale del rango del Brief («Si un sensor falla, el sistema debe ocultar solo ese estacionamiento y
  seguir funcionando con los demás»), que está citado en la tarjeta.
- ✔ Está como Fiabilidad › Tolerancia a fallos (ISO 25010, lámina U07: «operar según lo previsto en
  presencia de fallos»).
- ✔ Es medible: 10 minutos, 5 s y 100 %, con 5 repeticiones.
- 🟡 Para que la prueba sea objetiva del todo, ver los hallazgos 8 y 9. Así como está, un probador
  ya puede escribir el caso de prueba, por eso estimo 2/2 con un riesgo pequeño.
- Nota menor: la checklist lo llama «RNF 3», pero en la descripción es el ítem «4. Fiabilidad» (la
  lista sigue las 8 características). No resta puntos.

### Checklist y adjuntos

- ✔ «Especificación ERS · Segunda Entrega»: los 5 ítems están marcados, y el último dice exactamente
  «Diagrama de actividades adjunto como imagen y con enlace de draw.io que abre sin pasos previos».
- ✔ «Actividades de la historia»: se agregaron «Especificar · Criterio de aceptación 4» y «5». Es
  coherente, porque hay 5 criterios. (La pizarra de clase decía «criterio 1, 2 y 3», y tener más no
  es un error).
- ✔ Adjuntos: solo `HU_4.1_Especificacion_v2.png` (de portada) y `diagrama_actividades_HU4.1_v3.png`.
  Las versiones viejas se borraron el 03/nov a las 10:52 a. m. (hora de Venezuela).
- ✔ La tabla PNG tiene 3 columnas, el título y «Autor: Zarraga, Aaron», y su texto coincide con la
  descripción (solo cambia el rótulo «Escenario» del hallazgo 11).
- Si se aplican los hallazgos 1, 2, 6 y 7, hay que **regenerar la tabla PNG** y volver a ponerla de
  portada. Si se aplica el 3 (y el 5), hay que **reexportar el diagrama y generar de nuevo el enlace**.

## Estado de los puntos del mensaje del grupo

| Punto | Estado |
|---|---|
| *Para todos:* enlace de viewer.diagrams.net además del PNG | ✔ Está, y el PNG y el enlace coinciden |
| *Para todos:* tabla de 3 columnas con el Autor | ✔ |
| Card «quiero actualizar el aforo» (el conductor no actualiza) | ⚠️ **Mal resuelto.** Cambió a «quiero ver», y eso choca con el nombre de la HU y la convierte en la HU 4.2. Ver el texto del hallazgo 1 |
| CA3 juntaba dos casos | ✔ Resuelto: ahora son el CA3 (0 libres y una entrada) y el CA4 (todos libres y una salida) |
| La regla «fuera del catálogo» no tenía criterio | ✔ Resuelto con el CA5 |
| RNF 3 debe empezar con «El sistema debe…» | ✔ Resuelto |
| Carril «Profesor/Alumno» → «Estudiante / Profesor» | ✔ Resuelto en el PNG y en el enlace |
| (Revisión del 02/nov) escenario en pasos | ❌ Pendiente (hallazgo 2) |
