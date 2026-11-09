# Revisión · HU 1.1 · Crear cuenta con el correo institucional (Samuel Goncalves)

Foto del tablero: 03/nov/26 ~12:00 p. m. Última edición de Samuel: 03/nov 01:44 UTC (corrigió el CA2 y el Alcance, y subió la tabla nueva). El diagrama no cambia desde el 01/nov 23:06 UTC.

**Veredicto:** la especificación está bien (un verbo, tabla correcta, CA2 ya corregido), pero el diagrama sigue con los **3 errores** que se le marcaron el 02/nov. Hay que corregirlos antes de enviar.

**Puntaje estimado hoy: 1 + 0 = 1/4** (si la profesora no cuenta los conectores, 1 + 1 = 2/4). **Con las correcciones de abajo: 1 + 3 = 4/4.**

---

## 1. Qué se revisó

| Material | Estado |
|---|---|
| Tarjeta (descripción, checklists, adjuntos, comentarios) | `tarjeta.md` + historial de `board.json` |
| Tabla vigente | `HU_1.1_Especificación.png` (portada, 03/nov 01:44) |
| Diagrama vigente | `HU_1.1_Diagrama_de_actividades.png` (01/nov 23:06) |
| Enlace viewer.diagrams.net | `drawio_enlace_0.xml` = `drawio_enlace_1.xml` (los dos enlaces de la descripción son el mismo) |
| Modelo | `HU9.1_Sebastian/` (tabla y diagrama v2) |

**El enlace y el PNG muestran exactamente lo mismo**: comparé las 86 celdas del XML (textos, posiciones, flechas) con la imagen. El XML se decodifica sin problemas, así que el enlace abre sin pasos previos. No pude abrirlo en un navegador para comprobarlo en vivo.

---

## 2. Hallazgos (ordenados por gravedad)

