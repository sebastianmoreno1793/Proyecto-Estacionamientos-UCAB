# Revisión del equipo · dom 01/nov/26 (dos días antes de la Segunda Entrega)

**Estado:** 🟢 Vigente — foto del tablero de Trello «EQUIPO 87 3» del 01/nov/26 a las 12:35 p.m.
(leído del JSON público del tablero). GitHub no se pudo revisar: el repo es de la cuenta
`sebastianmoreno1793` y en esta computadora `gh` y `git` entran con `sebassmoreno`, que no lo ve.

## 1. Cómo va cada uno (cinco tareas por integrante)

| Integrante | 1 · Especifica su HU | 2 · Diagrama | 3 · RNF | 4 · Minuta / retro | 5 · Revisa a | Última actividad propia |
|---|---|---|---|---|---|---|
| **German** | ✅ HU 5.1 completa (5/5) | ✅ PNG adjunto | ✅ RNF 1 final | ❌ Reunión 3 (0/4) | — Manuel (HU 8.1, no hay qué revisar) | 28/oct |
| **Samuel** | ❌ HU 1.1 (0/5) | ❌ | ❌ RNF 4 | ❌ Reunión 1 (0/4) | — Aaron (HU 4.1, no hay qué revisar) | 28/oct (subió los PR #58 y #59) |
| **Aaron** | ❌ HU 4.1 (0/5) | ❌ | ❌ RNF 3 | ❌ Reunión 2 (0/4) | — German | ninguna en Trello |
| **Manuel** | ❌ HU 8.1 (0/5) | ❌ | ❌ RNF 2 | ❌ Retrospectiva (0/3) | — Sebastian | ninguna en Trello |
| **Sebastian** | ✅ HU 9.1 en Trello (5/5) | ✅ PNG adjunto | — | 🟡 Reunión 4: convocatoria y minuta preparadas | 🟡 Samuel: aún no especifica (comentario dejado) | hoy |

**Lo que se pierde si no se hace:** cada RNF vale 2 pts. Hoy solo está el RNF 1, así que hay
**6 de los 12 puntos** en riesgo solo por los RNF 2, 3 y 4. Además, tres de las cinco HU no tienen
card, conversación ni diagrama (1 + 3 pts cada una).

**Venció y no está:** jue 29/oct (borrador de la especificación) y sáb 31/oct (diagrama y RNF), para
Samuel, Aaron y Manuel. La casilla de cada uno en la tarjeta «Segunda Entrega» está 0/5 para todos,
incluido German, que sí terminó (debe marcar las suyas).

## 2. Revisión de German (HU 5.1) con la checklist del plan

Muy buen trabajo; es el modelo para los demás. Dos correcciones antes del martes:

- [x] La card tiene un solo verbo («quiero **consultar**»).
- [x] La Conversación tiene las seis partes.
- [x] Hay tres criterios y se pueden comprobar (el de 360 px es especialmente bueno).
- [x] El diagrama tiene inicio, fin, carriles, verbos, guardas y uniones.
- [x] El diagrama es un PNG adjunto, no un enlace.
- [ ] **Usa los nombres y decisiones vigentes:**
  - **OpenStreetMap** aparece en el diagrama («Carga el mapa del Campus Montalbán
    (OpenStreetMap)») y en Restricciones. Desde el 27/oct (D-007) el mapa es **una maqueta propia
    del campus, sin mapa de calles**. Cambiar a «Carga la maqueta del Campus Montalbán» y la
    restricción a «El mapa es una maqueta propia del campus, sin costo (D-005, D-007)».
  - La épica se llama «Gestión de estacionamientos»; en el Brief aprobado es **Gestión de
    Puestos**. Igual con la 9 («Gestión de Incidencias»): conviene que todos usen el nombre del
    Brief.

Comentario listo para pegar en su tarjeta (lo deja Aaron, que es quien lo revisa; si Aaron no
aparece, lo deja Sebastian):

> Revisión cruzada (Reunión 4): card con un verbo ✔, Conversación completa ✔, 3 criterios
> comprobables ✔, diagrama con inicio, fin, carriles, verbos y guardas ✔, adjunto como PNG ✔.
> Falta: quitar «OpenStreetMap» del diagrama y de Restricciones (D-007: el mapa es la maqueta propia
> del campus) y usar el nombre de la épica del Brief («Gestión de Puestos»).

## 3. Revisión de Samuel (HU 1.1) — mi tarea 5

Todavía no hay nada que revisar: la tarjeta tiene el criterio viejo y la checklist ERS en 0/5. La
profesora ya le dejó en esa misma tarjeta, el 19/oct: «Falta la especificación de la historia como
actividad». Cuando la suba, revisar con la checklist de arriba y vigilar en especial:

- Card con un solo verbo: «quiero **crear** una cuenta…» (no «crear y entrar»).
- La regla de los dos dominios (@est.ucab.edu.ve y @ucab.edu.ve) y el mensaje cuando el correo no
  es institucional.
- La pregunta abierta 1 (¿Google, Microsoft o enlace por correo?) debe quedar resuelta en las
  Restricciones, porque el diagrama cambia según la respuesta.

Comentario para dejar hoy en su tarjeta:

> Samuel, en la Reunión 4 me toca revisarte la HU 1.1, pero la tarjeta todavía no tiene la
> especificación (Card, Conversación y 3 criterios) ni el diagrama, y la profesora ya lo pidió
> aquí el 19/oct. Puedes usar la HU 5.1 de German como modelo. ¿La tienes para hoy en la noche?

## 4. Pendientes que no son de la Segunda Entrega

- **PR por revisar y fusionar** (los fusiona Sebastian): #49, #50 y #51 (documentación, maqueta y
  semáforo), #58 (HU 1.1) y #59 (HU 2.1) de Samuel, #44 (HU 6.1) y #45 (HU 8.1).
