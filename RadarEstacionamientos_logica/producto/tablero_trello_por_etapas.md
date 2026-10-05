# Tablero de Trello por etapas — Iteración 1

**Estado:** 🟢 Vigente — creado el 04/oct/26. Modelo: el ejemplo de la profesora ("Partes del Brief", tablero por etapas).
Fuente de las fechas: Brief v1.0, sección 5. Si cambia una fecha aquí, se cambia también en el Brief.

> Las tarjetas de **gestión** (reuniones, monitoreo, cierre) son una **propuesta** para el equipo:
> los días de reunión están por confirmar entre todos.

## Cómo montarlo rápido

1. En el tablero "Radar de Estacionamientos - Sprint 1", crear 4 listas **en este orden**:
   `ETAPA 1: INICIO` · `ETAPA 2: PLANIFICACIÓN` · `ETAPA 3: EJECUCIÓN` · `ETAPA 4: SEGUIMIENTO Y CONTROL`.
2. **Tarjetas de un golpe:** copiar el bloque "Tarjetas" de cada etapa y pegarlo en "Añade una tarjeta".
   Trello pregunta si se crea una tarjeta por línea → **Sí**.
3. **Checklists de un golpe:** dentro de la tarjeta, *Checklist* → pegar el bloque de ítems en el primer ítem;
   Trello crea un ítem por línea.
4. En cada tarjeta: fechas (*Fechas* → inicio y vencimiento), miembro y etiqueta.
   Las de etapas 1 y 2 ya terminadas se marcan con el check de la fecha (queda en verde) y la checklist completa.
5. Las 12 tarjetas de HU que ya existen en "Por hacer (Sprint 1)" se **arrastran** a `ETAPA 3: EJECUCIÓN`
   (no hace falta crearlas de nuevo). Luego se borran o archivan las listas Por hacer / En proceso / Hecho.
6. Etiquetas: una por persona para las HU (como ya están) y una **"Gestión"** para las tarjetas del equipo.
7. Para el enlace del Brief: *Compartir* → copiar el **enlace del tablero** (`trello.com/b/...`), no el de invitación.
8. Tomar la captura con las 4 etapas visibles (sin el panel "Bandeja de entrada" abierto).

---

## ETAPA 1: INICIO  (29/sep/26 → 04/oct/26 · terminada)

**Tarjetas** (pegar tal cual):
```
Definición del alcance del Radar de Estacionamientos
Identificación de stakeholders
Conformación del equipo y reparto de épicas
```

**Definición del alcance del Radar de Estacionamientos** — 29/sep → 30/sep · Equipo 3 · ✅
```
Describir el problema: encontrar puesto al llegar al campus
Delimitar el campus Montalbán como único alcance físico
Definir las restricciones del producto
Acordar qué queda fuera de la Iteración 1
```

**Identificación de stakeholders** — 29/sep → 30/sep · Equipo 3 · ✅
```
Estudiantes
Profesores
Vigilancia
Planta Física (administración)
Profesora María Pérez de Ovalles (cliente)
```

**Conformación del equipo y reparto de épicas** — 29/sep · Equipo 3 · ✅
```
Samuel: épicas 1 y 2
Aaron: épicas 3 y 4
German: épicas 5 y 6
Manuel: épicas 7 y 8
Sebastian: épicas 9 y 10
```

## ETAPA 2: PLANIFICACIÓN  (29/sep/26 → 05/oct/26)

**Tarjetas**:
```
Mapa de Impacto
Mapa de Historias de Usuario (R1 y R2)
Criterios de aceptación de la Iteración 1
Sesión de planificación de la Iteración 1
Preparación de herramientas del equipo
```

**Mapa de Impacto** — 29/sep → 04/oct · Equipo 3 · ✅
```
Metas
Personas
Impactos
Entregables
```

**Mapa de Historias de Usuario (R1 y R2)** — 29/sep → 04/oct · Equipo 3
```
10 épicas con su responsable
Historias R1 (Iteración 1)
Historias R2 (siguientes iteraciones)
Mapa publicado en Figma
Figma igual al mapa del Brief
```
*(El último ítem sigue pendiente.)*

**Criterios de aceptación de la Iteración 1** — 04/oct · Equipo 3 · ✅
```
Un criterio por cada una de las 12 historias
Redactados en lenguaje de negocio
```

