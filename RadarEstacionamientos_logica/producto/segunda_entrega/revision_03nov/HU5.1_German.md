# Revisión · HU 5.1 · Consultar los estacionamientos en el mapa del campus (German Alfonzo)

Revisado el 03/nov/26 con la foto del tablero de las ~12:00 p. m. Comparado con el modelo corregido HU 9.1.

**Veredicto:** casi lista. Ya están la tabla, el enlace de draw.io y la barra de unión. Faltan dos detalles del diagrama (flechas de objeto), los adjuntos viejos y el texto del último ítem de la checklist.

**Puntaje estimado hoy:** Especificación **1 / 1** · Diagrama **2 a 3 / 3** (hay 2 riesgos de −1) · RNF 1 **1,5 a 2 / 2**.
Con las correcciones 🔴 y 🟠 de abajo: 1 + 3 y RNF 2.

---

## Hallazgos (de más grave a menos grave)

| # | Gravedad | Dónde | Qué pasa | Corrección concreta |
|---|---|---|---|---|
| 1 | 🔴 −1 posible | Diagrama v3 y enlace · objeto «Estacionamientos» → «3) Carga la maqueta del Campus Montalbán» | Es el único flujo de objeto con **flecha continua**. En el XML del enlace la arista `c36` no tiene `dashed=1`; las otras dos (`c21` a «Entrar» y `c68` a «Mapa del campus») sí. El modelo del equipo pide nodos objeto con flecha punteada. Es el mismo error que ya le marcaron con «Mapa del campus». | En draw.io, selecciona esa flecha › Estilo › Patrón: punteado. Vuelve a exportar el PNG y a generar el enlace. |
| 2 | 🟠 −1 posible | PNG v3 · flecha «8) Muestra interfaz «Mapa del campus»» → objeto «Mapa del campus» (y la corta de 2.1 a «Entrar») | En el enlace es punteada (`dashed=1`), pero **en el PNG parece continua**: medí un trazo de unos 40 px y un hueco de 1 px antes de la punta. La de «Entrar» es un trazo de 28 px y un hueco. A tamaño normal no se ve punteada. Además, el PNG no parece exportado de draw.io: la tipografía y el patrón de guiones son distintos a los del visor. Este punto del grupo queda **a medias**. | Exporta el PNG desde draw.io (Archivo › Exportar como › PNG, zoom 200 %), no con otro programa. Si aún se ve continua, alarga esa flecha o ponle `dashPattern=6 4`. Revisa con zoom que se vean al menos 3 guiones. |
| 3 | 🟠 −1 posible | Diagrama · rombo [Reintentar] / [Salir] del carril Estudiante / Profesor | Le llega una flecha directo desde «3.1) Muestra mensaje…» (Sistema). En el carril del usuario no hay ninguna acción antes del rombo. Es lo mismo que el equipo le marcó a Manuel en la HU 8.1 («el rombo… está en el carril del usuario sin una acción antes»). En el modelo 9.1, el rombo [Cancelar] / [Enviar] viene después de «5) Elige el tipo de problema». | Agrega en el carril del usuario **«3.2) Lee el mensaje»** entre 3.1 y el rombo. Renumera «3.3) Presiona «Reintentar»» y «3.4) Cierra el Radar». En el escenario: «3.1 muestra el mensaje «No se pudo cargar el mapa»; 3.2 el usuario lee el mensaje y elige: [Reintentar] 3.3 presiona «Reintentar» y vuelve al paso 3 (conector 2); [Salir] 3.4 cierra el Radar y termina el caso de uso.» |
| 4 | 🟠 | Adjuntos | Siguen **«diagrama_actividades_HU5.1 (versión anterior).png»** (todavía dice «OpenStreetMap», tiene un nodo con dos acciones y los rombos de unión) y **«diagrama_actividades_HU5.1_v2.png»** (los 3 rombos seguidos). Sebastian (02/11) y Aaron (02/11) pidieron borrarlos. Si la profesora abre uno, verá errores ya corregidos. | Elimina los dos adjuntos. Deja solo `diagrama_actividades_HU5.1_v3.png` y `HU_5.1_Especificacion.png`. |
| 5 | 🟠 | Checklist «Especificación ERS · Segunda Entrega» · último ítem | Todavía dice «Diagrama de actividades adjunto como imagen o PDF (no enlace a la herramienta de diagramación)». Contradice lo que hay en la tarjeta, que ahora sí tiene el enlace. | Cambia el texto por: **«Diagrama de actividades adjunto como imagen y con enlace de draw.io que abre sin pasos previos»** (marcado). |
| 6 | 🟠 | Tabla PNG · columna 2 · Escenario de uso | Está escrito **en un párrafo, sin números**. El formato acordado pide los pasos numerados igual que el diagrama, como en la tabla de la HU 9.1. Es la primera imagen que ve la profesora. | Rehaz la tabla con esta lista: 1. El estudiante o profesor abre el Radar. 2. El sistema verifica la sesión. 2.1 Si no la tiene, muestra «Entrar». 2.2 El usuario inicia sesión con su correo institucional. 3. El sistema carga la maqueta del Campus Montalbán con los estacionamientos. 3.1 Si no carga, muestra «No se pudo cargar el mapa». 3.2 El usuario lee el mensaje. 3.3 Presiona «Reintentar» y vuelve al paso 3. 3.4 O cierra el Radar. 4. El sistema dibuja cada estacionamiento con su nombre. 5. Distingue con borde punteado los de solo profesores. 6. Muestra la leyenda. 7. Ajusta el encuadre al tamaño de la pantalla. 8. Muestra el mapa del campus. 9. El usuario ubica el estacionamiento que le interesa. (Si no aplicas el hallazgo 3, quita «3.2 Lee el mensaje» y deja 3.2 / 3.3.) |
| 7 | 🟡 | Criterios · CA3 | «Dado un celular de 360 px de ancho **o** un computador» mezcla dos casos. Además, «un computador» no tiene un tamaño que se pueda probar. | Texto listo: «**CA3 · Dado** un celular de 360 px de ancho, **cuando** el usuario abre el mapa, **entonces** se ven todos los estacionamientos completos, sin cortes y sin desplazamiento horizontal de la página.» El computador ya queda cubierto por CA1. Cambia el criterio 3 de la tabla igual. |
| 8 | 🟡 | Reglas de negocio · RN3 y flujo de error | RN3 (solo con sesión) y el camino «No se pudo cargar el mapa» no tienen criterio. El modelo 9.1 tampoco cubre su regla de sesión, así que no es obligatorio. | Opcional, si quieren un 4.º criterio: «Dado un usuario sin sesión, cuando abre el Radar, entonces no ve el mapa y el sistema le muestra «Entrar».» |
| 9 | 🟡 | RN1 | «(Playa, Postgrado, Centro de Estudiantes, Sambilito, Presambilito, **etc.**)»: el «etc.» no se puede verificar. | «RN1 · Se muestran todos los estacionamientos del catálogo, cada uno con el nombre que usa la comunidad UCAB (por ejemplo, Playa, Postgrado, Sambilito).» |
| 10 | 🟡 | Diagrama · carril «Estudiante / Profesor» | La card dice «conductor de la comunidad UCAB (estudiante o profesor)». El modelo 9.1 usa «Conductor (estudiante o profesor)». No es error, pero conviene usar la misma palabra en todos lados. | Cabecera del carril: «Conductor (estudiante o profesor)». |
| 11 | 🟡 | Descripción | Dice «**Especificada por:** German Alfonzo». El modelo 9.1 dice «**Autor:** Moreno, Sebastian». La tabla sí usa «Autor: Alfonzo, German». | Cambia a «**Autor:** Alfonzo, German». |
| 12 | 🟡 | Tabla vs. descripción | Pequeñas diferencias. La tabla dice «Épica: Gestión de Puestos.», sin «5 ·» ni «(R1)». En Dependencias pone la HU 5.4 como dependencia directa, mientras la descripción dice «Usa el catálogo… La HU 5.4 modifica su capacidad». También le falta la restricción «formas aproximadas». | Al rehacer la tabla (hallazgo 6), copia esas tres líneas de la descripción. |
| 13 | 🟡 | Portada de la tarjeta | La portada es el diagrama v3. En el modelo 9.1, la portada es la tabla de especificación. | Opcional: pon `HU_5.1_Especificacion.png` como portada. |
| 14 | 🟡 | XML del enlace | Las aristas no tienen origen ni destino (`source` / `target`), solo coordenadas. En el visor no se nota, pero si alguien mueve una caja en draw.io, las flechas no la siguen. | Solo si se edita otra vez: conecta cada flecha a sus cajas. |