- Para ver GitHub desde esta computadora: entrar con la cuenta universitaria
  (`gh auth login` con `sebastianmoreno1793`) o invitar a `sebassmoreno` como colaborador.

## 5. Revisión a fondo de lo entregado (01/nov/26, tarde)

Criterios: láminas U05 (inicio único, decisión con su notación, unión, acción atómica con un
verbo), plantilla ERS v2.0 y el anuncio «Criterios de corrección del artefacto ERS». Se contrastó
cada texto con el Brief aprobado y con el código de `main`.

### German · HU 5.1 (especificación y diagrama)

| # | Hallazgo | Gravedad | Corrección |
|---|---|---|---|
| 1 | Nodo «Distingue con otro color los de solo profesores **y** muestra la leyenda»: dos acciones en un nodo. La lámina pide acción atómica. | **Puede costar 1 pt del diagrama** | Separarlo en «Distingue los de solo profesores» → «Muestra la leyenda» |
| 2 | «Carga el mapa del Campus Montalbán (OpenStreetMap)» en el diagrama y «usa OpenStreetMap» en Restricciones | Alta (contradice D-007 y la app) | «Carga la maqueta del Campus Montalbán»; restricción: maqueta propia, sin costo |
| 3 | RN2 y criterio 2: los de solo profesores van «en un color distinto». La app los dibuja con **borde punteado**, y el color está reservado al semáforo (D-009). | Media (en la defensa del 10/nov el criterio 2 no se cumpliría) | «se distinguen con borde punteado y la leyenda lo explica» |
| 4 | Épica «Gestión de estacionamientos»; en el Brief aprobado es **Gestión de Puestos** | Baja (la profesora ya reclamó la trazabilidad) | Cambiar el nombre |

Lo que está bien: card con un verbo, las seis partes de la Conversación, criterios
Dado/cuando/entonces comprobables (el de 360 px es muy bueno), guardas en todas las decisiones,
uniones en su sitio y PNG adjunto.

### German · RNF 1 (comportamiento temporal)

