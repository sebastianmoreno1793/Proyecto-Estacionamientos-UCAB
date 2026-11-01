# Cómo trabajamos en este repo

## 0. Dónde se trabaja

El código de la aplicación va **siempre dentro de `RadarEstacionamientos_code/`**. La carpeta
`RadarEstacionamientos_logica/` (Brief, decisiones) no se toca en las ramas de historias.

El simulador 3D va en `RadarEstacionamientos_simulador/`. Es una extensión aparte: **solo usa
la API pública de la app** (como Postman) y la app nunca importa nada de él.

## 0.1 ⭐ Diseño y PWA (obligatorio)

Toda pantalla sigue **D-007** y **D-008** (`RadarEstacionamientos_logica/decisiones/`):

- Lee `RadarEstacionamientos_code/DESIGN.md` antes de hacer una pantalla (es una página).
- Revisa tu pantalla con la skill **impeccable** antes de abrir el PR: desde
  la raíz del repo, `/impeccable critique <ruta de la página>`. Arregla los P1.
- No agregues librerías de componentes (Material, Bootstrap) ni fuentes descargadas.
- Hay **un solo service worker** (`public/sw.js`). Si tu HU necesita algo de él, agrégalo ahí.

## 1. Tomar una tarea

- Las tareas son los **Issues**. Cada historia de usuario es un Issue (`HU 4.1 · …`).
- Filtra por tu etiqueta (`👤 Samuel`, `👤 Aaron`, `👤 German`, `👤 Manuel`, `👤 Sebastian`)
  o por el milestone **Iteración 1** para ver qué te toca y para cuándo.
- Asígnate el Issue (botón *Assignees* → tú) cuando empieces.
- Si algo te impide avanzar, ponle la etiqueta `bloqueado` y explica qué falta en un comentario.

## 2. Crear tu rama

Nunca se trabaja directo en `main`.

```bash
git checkout main
git pull
git checkout -b hu-4.1-puestos-libres     # hu-<número>-<descripción-corta>
```

## 3. Hacer commits

Mensajes cortos que digan qué cambió, con el número de la historia:

```
HU 4.1: calcula puestos libres al entrar y salir un carro
```

## 4. Subir y abrir el Pull Request

```bash
git push -u origin hu-4.1-puestos-libres
```

En GitHub, abre el **Pull Request** hacia `main`:

- Llena la plantilla y escribe `Closes #5` (el número de tu Issue): al aceptar el PR, el Issue se cierra solo.
- Pide revisión a **otro integrante** (*Reviewers*).

## 5. Revisar y unir

- Quien revisa comprueba el criterio de aceptación del Issue y aprueba o pide cambios.
- Con la aprobación, se hace **Squash and merge** y se borra la rama.

## Dónde se ve el avance

- **Milestones → Iteración 1:** barra de progreso de la iteración (abiertos vs. cerrados).
- **Issues:** qué falta (abiertos) y qué está hecho (cerrados), con fecha.
- **Pull requests:** qué se subió, quién lo subió, cuándo y quién lo aprobó.
- **Project (tablero):** Por hacer → En progreso → En revisión → Hecho.

## Trello se actualiza solo

No muevan las tarjetas de Trello a mano: GitHub las mueve.

| En GitHub | Tarjeta en Trello |
|---|---|
| Te asignas el Issue | En proceso |
| Abres el PR con `Closes #N` | En revisión |
| Se cierra el Issue (PR unido) | Hecho |
| Se reabre el Issue | Por hacer (Sprint 1) |

## Lo que no se sube nunca

`.env`, contraseñas, tokens ni datos reales de personas (placas, correos, cédulas).

## `RadarEstacionamientos_code/docs/` no se edita aquí

Es una copia que se genera desde la carpeta de lógica del proyecto. Si algo está mal,
abre un Issue con la etiqueta `documentación`.