| # | Gravedad | Puntos en riesgo | Dónde | Qué pasa | Corrección concreta |
|---|---|---|---|---|---|
| 1 | 🔴 | −1 diagrama | Diagrama, acción «6.1) Cancela el proceso de creación de cuenta» | Está en el **carril del Sistema** (x = 400–600; el carril del Sistema empieza en x = 360), con su fin y su nota. Quien cancela es el estudiante o profesor. **Ya se le marcó el 02/nov (punto 1) y no se corrigió.** | Mover «6.1)», su nodo final y su nota «Finaliza el Caso de Uso» al carril «Estudiante / Profesor», a la izquierda de «6)», como «6.1) Cierra el formulario sin reportar» en la HU 9.1. Texto sugerido: **«6.1) Cancela la creación de la cuenta»**. |
| 2 | 🔴 | −1 diagrama | Diagrama, rombo debajo de «6) Presiona «Crear cuenta»» | El rombo viene **después** de presionar «Crear cuenta» y sus guardas son [Crear cuenta] / [Salir]: si ya presionó «Crear cuenta», no puede elegir salir. La flecha [Salir] baja por todo el carril del actor y cruza al Sistema. **Ya se le marcó el 02/nov (punto 2) y no se corrigió.** | Quitar el rombo de debajo del 6. Ponerlo **entre el 5 y el 6**, en el carril del actor: «5) Ingresa…» → rombo → **[Crear cuenta]** → «6) Presiona «Crear cuenta»» → «7) Verifica el dominio del correo»; y **[Cancelar]** → «6.1) Cancela la creación de la cuenta» → fin. Así está en la HU 9.1 (5 → rombo → [Enviar] / [Cancelar]). |
| 3 | 🔴 | −1 diagrama | Diagrama, conectores «6», «7», «8», «9» (cuatro sobre la barra de unión y uno bajo cada mensaje 7.1, 8.1, 9.1, 10.1) | Los conectores tienen **los mismos números que los pasos 6–9**, y todos vuelven al **paso 5**: el conector «6» parece decir «vuelve al paso 6». Se confunde con la numeración del escenario. **Ya se le marcó el 02/nov (punto 3) y no se corrigió.** | Renumerar los dos extremos de cada par: **7.1 → «1»**, **8.1 → «2»**, **9.1 → «3»**, **10.1 → «4»**, y los cuatro círculos sobre la barra **«1», «2», «3», «4»**. Así lo hacen la HU 4.1 y la HU 9.1 (conectores «1» y «2»). |
| 4 | 🟠 | parte del 1 pt de la especificación | Conversación › Escenario | Es **una sola frase** sin números: «el usuario escribe su correo y su contraseña dos veces; el sistema verifica los datos, crea la cuenta y muestra el mapa del campus». El diagrama tiene 13 pasos y 5 flujos alternos (6.1, 7.1, 8.1, 9.1, 10.1) que no aparecen en el escenario. El formato del equipo pide pasos numerados iguales a los del diagrama. **Ya se le marcó el 02/nov (punto 5) y no se corrigió.** | Pegar el escenario de la sección 4.1 (abajo), en la descripción **y** en la tabla PNG. |
| 5 | 🟠 | parte del 1 pt | Criterios de aceptación | Las reglas «contraseña de 8 o más caracteres» y «se escribe dos veces (deben coincidir)» **no tienen criterio** que las pruebe. El CA1 dice «una contraseña válida» sin decir qué es válida. Es el mismo reparo que se le hizo a Aaron («regla sin criterio que la pruebe»). | Cambiar el CA1 y agregar el CA4 (texto en la sección 4.3). |
| 6 | 🟠 | parte del 1 pt | Conversación › Reglas de negocio | «guardada cifrada» es una regla **técnica**, no de negocio (el mismo reparo que la RN1 de Manuel). Además, «el rol sale del dominio» se cruza con la **HU 1.2 · Detectar si es estudiante o profesor** (R2, backlog): la profesora ya marcó problemas de trazabilidad en el Brief. | Pasar «cifrada» a Restricciones. Decir en el Alcance o en Dependencias que la HU 1.2 detalla el rol. Texto en las secciones 4.2 y 4.4. |
| 7 | 🟡 | — | Descripción, bloque viejo «**Criterio de aceptación:**» (debajo de «Responsable») | Todavía dice «Con cualquier otro correo, el sistema **no lo deja entrar** y le explica por qué». Contradice el CA2 corregido, que es justo el punto del grupo. | Cambiar a: «Quien usa un correo @est.ucab.edu.ve o @ucab.edu.ve crea su cuenta y ve el mapa. Con cualquier otro correo, el sistema no le crea la cuenta y le explica por qué.» |
| 8 | 🟡 | — | Adjuntos | Hay 5 adjuntos y 3 son versiones viejas. «HU 1.1 · Especificación (versión anterior).png» **todavía muestra el CA2 viejo** («no lo deja entrar»). «(versión oscura, reemplazada)» no aporta nada. «Diagrama (versión anterior)» tiene más errores (guardas cambiadas, conectores «5» y «2»). | Eliminar las dos «Especificación» viejas. El diagrama viejo puede quedar como «(versión anterior)», como en la HU 9.1, o borrarse también. (Lo hace Samuel.) |
| 9 | 🟡 | — | Checklist «Especificación ERS · Segunda Entrega», último ítem | Sigue con el texto viejo: «Diagrama de actividades adjunto como imagen o PDF (no enlace a la herramienta de diagramación)». | Renombrarlo a: **«Diagrama de actividades adjunto como imagen y con enlace de draw.io que abre sin pasos previos»** (igual que en la HU 9.1). Marcarlo **solo** cuando el diagrama esté corregido. |
| 10 | 🟡 | — | Diagrama, «10.1) Muestra mensaje «Ya existe una cuenta con ese correo. Inicia sesión»» → conector → paso 5 | El mensaje lo manda a iniciar sesión, pero el flujo lo devuelve a escribir los datos en «Crear cuenta». Iniciar sesión está fuera del Alcance. | Opción simple: 10.1 → nodo final + nota «Finaliza el Caso de Uso» (y entonces quedan solo 3 conectores: 1, 2, 3). Si se deja como está, no es error grave. |
| 11 | 🟡 | — | Diagrama, «7.1) Muestra mensaje «Solo puede entrar la comunidad UCAB…»» | El texto habla de «entrar», el mismo matiz que se corrigió en el CA2. | «7.1) Muestra mensaje «Solo se crean cuentas con el correo UCAB»». |
| 12 | 🟡 | — | Conversación › Restricciones | No cita las decisiones (D-003, D-005, D-008) como el modelo. | Texto en la sección 4.4. |
| 13 | 🟡 | — | Tabla PNG | Tiene 730 × 315 px, mucho más chica que la de la HU 9.1 (2150 px de ancho). Al ampliarla en Trello se ve borrosa. | Volver a exportarla a 2× o 3× cuando se cambien el escenario y los criterios. |

