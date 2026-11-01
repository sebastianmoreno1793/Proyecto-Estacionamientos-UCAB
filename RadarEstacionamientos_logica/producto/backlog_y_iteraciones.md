# Backlog e iteraciones

**Estado:** 🟢 Vigente — alineado el 27/oct/26 con el **Brief aprobado** (Google Doc del 16–17/oct/26, «OK con el brief» de la profesora el 19/oct). Los nombres de las HU son los del Brief y del Trello. Si cambia el Brief, se cambia aquí también.

## Cómo se lee

- **Épica** = una capacidad grande del sistema (se nombra con sustantivo).
- **Historia (HU)** = una acción concreta de una persona dentro de la épica. Cada historia **escribe** (crea/actualiza/elimina) o **lee** (consulta); un cálculo interno no es historia.
- Los números de HU y de Issue se conservaron para no perder trazabilidad. Lo que cambió de épica lleva "antes HU x.y".

## Épicas e historias

| Épica (número de los Issues) → en el Brief aprobado | Responsable | R1 (Iteración 1) | R2 (siguientes) |
|---|---|---|---|
| 1 Autenticación y perfiles → Gestión de perfiles | Samuel | 1.1 Crear cuenta con el correo institucional | 1.2 Detectar si es estudiante o profesor · 1.3 Mantener la sesión iniciada de forma segura |
| 2 Vehículos, favoritos y NRC → Gestión de perfiles | Samuel | 2.1 Registrar mis vehículos | 2.2 Favoritos · 2.3 Registrar mis NRC · 2.4 Edificio y aula · 2.5 Cargar catálogo de NRC |
| 3 Registro de entradas y salidas → igual | Aaron | 3.1 Recibir avisos de entrada y salida · 3.2 Simular sensores y placas (la maqueta 3D, ver D-006) | 3.3 Escenarios de prueba |
| 4 Aforo → igual | Aaron | 4.1 **Actualizar** el aforo con cada entrada o salida (escribe) · 4.2 **Consultar** el semáforo de ocupación (lee) | 4.3 Actualizar el mapa al instante · 4.4 Ver estacionamientos sin datos · 10.2 Ver gráficos de ocupación por hora y día |
| 5 Gestión de estacionamientos → Gestión de Puestos | German / Sebastian | 5.1 Consultar los estacionamientos en el mapa del campus (German) · 5.4 Modificar la capacidad y el estado de un estacionamiento (Sebastian) | 5.2 Colores en vivo · 5.3 Detalle · 5.5 Crear y eliminar un estacionamiento |
| 6 Edificios y distancia a pie → Gestión de Puestos | German | 6.1 Registrar y actualizar el catálogo de edificios UCAB | 6.2 Distancia caminando · 6.3 Filtros motos / movilidad reducida |
| 7 Sugerencia de estacionamiento → Sugerencia y notificaciones | Manuel | 7.2 Sugerir el estacionamiento libre más cercano | 7.1 Tomar en cuenta el horario de clases · 7.3 Puestos docentes |
| 8 Notificaciones → Sugerencia y notificaciones | Manuel | 8.1 Activar las notificaciones | 8.2 Aviso en la garita · 8.3 Abrir mapa sugerido |
| 9 Gestión de incidencias (CRUD) → Gestión de Incidencias | Sebastian | 9.1 Crear una incidencia | 9.2 Actualizar el estado de una incidencia (vigilancia) · 9.3 Consultar el listado y el estado de las incidencias · 9.4 Eliminar una incidencia |
| 11 Ranking de puntos → igual *(pedida por la profesora; sin responsable)* | por asignar | — | 11.1 Calificar un estacionamiento · 11.4 Ver el ranking de puntos de los usuarios *(11.2 y 11.3 se archivaron en Trello el 16/oct)* |

> **Cómo agrupa el Brief aprobado (Mapa de Impacto, Tabla 1):** Puestos → Gestión de Puestos,
> Aforo y Registro de entradas y salidas · Seguridad → Gestión de Incidencias · Ranking → Ranking de
> puntos · Administración → Gestión de Puestos (crear/eliminar, capacidad y estado, catálogo de
> edificios) y Aforo (gráficos) · Estacionamiento → Sugerencia y notificaciones, y Gestión de
> perfiles. Los números de HU se conservaron para no romper la trazabilidad con GitHub. La épica 10
> (Reportes) desapareció: su HU 10.2 quedó en Aforo y la 10.3 se archivó. **Confirmar con Samuel**
> que el Figma del Brief agrupa igual.

## Plan de la Iteración 1 (05/oct/26 → 16/oct/26) · Tabla 3 del Brief aprobado

| Responsable | Semana 1 (05–09/oct) | Semana 2 (12–16/oct) |
|---|---|---|
| Samuel | HU 1.1 | HU 2.1 *(reemplaza a la 1.2 desde el 16/oct)* |
| Aaron | HU 3.1, 3.2 | HU 4.1, 4.2 |
| German | HU 5.1 | HU 6.1 |
| Manuel | HU 8.1 | HU 7.2 |
| Sebastian | HU 5.4 | HU 9.1 |

Estado al 27/oct/26: ver `revision_27oct_equipo_vs_profesora.md`.

**Actividades por historia** (checklist de cada tarjeta de Trello, según la pizarra de la clase del 13/oct): Especificar (criterio 1, 2 y 3) → Diseñar (interfaz, arquitectura, algoritmos, estructura de datos) → Implementar → Probar → Corregir → Probar de nuevo → Desplegar. *Las cuatro partes de "Diseñar" se leyeron de la foto de la pizarra: confirmar con el equipo.*

Los criterios de aceptación de la Iteración 1 están en la descripción de cada tarjeta de Trello y en su Issue (el Brief aprobado ya no trae la tabla de criterios). La **especificación completa** (Card, Conversación y Criterios, Plantilla ERS) se hace para la Segunda Entrega, en Trello.
