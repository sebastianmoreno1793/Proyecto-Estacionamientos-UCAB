# Documentos y anuncios de Módulo 7 (texto)

**Estado:** 🟢 Vigente — copiado el 27/oct/26 de https://modulo7.ucab.edu.ve/courses/3675.
Es el texto de cada archivo, no el archivo original. Cuando haya duda, abrir el original en
Módulo 7.

## Instrucciones de las entregas

### Primera Entrega · «IS Instrucciones Primera Entrega SEP 26»

Acuerdo con el cliente/promotor sobre lo que se va a construir. Se elabora el Brief completo
en **Google Docs, en modo edición**, para que se pueda ver el historial de versiones. Se envía el
enlace al correo mperezpu@ucab.edu.ve. El archivo se identifica como «BRIEF EQUIPO XX X». El
proyecto debe ser **web** y el tópico lo elige el equipo.

### Segunda Entrega · «IS Instrucciones Segunda Entrega SEP 26» (23/oct/26)

**Documentación del Primer Sprint.**
- Se elaboran las especificaciones de las Historias de Usuario y de los requisitos no
  funcionales, en la versión de **Trello** del proyecto.
- El archivo se identifica como «EQUIPO XX X» y el enlace se envía por correo a mperezpu@ucab.edu.ve.
- En las especificaciones de las HU de este Primer Sprint, **cada miembro del equipo especifica
  una Historia de Usuario** y se indica en cada caso quién la especificó.
- Se agrega una **actividad adicional** con la especificación de los **Requisitos No Funcionales**.
- Cada miembro elabora un **Diagrama de Actividades** de la HU que especificó y lo anexa a la
  descripción de esa HU.
- El diagrama debe ser un **enlace de fácil revisión** para la profesora. «Nada de enlaces con
  las herramientas de diagramación».

### Criterios de corrección del artefacto ERS (anuncio de la profesora)

- Especificación de la HU: **1 punto**. La card debe tener un solo verbo.
- Diagrama de actividades de la HU: **3 puntos**. Cada error vale un punto.
- Especificación de los RNF: **2 puntos cada uno**. Solo se especifican los RNF asociados a los
  rangos de calidad (RC), **cuatro en total**. Cada RC se asocia a una subcaracterística de la ISO
  25010. La especificación debe ser **testeable**: un probador experto en calidad de software
  tiene que poder elaborar un caso de prueba objetivo.

### Táctica arquitectónica · «Instrucciones para la Actividad TA MAR 26»

1. Se trabaja con el equipo de proyecto. 2. Se investiga la táctica arquitectónica asignada.
3. Se prepara una presentación de **solo 3 láminas**: a) nombre y descripción de la táctica,
b) usos frecuentes, c) ideas para su especificación. 4. Puede ser ppt o video. 5. Se envía al
correo institucional mperezpu@ucab.edu.ve. El material de apoyo es el «Libro de Tácticas»
(enlace de Google Drive en la Unidad 16).

### Unidad 9 · Diseño II · «Instrucciones v7» (26/oct/26)

1. Leer el objetivo de la Unidad 9. 2. Estudiar las láminas de la Unidad 9. 3. Realizar la
**Actividad 4 A (0,5 puntos)**. *Al 27/oct todavía no hay láminas de la U9 en Módulo 7.*

### Actividad extra (Gestión de Proyectos)

Leer las preguntas hechas al Ing. Parada, oír sus respuestas (audio en Drive), reflexionar sobre
la gestión de proyectos TIC y responder la evaluación (10 minutos, un intento).

## Plantillas

### Brief Ágil v2.0 y guía «Cómo se elabora el Brief v10»

El Brief es el acuerdo escrito con el cliente («una orden de pedido»), escrito **en lenguaje de
negocio**. Es un artefacto, así que lleva nombre, versión, fecha, histórico de revisiones (con
descripción precisa y autores) y tabla de contenido. Secciones: 1. Necesidad (Mapa de Impacto:
Meta · Personas · Impacto · Entregable), 2. Backlog (Mapa de Historias de Usuario con releases),
3. Restricciones, 4. Rangos de calidad (lo que no es funcionalidad: desempeño, robustez,
tolerancia a fallas, usabilidad) y 5. Plan de trabajo de la primera iteración (Trello, sin pedir
autorización para verlo).

### Plantilla ERS Ágil v2.0 (Especificación de Requisitos de Software)

Detalla los requisitos en dos aspectos: las HU de cada Sprint, especificadas según el modelo
Canvas, y las especificaciones suplementarias.

**1. Sprint → 1.1 Sprint 1 → 1.1.x Historia de Usuario** (una tabla por HU):

| # | Campo | Qué va |
|---|---|---|
| 1 | Historia de Usuario | «Como <quién> quiero <qué> para <objetivo>». Ejemplo: «Como vendedor, quiero registrar los productos y cantidades que me solicita un cliente para crear un pedido de venta». |
| 2 | Conversación | Épica de la cual se deriva, escenario de uso, reglas de negocio que la afectan, alcance, dependencias y cualquier otra restricción |
| 3 | Criterios de aceptación | Las condiciones de satisfacción; son un acuerdo |