**Sesión de planificación de la Iteración 1** — 04/oct · Equipo 3 · ✅
```
Elegir las 12 historias de R1
Asignar responsables
Fijar fechas: semana 1 (05–09/oct) y semana 2 (12–16/oct)
```

**Preparación de herramientas del equipo** — 04/oct → 05/oct · Sebastian
```
Repositorio en GitHub
Issues de la Iteración 1 y 2
Tablero de Trello público
Invitar a los integrantes al repositorio
```

## ETAPA 3: EJECUCIÓN  (05/oct/26 → 16/oct/26)

Aquí van las 12 HU que ya existen (se arrastran). Al moverlas, **se renombran** con el nombre del Brief
(lenguaje de negocio; el de Trello hoy es técnico y se verá en la captura). Fechas iguales a la Tabla 3 del Brief:

| Nombre actual en Trello | Renombrar a (nombre del Brief) | Miembro | Inicio | Vence |
|---|---|---|---|---|
| HU 1.1 - Login institucional | HU 1.1 Entrar con el correo de la UCAB | Samuel | 05/oct | 09/oct |
| HU 3.1 - API de avisos de entrada/salida | HU 3.1 Recibir avisos de entrada y salida | Aaron | 05/oct | 09/oct |
| HU 3.2 - Panel de simulación de sensores | HU 3.2 Simular sensores y placas | Aaron | 05/oct | 09/oct |
| HU 5.1 (actual) | HU 5.1 Ver el mapa del campus con los estacionamientos | German | 05/oct | 09/oct |
| HU 8.1 (actual) | HU 8.1 Activar las notificaciones | Manuel | 05/oct | 09/oct |
| HU 10.1 (actual) | HU 10.1 Habilitar, inhabilitar y fijar la capacidad de los estacionamientos | Sebastian | 05/oct | 09/oct |
| HU 1.2 - Detección de rol | HU 1.2 Detectar si es estudiante o profesor | Samuel | 12/oct | 16/oct |
| HU 4.1 - Cálculo de aforo | HU 4.1 Calcular los puestos libres de cada estacionamiento | Aaron | 12/oct | 16/oct |
| HU 4.2 - Semáforo de colores | HU 4.2 Mostrar el semáforo de ocupación | Aaron | 12/oct | 16/oct |
| HU 6.1 (actual) | HU 6.1 Mantener el catálogo de edificios UCAB | German | 12/oct | 16/oct |
| HU 7.2 (actual) | HU 7.2 Sugerir el estacionamiento libre más cercano | Manuel | 12/oct | 16/oct |
| HU 9.1 (actual) | HU 9.1 Reportar una incidencia | Sebastian | 12/oct | 16/oct |

**Checklist igual para cada HU** (pegar en todas):
```
Criterio de aceptación entendido (Brief 2.1)
Desarrollo terminado
Probado contra el criterio de aceptación
Revisado por otro integrante
Publicado en la versión de prueba
```

## ETAPA 4: SEGUIMIENTO Y CONTROL  (05/oct/26 → 16/oct/26)

**Tarjetas**:
```
Reuniones de seguimiento semanales del equipo
Monitoreo del cronograma y control de riesgos
Control de calidad de las historias terminadas
Cierre de la Iteración 1 y retrospectiva
```

**Reuniones de seguimiento semanales del equipo** — 05/oct → 16/oct · Equipo 3
```
Reunión de arranque (05/oct)
Seguimiento de la semana 1 (09/oct)
Seguimiento de la semana 2 (16/oct)
```
*(Días propuestos; el equipo los confirma.)*

**Monitoreo del cronograma y control de riesgos** — 05/oct → 16/oct · Equipo 3
```
Revisar cada semana qué tarjetas van atrasadas
Sensores y lector de placas simulados (la UCAB no confirma acceso)
Responder las preguntas abiertas que bloquean la Iteración 1
Todos los integrantes con acceso al repositorio
```

**Control de calidad de las historias terminadas** — 12/oct → 16/oct · Equipo 3
```
Cada HU cumple su criterio de aceptación
El mapa se ve bien en computador y en celular
Los colores del semáforo son correctos
Ningún dato de placas visible para otros usuarios
```

**Cierre de la Iteración 1 y retrospectiva** — 16/oct · Equipo 3
```
Revisar qué historias quedaron terminadas
Pasar lo pendiente a la Iteración 2
Qué salió bien y qué mejorar
```