### Lo que está bien (comprobado)

- **Card:** un solo verbo («quiero **consultar**»), coherente con el nombre del backlog («5.1 Consultar los estacionamientos en el mapa del campus»).
- **Conversación:** tiene las 6 partes. Épica «Gestión de Puestos» como en el Brief corregido. El escenario de la descripción coincide paso a paso con el diagrama v3 (1, 2, 2.1, 2.2, 3, 3.1–3.3, 4–9, conectores 1 y 2). Las reglas son de negocio. El alcance excluye bien 4.2, 5.3, 7.2 y 5.5. Las restricciones cumplen D-007 (maqueta propia, sin mapa de calles, ya sin OpenStreetMap) y D-005. RN2 respeta D-009: el color queda para el semáforo y los de solo profesores van con borde punteado.
- **Criterios:** CA1 y CA2 son comprobables, uno por caso, en formato Dado / cuando / entonces.
- **Diagrama v3:** título con la HU y el autor. Dos carriles con cabecera azul. Inicio con «Se inicia el Caso de Uso» y dos finales con «Finaliza el Caso de Uso». Todas las acciones tienen verbo y están en el carril de quien las hace. Numeración «N) » con espacio. Cada rombo recibe una sola flecha y sus salidas tienen guardas ([Sin sesión] / [Con sesión], [Error de carga] / [Mapa cargado], [Reintentar] / [Salir]). Las uniones van con **barra negra y conectores 1 y 2**. No aparece el semáforo, que está fuera del alcance.
- **Enlace:** ahora es `viewer.diagrams.net/?lightbox=1…#R…`, con el diagrama embebido en la URL. Abre sin pasos previos. Al decodificarlo da el mismo diagrama que el PNG v3: mismos textos, mismos nodos y misma distribución, escalada.