**2. Requisitos suplementarios.** Son RNF orientados al sistema. Deben indicar **parámetros,
valores, porcentajes o rangos de aceptación** para orientar las pruebas (ejemplo: «El sistema
debe manejar tiempos de respuesta para las consultas de 0,3 segundos»). Se parte de lo que dice
el Brief. Un apartado por característica ISO 25010, cada uno con «Nombre y descripción del
requerimiento»:

| § | Característica | Ejemplo de la plantilla |
|---|---|---|
| 2.1 | Eficiencia de desempeño | El sistema debe responder a cualquier búsqueda en menos de 1 segundo |
| 2.2 | Compatibilidad | El sistema debe interactuar con el servidor de correo de la empresa |
| 2.3 | Capacidad de interacción | El sistema debe tener capacidad de protegerse ante errores del usuario |
| 2.4 | Fiabilidad | El sistema debe mantener el SLA establecido con el cliente en los días de diciembre |
| 2.5 | Seguridad | El sistema debe cifrar la clave |
| 2.6 | Mantenibilidad | El código debe cumplir con las normas de documentación de la organización |
| 2.7 | Flexibilidad | El sistema debe poder instalarse en menos de cuatro clics |
| 2.8 | Protección | El sistema debe ser seguro de operar para el usuario |

### Plantilla CP Ágil v2.0 (Casos de Prueba, Unidad 19)

1. Lista de ideas. 2. CP para requerimientos funcionales: 2.1 HU a probar, 2.2 **escenarios**
(combinación de flujo básico y alternos, sacados de la Conversación de la HU), 2.3 casos de
prueba (escenario, id, nombre, resultado esperado, nivel). Cada CP lleva tipo, ambiente, autor,
probador, versión, fechas, condiciones, procedimiento paso a paso (condición, datos, resultado
esperado y obtenido), criterio y decisión de aprobación. 3. CP para requerimientos
suplementarios, con el mismo formato.

### Ejercicio de cualidades (Unidad 13)

Es una lista de características arquitectónicas con su pregunta guía: disponibilidad,
continuidad, rendimiento, recuperabilidad, fiabilidad, robustez, escalabilidad, elasticidad,
configurabilidad, extensibilidad, instalabilidad, reutilización, localización, mantenibilidad,
portabilidad, compatibilidad, capacidad de actualización, accesibilidad, persistencia…
*Es de arquitectura (Richards y Ford), no de la ISO 25010 del ERS.*

## Plan de evaluación (IS PLAN DE CLASE V5, 26/oct/26)

Actividades: 6 (cinco de 0,5 y una de 1,5) = 4 · Presentación de táctica = 3 · Exámenes 2 × 24
= 48 · Proyecto 3 + 12 + 9 + 13 + 8 = 45. **Total 100.** Las fechas están en `README.md`.

## Anuncios de la sección 15787 (este semestre)

| Fecha | Anuncio |
|---|---|
| 29/sep | Cambio del plan de evaluación (solo fechas), porque no se hizo la Actividad 2 |
| 08/oct | Revisión del Brief: equipos 87 1–4 el mar 13/oct; 87 5–8 el jue 15/oct |
| 15/oct | Calificaciones del Brief, sección 15787 (equipo 87 3: **2,1/3**). Reclamos por correo a mperezpu@ucab.edu.ve |
| 15/oct | Primer Examen: sáb 24/oct, 8:00 a.m., aula A-11 |
| 15/oct | Actividades 2 (mar 20/oct) y 3 (jue 22/oct): evaluadas, presenciales, con todo el equipo |

*Los demás anuncios del curso son de semestres anteriores (vienen copiados). Sirven para ver
cómo corrige, pero sus fechas no aplican.*

## Comentarios de la profesora sobre nuestro proyecto

### En el Google Doc del Brief (09/oct/26)

- «no les quedó claro el concepto de épica»
- «La épica Aforo: su cálculo no es más que una consulta, debe haber un registro o actualización
  por los sensores. La segunda historia de esta épica es una actualización según información de
  los sensores. NO tiene claro este concepto de historia tampoco.»
- «Lo que llaman radar, es gestión de estacionamientos, su visualización, creación, etc.»
- «Administración es simplemente Incidencias con su CRUD»
- «Las tácticas no tienen nada que ver con el proyecto, sino con el examen. Las historias no
  coinciden con las del backlog, tiene problemas de trazabilidad. ¿No se van a reunir nunca? Y
  las actividades por historia están incompletas.»
- «ok» en Restricciones.

### En Trello (19/oct/26)

- Tarjeta «Brief del proyecto (Entrega 1)»: «OK con el brief».
- Tarjeta «HU 1.1»: «Falta la especificación de la historia como actividad para construir la
  Historia. La harán para la segunda entrega del proyecto».
- Tarjeta «Reunión 2 · Seguimiento»: «¿ustedes no se van a reunir???».