Bien: frase «El sistema debe…», característica y subcaracterística correctas, cita del rango de
calidad del Brief, números y procedimiento de prueba. Para que sea testeable sin ambigüedad:
- «4G» no es un valor fijo: Chrome trae «Fast 4G» y «Slow 4G». Fijar el perfil (o los números:
  bajada, subida y latencia).
- Decir cuándo termina la medición: «hasta que se ven todos los estacionamientos con su color».

### Samuel · PR #58 (HU 1.1) y #59 (HU 2.1)

No se pudieron revisar: ni `gh` ni Chrome tienen acceso al repo de `sebastianmoreno1793`. En
Trello marcó «Diseñar», «Implementar» y «Probar» en las dos HU, pero la especificación de la 1.1
sigue en 0/5.

### Sebastian · HU 9.1 (autorrevisión)

Corregido en el archivo y en la descripción de Trello:
- La restricción decía que los tres tipos de problema venían del **Brief**, y el Brief no los
  nombra: vienen del criterio de la Iteración 1 (Issue #11).
- La épica citaba un impacto que no está en el Brief; ahora usa el del Mapa de Impacto
  («avisan cuando hay un problema»).
- El escenario tenía una alternativa (estacionamiento ya elegido desde la tarjeta) que el
  diagrama no dibuja: pasó a la regla RN5.
- El primer nodo del diagrama tenía una «o» («desde el menú o desde la tarjeta»): ahora es
  «Abre la opción «Reportar»». PNG reemplazado en Trello (01/nov).

### Propuesta de los RNF (escrita por Sebastian el 27/oct, en la tarjeta de RNF)

- La propuesta 2 dice «el estacionamiento **con más puestos libres**… con los colores del
  semáforo». Desde D-009 el semáforo solo dice hay o no hay puesto: debe ser «un estacionamiento
  donde hay puesto».
- La propuesta 3 dice «se muestra como «sin datos»», y el rango del Brief dice «**ocultar** solo
  ese estacionamiento». Debe decir que el sistema oculta su ocupación.
- **Corregidas en la tarjeta de RNF el 01/nov** (el RNF 1 de German quedó intacto). Hallazgos nuevos de la HU 5.1 y del RNF 1 comentados a German en su tarjeta.

## 6. Revisión del código (Pull Requests), 01/nov/26 noche

Con acceso al repo (`gh` como `sebastianmoreno1793`). Se ensayó la fusión en una copia aparte, en
el orden `main` → #49 → #50 → #51 → #58 → #59, y luego #44 y #45, y se corrió `npm test`.

| PR | Autor | Veredicto | Pruebas |
|---|---|---|---|
| #49, #50, #51 (maqueta, docs, semáforo) | Sebastian | Se fusionan limpio, en ese orden (#51 apunta a la rama de #50) | 48/48 |
| #58 · HU 1.1 | Samuel | **Buen código, pero rompe el simulador** (ver abajo). Conflicto con #51 en `app/page.js` | 67/67 con #59 |
| #59 · HU 2.1 | Samuel | Bien. Depende de #58. Mismo conflicto en `app/page.js` | 67/67 |
| #44 · HU 6.1 | German | Bien. Conflicto pequeño en `lib/almacen.js` (quedarse con las dos partes) | 84/84 |
| #45 · HU 8.1 | Manuel | **No fusionar todavía** | — |

### #58 (HU 1.1) · Samuel

Bien: solo acepta los dos dominios UCAB, la contraseña se guarda con hash y sal (scrypt) y se
compara en tiempo constante, la cookie es `httpOnly`, el correo se normaliza, el usuario de
prueba solo existe en desarrollo y tiene 11 pruebas que siguen el criterio de aceptación.

Problemas:
1. **Rompe la maqueta 3D (HU 3.2).** `obtenerUsuarioActual()` ahora exige la cookie de sesión.
   El puente del simulador (`RadarEstacionamientos_simulador/app/api/base/[...ruta]/route.js`)
   no la reenvía, así que `GET/POST /api/incidencias`, `PATCH /api/estacionamientos/:id` y
   `POST /api/pruebas/reiniciar` responden 401/403. Los sensores y la garita siguen funcionando,
   porque usan la clave de sensor. Arreglo mínimo, del lado del simulador: reenviar el encabezado
   `cookie` del navegador (las cookies no distinguen puerto, así que llegan a :3001). Hay que
   iniciar sesión en la app con el usuario de prueba antes de usar la maqueta. También queda rota
   la colección de Postman.
2. Conflicto con #51 en `app/page.js`: #51 reemplazó `MapaCampus` por `MaquetaCampus`. Al
   resolverlo, «Salir», el correo y «Mis vehículos» van al menú (`MenuPrincipal`), no a un
   encabezado.
3. No se comprueba que el correo sea de quien lo escribe: cualquiera puede crear una cuenta con
   el correo UCAB de otra persona. Está bien para la Iteración 1, pero va en las Restricciones de
   la especificación (pregunta abierta 1).
4. En producción no hay ningún administrador: `/admin` queda inaccesible hasta resolver la
   pregunta abierta 2.

### #59 (HU 2.1) · Samuel

Bien: la placa se normaliza (mayúsculas, sin guiones ni espacios), se valida con 6 o 7 letras y
números y es única; cada usuario solo ve sus vehículos (RNF 4); tiene 8 pruebas. Observación: si
alguien registra primero la placa de otra persona, el dueño real ya no puede registrarla, y el
mensaje confirma que esa placa existe. Hace falta un camino para reclamarla (con vigilancia).

### #45 (HU 8.1) · Manuel

1. **Trae el código de Samuel sin revisar:** el 31/oct fusionó `hu-2.1-vehiculos` dentro de su
   rama. Si se fusiona el #45, entran también el #58 y el #59. Tiene que quitar ese merge
   (rebase sobre `main`) para que el PR traiga solo la HU 8.1.
2. **Su propio `public/sw.js`** choca (add/add) con el único `sw.js` de la PWA (⭐ D-008), que ya
   trae los manejadores `push` y `notificationclick`. Debe borrarlo y usar el de #51.
3. **Clases de Tailwind** (`bg-blue-600`, `text-sm`…) en un proyecto que no usa Tailwind: el
   botón sale sin estilo. Debe usar `globals.css` / `formularios.module.css` y el diseño D-007.
4. **Íconos que no existen:** `/favicon.ico`, `/icon-192.png`, `/badge.png`. Los de verdad son
   `/icono-192.png` y `app/icon.svg`.
5. **El criterio de aceptación no se cumple:** pide que, si el usuario no acepta, «puede
   activarlas después desde su perfil»; el componente le dice que cambie los ajustes del
   navegador, y no hay perfil.
6. Menores: `package-lock.json` vacío en la raíz del repo, archivo `botonNotificaciones.js` en
   minúscula (el resto de componentes usa PascalCase), `alert()`, y si el registro del Service
   Worker falla, `serviceWorker.ready` se queda esperando para siempre.

Lo bueno: `GestorNotificaciones` recibe sus dependencias por el constructor y tiene pruebas
completas (permiso concedido, negado y sin soporte).

### #44 (HU 6.1) · German

Bien: las acciones y la página exigen el rol de administrador, quitar un edificio pide una
segunda confirmación y tiene 17 pruebas. Falta: el título del PR («Mantener…») no usa el nombre
del Brief («Registrar y actualizar el catálogo de edificios UCAB»), y `obtenerAlmacen()` debe
completar también `edificios ??= …`, igual que hace con las otras listas.

### Orden de fusión recomendado

1. #49 → #50 → cambiar la base de #51 a `main` → #51.
2. #58, resolviendo `app/page.js` y **con el arreglo del puente del simulador en el mismo
   momento** (o justo antes).
3. #59.
4. #44 (resolver `lib/almacen.js`).
5. #45 solo después de que Manuel quite el merge de Samuel, su `sw.js`, Tailwind y los íconos.
