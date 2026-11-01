# HU 9.1 · Crear una incidencia — Especificación ERS (Segunda Entrega)

**Estado:** 🟢 Subida a Trello el 01/nov/26 (descripción, PNG adjunto y checklist ERS en 5/5). Va en la descripción de la
tarjeta «HU 9.1 · Crear una incidencia», debajo del Issue, igual que hizo German en la HU 5.1.
Comprobada contra el código de `main` (`lib/incidencias/`, `app/incidencias/nueva/`): las pruebas
de «reportar una incidencia» pasan (48/48 el 01/nov/26).

---

## Especificación ERS · Segunda Entrega

**Especificada por:** Sebastian Moreno

### 1. Historia de Usuario (Card)

**Como** conductor de la comunidad UCAB (estudiante o profesor), **quiero crear** una incidencia
sobre un estacionamiento, **para** que vigilancia sepa del problema y lo atienda.

### 2. Conversación

**Épica:** 9 · Gestión de Incidencias (R1). Viene de la meta Seguridad del Mapa de Impacto: los
estudiantes y profesores avisan cuando hay un problema en un estacionamiento.

**Escenario de uso:**

1. El conductor abre la opción «Reportar», desde el menú o desde la tarjeta de un
   estacionamiento del mapa.
2. El sistema verifica que tenga la sesión iniciada. Si no la tiene, le pide iniciar sesión
   (HU 1.1) y el conductor entra con su correo institucional.
3. El sistema muestra el formulario con los estacionamientos abiertos y los tres tipos de
   problema.
4. El conductor elige el estacionamiento.
5. El conductor elige el tipo de problema.
6. El conductor pulsa «Enviar reporte». Si se arrepiente, cierra el formulario y no se registra
   nada.
7. El sistema valida el estacionamiento y el tipo. Si falta alguno, le indica qué debe elegir y
   el conductor vuelve al paso 4.
8. El sistema registra la incidencia con la fecha, la hora y el estado «pendiente».
9. El sistema muestra la confirmación con el estacionamiento, el tipo, la hora y el estado.
10. El conductor lee la confirmación.

**Reglas de negocio:**

- RN1. Hay tres tipos de problema: batería descargada, conos atravesados y vehículo mal
  estacionado.
- RN2. Solo se reporta sobre estacionamientos abiertos. Los que el administrador cerró (HU 5.4)
  no aparecen en la lista.
- RN3. Toda incidencia nueva queda en estado «pendiente», con la fecha y la hora en que se
  registró. El conductor no elige el estado.
- RN4. Solo crea incidencias un usuario con sesión iniciada con su correo institucional. Queda
  registrado quién la creó, pero ese correo no se muestra a los demás usuarios.
- RN5. Si el conductor abre «Reportar» desde la tarjeta de un estacionamiento, ese
  estacionamiento ya viene elegido (puede cambiarlo).

**Alcance (lo que NO entra en esta historia):**

- Cambiar el estado de una incidencia (HU 9.2).
- Consultar el listado y el estado de las incidencias (HU 9.3).
- Eliminar una incidencia (HU 9.4).
- Adjuntar fotos o escribir una descripción libre.
- Avisar a vigilancia con una notificación en el celular (épica 8).

**Dependencias:**

- HU 1.1 · Crear cuenta con el correo institucional (para la sesión).
- Usa el catálogo de estacionamientos de la épica 5; la HU 5.4 decide cuáles están abiertos.
- HU 5.1 · la tarjeta del estacionamiento en el mapa lleva al formulario.
- Es la base de las HU 9.2, 9.3 y 9.4.

**Restricciones:**

- Solo el Campus Montalbán.
- Solo por navegador web, en computador y en celular (D-003, D-008).
- Sin costos adicionales (D-005).
- Los tres tipos de problema son los del criterio de aceptación de la Iteración 1 (Issue #11);
  otros tipos se acuerdan con vigilancia en una iteración siguiente.

### 3. Criterios de aceptación

1. **Dado** un conductor con sesión iniciada, **cuando** elige un estacionamiento abierto y un
   tipo de problema y pulsa «Enviar reporte», **entonces** la incidencia queda registrada con la
   fecha, la hora y el estado «pendiente», y el sistema le muestra la confirmación con el
   estacionamiento, el tipo, la hora y el estado.
2. **Dado** el formulario abierto, **cuando** el conductor intenta enviarlo sin elegir el
   estacionamiento o el tipo de problema, **entonces** el sistema no registra nada y le indica
   qué le falta elegir.
3. **Dado** un estacionamiento que el administrador cerró, **cuando** el conductor abre el
   formulario, **entonces** ese estacionamiento no aparece en la lista y no se puede crear una
   incidencia sobre él.

**Diagrama de actividades:** adjunto a esta tarjeta (diagrama_actividades_HU9.1.png).
