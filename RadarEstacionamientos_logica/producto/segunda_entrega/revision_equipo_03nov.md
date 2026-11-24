# Revisión del equipo · Segunda Entrega · mar 03/nov/26

**Estado:** 🟢 Vigente. Foto del tablero «EQUIPO 87 3» del 03/nov/26 a mediodía (JSON público).
Cinco revisores en paralelo, uno por HU y uno para RNF, minutas y tablero. Sebastian comprobó lo
principal de cada informe (diagramas vistos, adjuntos, comentarios y minutas en el JSON).
El detalle de cada uno, con textos listos para pegar, está en `revision_03nov/`.

## Resumen

**Todavía no está para mandar.** Bloquean el correo:

1. **HU 8.1 (Manuel) sin diagrama:** la tarjeta tiene 0 adjuntos y ningún enlace. Él subió y borró dos
   PNG y un .docx entre el 02/nov a la 1:54 a. m. y las 9:45 p. m. Así pierde los 3 puntos del diagrama.
2. **Diagrama de la HU 1.1 (Samuel):** siguen los 3 errores que se le marcaron el 02/nov (cada uno resta 1).
3. **Minutas vacías:** Reunión 2 (Aaron; es la tarjeta donde la profesora escribió «ustedes no se vana a
   reunir???» el 19/10), Reunión 4 (Sebastian) y retrospectiva (Manuel).

| HU | Autor | Card (1) | Diagrama (3) | Lo que falta |
|---|---|---|---|---|
| 1.1 | Samuel | 1 | **0–1** | 3 errores del diagrama; escenario en pasos; ítem de checklist |
| 4.1 | Aaron | 0–1 | 2–3 | Card «quiero ver» parece consulta; pasos 7–9 del diagrama; escenario en pasos |
| 5.1 | German | 1 | 2–3 | Rombo sin acción previa; flechas de objeto; adjuntos viejos; ítem de checklist |
| 8.1 | Manuel | 1 | **0** | Diagrama, tabla, enlace, RN1, paso 5, criterios |
| 9.1 | Sebastian | 1 | 3 | — |

RNF: los 4 cumplen (frase «El sistema debe…», subcaracterística correcta, rango del Brief, número y
prueba). Hay 9 ambigüedades menores en las pruebas, con texto propuesto en `revision_03nov/RNF_minutas_y_tablero.md` §2.

## Por integrante

### Samuel · HU 1.1 (`revision_03nov/HU1.1_Samuel.md`)

- 🔴 Diagrama (confirmado en el PNG): «6.1) Cancela el proceso de creación de cuenta» está en el
  carril del **Sistema**; el rombo [Crear cuenta]/[Salir] va **después** de «6) Presiona «Crear
  cuenta»» (debe ir entre el 5 y el 6, con [Crear cuenta]/[Cancelar]); los conectores se llaman
  **6, 7, 8 y 9**, como los pasos (deben ser 1–4).
- ✔ CA2 corregido («no le crea la cuenta»). Quedan restos de la frase vieja en el bloque «Criterio de
  aceptación» de arriba y en el adjunto «versión anterior».
- 🟠 Escenario en una sola frase (pasarlo a pasos 1–13 como el diagrama); reglas de la contraseña
  sin criterio; «guardada cifrada» es técnica (va a Restricciones).
- 🟡 Último ítem de la checklist con el texto viejo; borrar adjuntos «versión oscura» y «versión anterior».
- Pendiente del plan: su revisión de la HU 4.1 (no hay comentario).

### Aaron · HU 4.1 + RNF 3 (`revision_03nov/HU4.1_Aaron.md`)

- 🟠 Card: «quiero **ver** el aforo…» convierte la HU en consulta (eso es la 4.2), y la profesora ya
  escribió sobre la épica Aforo: «su cálculo no es más que una consulta, debe haber un registro o
  actualización». Propuesta: «quiero que el sistema actualice el aforo de cada estacionamiento con cada
  entrada o salida, para saber cuántos puestos libres hay antes de llegar».
- 🟠 Diagrama: «7) Resta un puesto libre» va antes de «9) Verifica los límites», así que el aforo
  parece cambiar antes de detectar la anomalía. Basta con cambiar el texto de 7, 8 y 9 («Calcula los
  libres con uno menos / más», «Verifica que queden entre 0 y la capacidad») y reexportar.
