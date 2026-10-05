# Proyecto Estacionamientos UCAB

Radar de Estacionamientos Libres UCAB: aplicación web que muestra a estudiantes y
profesores de la UCAB Montalbán qué estacionamientos tienen puestos libres, con un
semáforo de ocupación.

Ingeniería de Software · Equipo 3 (NRC 15787) · Profesora María Pérez de Ovalles.

## Equipo

| Integrante | Épicas |
|---|---|
| Samuel Goncalves | 1 Autenticación y perfiles · 2 Vehículos, favoritos y NRC |
| Aaron Zarraga | 3 Detección de entradas y salidas · 4 Puestos libres en tiempo real |
| German Alfonzo | 5 Mapa del campus con semáforo · 6 Edificios y distancia a pie |
| Manuel Rosales | 7 Sugerencia de estacionamiento · 8 Avisos en el celular |
| Sebastian Moreno | 9 Incidencias y vigilancia · 10 Administración y reportes |

## Dónde está cada cosa

- `docs/` — decisiones, backlog, plan de la Iteración 1 y stack. **Es una copia que se
  genera desde la carpeta de lógica: no se edita aquí.** Si algo está mal, avisen a Sebastian.
- `docs/backlog_y_iteraciones.md` — qué historia le toca a cada quien y cuándo.
- `CLAUDE.md` — contexto para trabajar con Claude Code en este repo.

## Planificación

- Tablero de Trello (Sprint 1): https://trello.com/invite/b/6ac2c21ec8be5977a37282c3/ATTI7e9359d5a69b8c8922b7bdbd3ba9d5a12ED21047/radar-de-estacionamientos-sprint-1
- Mapa de historias (Figma): https://www.figma.com/board/sDRyvMoT5BDiuwwb2pPG2P/Mapa-de-historias-de-usuario---Equipo-3?node-id=0-1&p=f

## Tareas: qué le falta a cada quien

Cada historia de usuario es un **Issue**. La Iteración 1 (05/oct/26 → 16/oct/26) está en el
milestone **Iteración 1**, con su barra de progreso.

| Responsable | Issues de la Iteración 1 |
|---|---|
| Samuel Goncalves | #1 HU 1.1 · #2 HU 1.2 |
| Aaron Zarraga | #3 HU 3.1 · #4 HU 3.2 · #5 HU 4.1 · #6 HU 4.2 |
| German Alfonzo | #7 HU 5.1 · #8 HU 6.1 |
| Manuel Rosales | #9 HU 7.2 · #10 HU 8.1 |
| Sebastian Moreno | #11 HU 9.1 · #12 HU 10.1 |

Las historias de R2 son los Issues #13 a #32 (milestone **Iteración 2**).

## Cómo se sube el trabajo

Una rama por historia → Pull Request con `Closes #N` → revisión de otro integrante → merge.
Paso a paso en [`CONTRIBUTING.md`](CONTRIBUTING.md). Nunca se suben credenciales (`.env`)
ni datos personales reales.