---

## Estado de cada punto del mensaje del grupo (03/nov) y de los comentarios previos

| Punto | Estado | Evidencia |
|---|---|---|
| *Para todos:* enlace de viewer.diagrams.net en la descripción además del PNG | ✅ Hecho | Enlace al inicio de la descripción y PNG v3 embebido debajo. La Conversación remite a él: «ver el enlace al inicio de la descripción». |
| *Para todos:* tabla de 3 columnas con el Autor | ✅ Hecho, con detalle | `HU_5.1_Especificacion.png` (03/11 01:50): título, «Autor: Alfonzo, German» y 3 columnas. El escenario no está numerado (hallazgo 6). |
| *German:* falta la tabla | ✅ Corregido | Ver arriba. |
| *German:* el enlace apunta al PNG de Trello, cambiarlo por el de draw.io | ✅ Corregido | Ahora apunta a viewer.diagrams.net y su XML coincide con el v3. |
| *German:* 3 rombos seguidos en vertical; los 2 de unión pasan a conectores numerados que llegan a una barra negra | ✅ Corregido | En el v3 hay un solo rombo de decisión; luego la barra negra recibe el conector 1 (desde 2.2), [Con sesión] y el conector 2 (desde «Reintentar»). |
| (Comentarios de Aaron y Sebastian, 02/11) flecha a «Mapa del campus» punteada | ⚠️ A medias | Punteada en el enlace; en el PNG casi no se nota (hallazgo 2). Además, la de «Estacionamientos» sigue continua (hallazgo 1). |
| (Comentarios de Aaron y Sebastian, 02/11) borrar el adjunto viejo | ❌ Pendiente | Siguen «(versión anterior)» y «_v2» (hallazgo 4). |
| (Comentario de Sebastian, 02/11) minuta de la Reunión 3 y revisión de la HU 8.1 | ✅ Hecho | Minuta en la tarjeta Reunión 3 («Minuta registrada por: German Alfonzo»). Revisión de la HU 8.1 comentada el 03/11 02:16. Casillas 1–5 de German marcadas en «Segunda Entrega». |