- 🟠 Escenario todavía en prosa.
- ✔ Todo lo del mensaje del grupo: CA3 separado, CA5 para «fuera del catálogo», RNF 3 con «El sistema
  debe…», carril «Estudiante / Profesor», tabla y enlace.
- 🟡 RNF 3: la prueba no comprueba que a los 9 minutos todavía se vea el color, ni que *todos* los
  demás sigan.
- Pendiente del plan: minuta de la Reunión 2 (vacía).

### German · HU 5.1 + RNF 1 (`revision_03nov/HU5.1_German.md`)

- ✔ Tabla con el Autor, enlace a viewer.diagrams.net (abre sin pasos previos) y rombos de unión
  cambiados por barra y conectores 1 y 2.
- 🟠 El rombo [Reintentar]/[Salir] del carril del usuario no tiene una acción del usuario antes (lo
  mismo que se le marcó a Manuel): agregar «3.2) Lee el mensaje» y renumerar.
- 🟠 Las flechas a los objetos «Estacionamientos» y «Entrar» son continuas y la de «Mapa del campus»
  casi no se ve punteada en el PNG. El modelo del equipo las usa punteadas (en UML estándar el flujo de
  objeto es continuo, así que quizá no reste; igual conviene que coincida con las demás HU).
- 🟠 Borrar los adjuntos «versión anterior» (todavía dice OpenStreetMap) y «_v2» (los 3 rombos);
  cambiar el texto del ítem de la checklist; escenario en pasos.
- 🟡 RNF 1: decir que se mide con la caché vacía (PWA, D-008) y con la pestaña Rendimiento.
- Al día con el plan (minuta de la Reunión 3 y revisión de la 8.1 hechas).

### Manuel · HU 8.1 + RNF 2 (`revision_03nov/HU8.1_Manuel.md`)

- 🔴 **Sin diagrama** (3 pts) y con el ítem «Diagrama adjunto» marcado. La descripción nombra
  `diagrama_actividades_HU8.1.png`, que no existe.
- 🟠 Sin tabla. RN1 técnica (API del navegador → Restricciones). Paso 5 ambiguo. CA1 sin sujeto en
  «queda registrado»; CA2 junta dos casos y nombra una «campana» que el escenario no tiene; CA3
  (desactivar y reactivar) no está en el escenario ni en el código.
- 🟠 El «para» habla de «emergencias» y «tiempo real», que no salen del Brief: la HU 8.1 está en la meta
  «Llegar a clase a tiempo».
- El informe trae la especificación corregida completa, el contenido de la tabla y el diagrama paso a
  paso (2 carriles, un rombo en el Sistema, alterno 3.1/3.2 y la notificación de prueba como paso 5).
- **Decisión pendiente con Manuel:** el criterio de la Iteración 1 dice «activarlas desde su perfil»,
  y no hay perfil en `main`. La propuesta es indicarle cómo hacerlo desde la configuración del navegador
  y dejar el perfil fuera del Alcance.
- Pendiente del plan: retrospectiva (vacía).

### Sebastian · HU 9.1 + revisión final

- HU 9.1 y RNF subidos hoy. Pendiente: minuta de la Reunión 4 y el correo.
- El correo nombra mal la tarjeta: se llama «Especificación de Requisitos No Funcionales», no
  «Requisitos No Funcionales (ERS §2)».

## Tablero (lo que vería la profesora)

- ✔ Nombre, visibilidad pública, profesora como miembro, títulos y épicas de las 5 HU iguales al Brief.
- 🟠 «Facilidad de Iteración» en los RNF: el orden casi seguro no resta, pero «Iteración» no existe en la
  ISO 25010 y en la misma tarjeta hay un comentario del 02/11 que dice que está mal. Dos revisores
  recomiendan, como mínimo, cambiarlo a «Facilidad de Interacción» o «Capacidad de interacción».
- 🟠 Casillas y comentarios que dicen «nada de enlaces» al lado de los enlaces (1.1, 5.1, 8.1).
- 🟡 Unas 15 fechas vencidas, adjuntos viejos de diagramas, German duplicado como miembro y la HU 2.1
  fuera de orden en la lista.

## Revisión cruzada

4 de 5 hechas. Falta **Samuel → HU 4.1**.
