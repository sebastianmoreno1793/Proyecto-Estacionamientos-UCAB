# D-009 — ⭐ El semáforo tiene dos estados: hay puesto (verde) o no hay puesto (rojo)

**Estado:** 🟢 Tomada
**Fecha:** 27/oct/26
**Decide:** Sebastian Moreno
**Reemplaza:** el criterio de cuatro colores de la HU 4.2 (verde < 50 %, amarillo 50 % a < 80 %,
naranja 80 % a < 95 %, rojo ≥ 95 %), que venía del Brief del 04/oct y del Issue #6.

> **Para el equipo:** en todo el Radar (app, maqueta 3D, documentos, Trello y GitHub) el
> semáforo dice solo **si hay o no hay puesto**. No se usan amarillo ni naranja, ni textos como
> «Se está llenando», «Casi lleno» o «Lleno».

## Contexto

El semáforo de cuatro niveles medía el **porcentaje de ocupación**. En la práctica confundía:
- **El nivel y la cifra decían cosas contrarias.** Sambilito con 90 libres salía en amarillo («se
  está llenando»), y un estacionamiento pequeño con 2 libres salía en rojo («lleno»), aunque
  todavía cabía un carro.
- **Al conductor no le sirve el porcentaje:** quiere saber si hay o no un puesto para él.
- **Amarillo y naranja se confunden** con daltonismo y bajo el sol (crítica de diseño
  `impeccable` del 27/oct/26: contraste de 2,1:1 y 3,0:1).

## Decisión

| Estado | Cuándo | Color | Texto |
|---|---|---|---|
| **Hay puesto** | El estacionamiento está activo y tiene **al menos 1 puesto libre** | Verde `#1e7b4f` (relleno `#2f9e57`) | «Hay puesto» y «**N** libres» |
| **No hay puesto** | El estacionamiento está activo y tiene **0 puestos libres** | Rojo `#b42318` (relleno `#d93a2e`) | «No hay puesto» |
| Cerrado | El administrador lo desactivó | Gris `#6c6c70` (relleno `#8e8e93`) | «Cerrado» |

- La **cantidad** sigue visible («12 libres»): el color dice si hay, y la cifra dice cuántos.
- El **porcentaje de ocupación** sigue en la API y en la tarjeta del estacionamiento como dato,
  pero ya **no decide el color**.
- El color siempre va acompañado de texto (accesibilidad, D-007).
- Los tonos oscuros (`#1e7b4f`, `#b42318`) son los que llevan texto blanco encima: ambos pasan
  4,5:1. Los rellenos más vivos son solo para las áreas del mapa o de la maqueta.

**Nuevo criterio de aceptación de la HU 4.2 «Consultar el semáforo de ocupación»:** cada
estacionamiento se muestra en verde si tiene al menos un puesto libre, en rojo si no tiene
ninguno y en gris si está cerrado, siempre con el texto de su estado y la cantidad de libres.

## Por qué

- Responde la única pregunta del conductor («¿hay puesto?») en un vistazo.
- Desaparece la contradicción entre el color y la cifra.
- Dos colores bien distintos se leen mejor al sol y con daltonismo, y el texto lo confirma.

## Consecuencias

- Código: `nivelDelSemaforo` usa los **libres**, no el porcentaje (`lib/estacionamientos/reglas.js`
  y `tests/semaforo.test.js`). La maqueta 3D del simulador usa los mismos dos colores.
- Documentos actualizados: `negocio/problema_y_usuarios.md`, `para_el_codigo/CONTEXTO.md`,
  `producto/DESIGN.md`, D-007, el Issue #6 y la tarjeta HU 4.2 de Trello.
- **El Brief no cambia:** solo habla del «semáforo de ocupación», sin fijar colores.
- **Hay que avisarle a la profesora** en la defensa del Sprint 1: el criterio de la HU 4.2 cambió
  después del Brief, con su motivo.

## Cuándo revisarla

Si las pruebas con usuarios muestran que hace falta avisar antes de que se llene (por ejemplo,
«quedan pocos»). Se haría con una decisión nueva, no volviendo a los cuatro colores.
