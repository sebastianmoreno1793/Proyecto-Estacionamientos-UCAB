# Backlog e iteraciones

**Estado:** 🟢 Vigente — corregido el 13/oct/26 (dos rondas) según los comentarios de la profesora (Google Doc del Brief, 09/oct/26) y lo hablado en clase. Si cambia el Brief, se cambia aquí también.

## Cómo se lee

- **Épica** = una capacidad grande del sistema (se nombra con sustantivo).
- **Historia (HU)** = una acción concreta de una persona dentro de la épica. Cada historia **escribe** (crea/actualiza/elimina) o **lee** (consulta); un cálculo interno no es historia.
- Los números de HU y de Issue se conservaron para no perder trazabilidad. Lo que cambió de épica lleva "antes HU x.y".

## Épicas e historias

| Épica | Responsable | R1 (Iteración 1) | R2 (siguientes) |
|---|---|---|---|
| 1 Autenticación y perfiles | Samuel | 1.1 Entrar con correo UCAB · 1.2 Detectar estudiante o profesor | 1.3 Sesión segura |
| 2 Vehículos, favoritos y NRC | Samuel | — | 2.1 Vehículos · 2.2 Favoritos · 2.3 NRC · 2.4 Edificio y aula · 2.5 Cargar catálogo de NRC (antes 10.4) |
| 3 Registro de entradas y salidas | Aaron | 3.1 Recibir avisos de entrada y salida · 3.2 Simular sensores y placas | 3.3 Escenarios de prueba |
| 4 Aforo | Aaron | 4.1 **Actualizar** el aforo con cada entrada o salida (escribe) · 4.2 **Consultar** el semáforo de ocupación (lee) | 4.3 Actualizar el mapa al instante · 4.4 Ver estacionamientos sin datos (antes 9.3) |
| 5 Gestión de estacionamientos (antes "Mapa del campus") | German | 5.1 Ver el mapa del campus · 5.4 Habilitar y fijar capacidad (antes 10.1; la hizo Sebastian) | 5.2 Colores en vivo · 5.3 Detalle · 5.5 Crear, modificar y quitar estacionamientos |
| 6 Edificios y distancia a pie | German | 6.1 Catálogo de edificios | 6.2 Distancia caminando · 6.3 Filtros motos / movilidad reducida |
| 7 Sugerencia de estacionamiento | Manuel | 7.2 Sugerir el más cercano | 7.1 Usar horario · 7.3 Puestos docentes |
| 8 Notificaciones | Manuel | 8.1 Activar notificaciones | 8.2 Aviso en la garita · 8.3 Abrir mapa sugerido |
| 9 Gestión de incidencias (CRUD) | Sebastian | 9.1 Reportar incidencia (crear) | 9.2 Atender: cambiar estado (actualizar) · 9.3 Ver listado y estado (leer) · 9.4 Corregir o eliminar (eliminar) |
| 10 Reportes de afluencia | Sebastian | — | 10.2 Gráficos por hora y día · 10.3 Reportes PDF/CSV |
| 11 Ranking de puntos *(nueva, pedida por la profesora; sin responsable)* | por asignar | — | 11.1 Calificar un estacionamiento · 11.2 Escribir comentarios · 11.3 Ganar puntos por reportar y calificar · 11.4 Ver el ranking de usuarios *(historias propuestas, por confirmar)* |

> **Por confirmar con la profesora (martes 13/oct):** ella escribió "Administración es simplemente Incidencias con su CRUD". Se interpretó así: lo administrativo se repartió (capacidad → épica 5, catálogo NRC → épica 2) y las incidencias quedaron como CRUD completo. La épica 10 quedó solo con los reportes de afluencia; si ella prefiere eliminarla, 10.2 y 10.3 pasarían a la épica 4 (Aforo).

## Plan de la Iteración 1 (05/oct/26 → 16/oct/26)

| Responsable | Semana 1 (05–09/oct) | Semana 2 (12–16/oct) |
|---|---|---|
| Samuel | HU 1.1 | HU 1.2 |
| Aaron | HU 3.1, 3.2 | HU 4.1, 4.2 |
| German | HU 5.1 | HU 6.1 |
| Manuel | HU 8.1 | HU 7.2 |
| Sebastian | HU 5.4 (antes 10.1) | HU 9.1 |

**Actividades por historia** (checklist de cada tarjeta de Trello, según la pizarra de la clase del 13/oct): Especificar (criterio 1, 2 y 3) → Diseñar (interfaz, arquitectura, algoritmos, estructura de datos) → Implementar → Probar → Corregir → Probar de nuevo → Desplegar. *Las cuatro partes de "Diseñar" se leyeron de la foto de la pizarra: confirmar con el equipo.*

Los criterios de aceptación de cada historia están en el Brief (sección 2.1) y en su Issue.
