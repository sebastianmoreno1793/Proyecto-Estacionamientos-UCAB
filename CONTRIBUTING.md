# Cómo trabajamos en este repo

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

## Lo que no se sube nunca

`.env`, contraseñas, tokens ni datos reales de personas (placas, correos, cédulas).

## `docs/` no se edita aquí

Es una copia que se genera desde la carpeta de lógica del proyecto. Si algo está mal,
abre un Issue con la etiqueta `documentación`.