### Lo que está bien (no tocar)

- **Card:** «Como estudiante o profesor de la UCAB, quiero **crear** una cuenta con mi correo institucional para ver los estacionamientos con puestos libres.» Un solo verbo ✔. Quién, qué y para qué son coherentes ✔. Nombre y épica del Brief ✔ («Gestión de perfiles»).
- **Conversación:** tiene las 6 partes ✔. Alcance claro ✔ (no confirmar correo, no recuperar contraseña, no asignar vigilancia ni administración, coherente con D-003). Dependencia HU 5.1 ✔.
- **CA2 y CA3:** comprobables y uno por caso ✔.
- **Tabla PNG:** título «HU 1.1 · Crear cuenta con el correo institucional» ✔, «Autor: Goncalves, Samuel» ✔, 3 columnas (1 Historia de Usuario | 2 Conversación | 3 Criterios de Aceptación) ✔. **El texto coincide palabra por palabra con la descripción** (Alcance nuevo y CA2 nuevo incluidos) ✔. Solo cambia la forma: la tabla escribe «@est.ucab.edu.ve» y la descripción `est.ucab.edu.ve`.
- **Diagrama, lo correcto:** título con HU y autor ✔. Carriles con cabecera azul (#dae8fc) «Estudiante / Profesor» y «Sistema» ✔. Un inicio con nota «Se inicia el Caso de Uso» y fines con «Finaliza el Caso de Uso» ✔ (líneas punteadas). Acciones con verbo y numeradas «N) …» con espacio ✔. Los 4 rombos de verificación están en el carril del Sistema, cada uno recibe **una sola flecha** y sus salidas llevan guardas entre corchetes ✔. La unión hacia el paso 5 usa **barra negra con conectores** ✔. Nodos objeto «Entrar», «Crear cuenta», «Cuenta» y «Mapa del campus» con flecha punteada ✔. Es un PNG exportado, no una captura ✔. No usa el semáforo (D-009 no aplica).
- **Descripción:** tabla embebida + enlace del diagrama + imagen del diagrama, en el orden del modelo ✔.

---

## 3. Estado de los puntos que le tocan

### Mensaje del grupo (03/nov)

| Punto | Estado |
|---|---|
| *Para todos:* enlace de viewer.diagrams.net en la descripción además del PNG | ✅ Corregido (estaba desde el 01/nov). El enlace abre el mismo diagrama que el PNG. |
| *Para todos:* tabla de 3 columnas con el Autor | ✅ Corregido (es la portada). |
| *Samuel:* CA2 «no lo deja entrar» → «no le crea la cuenta» | ✅ **Corregido** en la descripción y en la tabla (03/nov 01:42). 🟡 Queda la frase vieja en el bloque «Criterio de aceptación» de abajo y en el adjunto «Especificación (versión anterior)» (hallazgos 7 y 8). |

### Comentario de revisión del 02/nov (Sebastian)

| Punto | Estado |
|---|---|
| 1. «6.1) Cancela…» en el carril del Sistema | ❌ **Pendiente** (hallazgo 1) |
| 2. Rombo después del 6 con [Crear cuenta] / [Salir] | ❌ **Pendiente** (hallazgo 2) |
| 3. Conectores 6, 7, 8, 9 iguales a los pasos | ❌ **Pendiente** (hallazgo 3) |
| 4. Quitar los enlaces a viewer.diagrams.net | ⚪ **Ya no aplica**: el equipo decidió después dejar el enlace **y** el PNG (criterios del 03/nov). No hay que quitarlos. |
| 5. Escenario en pasos numerados | ❌ **Pendiente** (hallazgo 4) |

---

## 4. Textos listos para pegar

### 4.1 Escenario de uso (descripción y tabla)

