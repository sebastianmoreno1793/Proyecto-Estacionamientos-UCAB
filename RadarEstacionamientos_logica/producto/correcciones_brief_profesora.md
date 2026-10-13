# Correcciones al Brief según la profesora

**Estado:** 🟡 Listo para pegar en el Google Doc del equipo (el Brief vive allá; esta carpeta no puede editarlo). Fecha de los comentarios: 09/oct/26. Se hablan en clase el martes 13/oct.

## Qué comentó y cómo se resolvió

| Comentario | Resolución |
|---|---|
| "No les quedó claro el concepto de épica" | Épicas con nombre de capacidad; ver `backlog_y_iteraciones.md`. |
| Aforo: el cálculo es una consulta; debe haber registro/actualización por sensores | HU 4.1 pasó a **Actualizar** el aforo con cada aviso (escribe) y HU 4.2 a **Consultar** el semáforo (lee). |
| "Lo que llaman radar es gestión de estacionamientos (visualización, creación, etc.)" | Épica 5 = **Gestión de estacionamientos**: ver mapa, colores, detalle, habilitar/capacidad (5.4) y crear/modificar/quitar (5.5). |
| "Administración es simplemente Incidencias con su CRUD" | Épica 9 = **Gestión de incidencias** con crear (9.1), actualizar estado (9.2), leer (9.3) y corregir/eliminar (9.4). Capacidad → 5.4; catálogo NRC → 2.5. *Por confirmar el martes.* |
| Entregable: "aquí va la épica y qué historia hará cada uno" | Tabla 1 corregida (abajo). |
| Notificaciones / "¿cuál es la épica?" / gestión de incidencias | Cada fila nombra su épica (abajo). |
| Rangos de calidad: "mismo tipo que el anterior, lo hablamos el martes" | Sin cambios; se deja así y se conversa en clase. |
| Trello: las tácticas son del examen | Issues 33–39 (entregas del curso) cerrados; Trello sin tarjetas de la materia. |
| Trello: historias no coinciden con el backlog (trazabilidad) | Mismos códigos y nombres en Backlog, Tabla 3, Issues y tarjetas. |
| Trello: "¿no se van a reunir nunca?" | Cuatro tarjetas de reunión con fecha. |
| Trello: actividades por historia incompletas | Cada historia con 4 actividades y fechas (Issue y tarjeta). |

## Sección 1 · Tabla 1 (Mapa de Impacto) corregida

La **Meta** es el objetivo de negocio (cómo se cumple el impacto) y las **épicas son los entregables**: van en la columna Entregable con las historias de la Iteración 1 (sin indicar responsables). Imagen de referencia: `tabla1_mapa_de_impacto_corregida.png`.

| Meta | Personas | Impacto | Entregable (épica → historias) |
|---|---|---|---|
| Consultar estacionamientos | Estudiantes y profesores | Saben dónde hay puestos libres antes de entrar | **Gestión de estacionamientos (épica 5):** Ver el mapa del campus — HU 5.1 · **Aforo (épica 4):** Actualizar el aforo — HU 4.1 · Consultar el semáforo — HU 4.2 · **Registro de entradas y salidas (épica 3):** HU 3.1 · HU 3.2 |
| Llegar a clase a tiempo | Estudiantes y profesores | Llegan más rápido a su salón | **Sugerencia de estacionamiento (épica 7):** HU 7.2 · **Notificaciones (épica 8):** HU 8.1 · **Edificios y distancia a pie (épica 6):** HU 6.1 |
| Seguridad | Comunidad UCAB | Solo entra quien tiene correo UCAB y cada quien ve lo de su rol | **Autenticación y perfiles (épica 1):** HU 1.1 y HU 1.2 |
| Seguridad | Conductores y Vigilancia | Los problemas se reportan y se atienden más rápido | **Gestión de incidencias (épica 9):** Reportar una incidencia — HU 9.1 |
| Administración | Planta Física | Controlan cuántos puestos hay y cuándo se llena el campus | **Gestión de estacionamientos (épica 5):** Habilitar y fijar capacidad — HU 5.4 · **Reportes de afluencia (épica 10):** R2 |

> Las metas se conservan como estaban; lo que cambia es el Entregable. Una épica puede servir a dos metas con historias distintas (épica 5).

## Sección 2 · Reparto de épicas

Ver la tabla de `backlog_y_iteraciones.md`. Figma debe actualizarse con los mismos nombres y códigos.

## Sección 5 · Tabla 3 corregida (Ejecución)

Cambian tres filas; el resto igual:

| Responsable | Tarea | Inicio | Fin |
|---|---|---|---|
| Aaron Zarraga | HU 4.1 Actualizar el aforo con cada entrada o salida | 12/10/2026 | 16/10/2026 |
| Aaron Zarraga | HU 4.2 Consultar el semáforo de ocupación | 12/10/2026 | 16/10/2026 |
| Sebastian Moreno | HU 5.4 Habilitar estacionamientos y fijar su capacidad (antes HU 10.1) | 05/10/2026 | 09/10/2026 |

Texto a agregar bajo la tabla: "Cada historia tiene cuatro actividades: diseño, desarrollo, pruebas contra el criterio de aceptación y revisión del Pull Request, con las fechas indicadas en su tarjeta de Trello."

La Tabla 4 ya incluye las reuniones; en Trello son tarjetas propias (05/oct, 09/oct, 16/oct y cierre).

## Fila para el Histórico de Revisiones

| Fecha | Versión | Descripción | Autor(es) |
|---|---|---|---|
| 13/oct/26 | 1.0 | Corrige el Brief según los comentarios de la profesora: épicas con nombre de capacidad (Gestión de estacionamientos, Aforo, Gestión de incidencias), historias de escritura y de lectura separadas, Mapa de Impacto con épica e historia por integrante, plan de trabajo sin actividades de la materia, con reuniones y actividades por historia. | Samuel Goncalves, Aaron Zarraga, German Alfonzo, Manuel Rosales, Sebastian Moreno |

## Pendiente del equipo

- [ ] Pegar estas correcciones en el Google Doc y actualizar la Figura 1 y 2 (mapa) y la Figura 3 (Trello).
- [ ] Corregir el Mapa de Figma con los nuevos nombres y códigos.
- [ ] Renombrar las tarjetas de Trello (HU 4.1, 4.2, 10.1 → 5.4) y agregar reuniones y actividades; quitar las tarjetas de la lista "Entregas del proyecto".
- [ ] Confirmar con la profesora el destino de la épica 10.