---

## RNF 1 · Comportamiento temporal (German)

**Bien:** empieza con «El sistema debe…». Característica y subcaracterística ISO 25010 correctas (Eficiencia de desempeño › Comportamiento temporal). Cita el rango del Brief tal cual («El mapa debe cargarse y actualizarse en pocos segundos…») y cubre sus dos partes, cargar y actualizar. Los umbrales son numéricos (3 s, 5 s), el perfil de red es fijo (9 / 1,5 Mbps, 60 ms), da una proporción (9 de 10) y tiene procedimiento de prueba. Ya corrigió lo de «4G».

**Lo que un probador experto todavía preguntaría** (riesgo de −0,5):

| # | Gravedad | Qué pasa | Corrección |
|---|---|---|---|
| R1 | 🟠 | **El punto de partida es ambiguo.** «Desde que el usuario abre el Radar» no dice si la sesión ya está iniciada (si no lo está, aparece «Entrar» y el tiempo no tiene sentido). Tampoco dice si la caché está vacía: la app es una PWA (D-008) y la segunda carga sale de la caché. | Agregar «con la sesión iniciada y la caché del navegador desactivada». |
| R2 | 🟠 | **La actualización no tiene proporción en el enunciado.** La frase dice «en 5 segundos o menos», pero la prueba exige «los 10 cambios» (100 %). | Agregar «en el 100 % de los avisos» al enunciado. |
| R3 | 🟡 | **El fin de la medición se cronometra a ojo.** Eso mete el error de reacción de quien mide (unas décimas de segundo, justo cerca de 3 s). | Medir con la pestaña Rendimiento (Performance) de Chrome con capturas activadas: se toma el primer cuadro en el que se ven todos los estacionamientos en verde o rojo. |
| R4 | 🟡 | No dice en qué navegador ni en qué equipo se mide. | «En Chrome de escritorio, sin limitar la CPU», o fijar un celular concreto. |
| R5 | 🟡 | «Con su color» puede chocar con el RNF 3: un estacionamiento «sin datos» no tiene color. | En la preparación: «todos los sensores del simulador activos». En el enunciado: «con su color del semáforo (verde o rojo)». |

**Texto listo para pegar (RNF 1):**

> **Comportamiento temporal:** El sistema debe mostrar el mapa del campus con todos los estacionamientos y su color del semáforo (verde o rojo) en **3 segundos o menos** en al menos **9 de cada 10** cargas, medidos desde que el usuario, con la sesión iniciada, abre el Radar hasta que se ven todos los estacionamientos con su color, en Chrome de escritorio con la caché desactivada y la red limitada a 9 Mbps de bajada, 1,5 Mbps de subida y 60 ms de latencia; y debe reflejar un cambio de ocupación en **5 segundos o menos** después del aviso del sensor en el **100 %** de los avisos.
> - Cómo se prueba:
>   - Preparación: simulador de sensores con todos los estacionamientos activos; usuario con la sesión iniciada.
>   - Carga: en las herramientas de Chrome, desactivar la caché, crear el perfil de red de 9 / 1,5 Mbps y 60 ms, y grabar con la pestaña Rendimiento (con capturas) mientras se abre el Radar. Se repite 10 veces. Se toma el tiempo del primer cuadro en que se ven todos los estacionamientos en verde o rojo. Al menos 9 de 10 cargas deben tardar 3 s o menos.
>   - Actualización: enviar 10 avisos de entrada desde el simulador, anotando la hora de envío que registra el simulador, y la hora en que cambia el color en pantalla. Los 10 cambios deben verse en 5 s o menos.

Nota fuera del alcance: en la tarjeta de RNF, el RNF 2 (de Manuel) sigue titulado «**Facilidad de Iteración**». El comentario de Sebastian del 02/11 dice que pasó a «Capacidad de interacción», el nombre ISO 25010, pero el cambio no está en la descripción.