```
**Escenario de uso:**
1. El estudiante o profesor abre el Radar.
2. El sistema muestra la interfaz «Entrar».
3. El usuario presiona «Créala con tu correo UCAB».
4. El sistema muestra la interfaz «Crear cuenta».
5. El usuario ingresa su correo institucional y la contraseña dos veces.
6. El usuario presiona «Crear cuenta». Si se arrepiente, cancela y no se crea nada (6.1).
7. El sistema verifica el dominio del correo. Si no es @est.ucab.edu.ve ni @ucab.edu.ve, le explica que solo se crean cuentas con el correo UCAB y el usuario vuelve al paso 5 (7.1).
8. El sistema verifica que la contraseña tenga al menos 8 caracteres. Si no, se lo indica y el usuario vuelve al paso 5 (8.1).
9. El sistema verifica que las dos contraseñas coincidan. Si no, se lo indica y el usuario vuelve al paso 5 (9.1).
10. El sistema verifica que el correo no tenga cuenta. Si ya la tiene, le indica que inicie sesión (10.1).
11. El sistema registra la cuenta con el rol según el dominio.
12. El sistema inicia la sesión.
13. El sistema muestra el mapa del campus.
```

(Si se aplica el hallazgo 10, el paso 10 queda así: «…Si ya la tiene, le indica que inicie sesión y termina (10.1).»)

### 4.2 Reglas de negocio

```
**Reglas de negocio:**
- RN1. Solo se crean cuentas con correo @est.ucab.edu.ve (estudiante) o @ucab.edu.ve (profesor).
- RN2. Cada correo tiene una sola cuenta.
- RN3. La contraseña tiene 8 o más caracteres y se escribe igual dos veces.
- RN4. El rol sale del dominio del correo: @est.ucab.edu.ve es estudiante y @ucab.edu.ve es profesor.
```

### 4.3 Criterios de aceptación

```
1. Con un correo @est.ucab.edu.ve o @ucab.edu.ve que no tiene cuenta y una contraseña de 8 o más caracteres escrita igual dos veces, el sistema crea la cuenta, inicia la sesión y muestra el mapa del campus.
2. Con cualquier otro correo, el sistema no le crea la cuenta y le explica por qué.
3. Con un correo que ya tiene cuenta, el sistema no crea otra y le indica que inicie sesión.
4. Con una contraseña de menos de 8 caracteres, o si las dos contraseñas no coinciden, el sistema no crea la cuenta y le indica qué corregir.
```

(Si quieren «uno por caso» estricto, el CA4 se parte en dos: «menos de 8 caracteres» y «no coinciden».)

### 4.4 Alcance, dependencias y restricciones (solo lo que cambia)

```
- **Alcance:** cubre solo la creación de la cuenta; iniciar sesión usa esta misma cuenta y su correo institucional. No incluye confirmar el correo, recuperar la contraseña ni asignar los roles de vigilancia y administración (se asignan a mano, D-003).
- **Dependencias:** HU 5.1 · Consultar los estacionamientos en el mapa del campus (se muestra al final). La HU 1.2 · Detectar si es estudiante o profesor parte del rol que guarda esta historia.
- **Restricciones:** solo el Campus Montalbán y solo la comunidad UCAB (D-003). Solo por navegador web, en computador y en celular (D-003, D-008). Sin costos adicionales (D-005). La contraseña se guarda cifrada.
```

### 4.5 Cambios del diagrama (en draw.io; luego exportar el PNG **y** regenerar el enlace)

1. Borrar el rombo de debajo de «6)». Poner un rombo nuevo entre «5)» y «6)», en el carril del actor: una sola flecha de entrada (desde 5), salida **[Crear cuenta]** hacia «6)» y salida **[Cancelar]** hacia «6.1)».
2. «6)» va directo (flecha sin guarda) a «7) Verifica el dominio del correo».
3. Mover «6.1) Cancela la creación de la cuenta» con su fin y su nota al carril «Estudiante / Profesor».
4. Renumerar los conectores: 7.1 → «1», 8.1 → «2», 9.1 → «3», 10.1 → «4», y los mismos cuatro números sobre la barra de unión.
5. (Opcional) 7.1: «Muestra mensaje «Solo se crean cuentas con el correo UCAB»». 10.1 → fin + nota en lugar del conector.
6. Exportar con Archivo › Exportar como › PNG. Reemplazar el adjunto y la imagen de la descripción. Copiar el enlace nuevo de viewer.diagrams.net en los **dos** lugares de la descripción: hoy los dos enlaces son idénticos y deben seguir siéndolo.
