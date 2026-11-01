# D-006 — Dos sistemas: la app del Radar y la maqueta 3D que le manda las señales

**Estado:** 🟢 Tomada
**Fecha:** 27/oct/26 (la separación en código es del 13/oct/26, commit `347530d`)
**Decide:** Sebastian Moreno. Pendiente de aprobación del equipo

## Contexto

D-002 dice que los sensores y el lector de placas se simulan por software. La simulación
empezó dentro de la app (`/simulacion`) y el 13/oct/26 se movió a un proyecto aparte con un
mapa 3D del campus con medidas reales.

## Decisión

El proyecto tiene dos sistemas:

1. **La app del Radar** (`RadarEstacionamientos_code/`): el producto para la persona. Debe ser
   interactiva y fácil de usar.
2. **La maqueta 3D del campus** (`RadarEstacionamientos_simulador/`): el "mundo real" simulado
   que le manda a la app los avisos de sensores, las placas de la garita, las incidencias y los
   cambios del administrador, solo por la API pública de la app.

La especificación completa está en `arquitectura_dual_app_y_maqueta.md`.

## Por qué

- La app queda lista para sensores reales: no tiene nada "para la demo".
- La demo muestra causa y efecto: el carro entra en la maqueta y la app reacciona.
- Cada lado se prueba por separado (`npm test` en cada carpeta, más Postman contra la API).

## Consecuencias

- La API pública de la app es un contrato: si cambia, hay que actualizar la maqueta y la
  colección de Postman.
- Hay que correr dos servidores en desarrollo (3000 y 3001).
- La maqueta pertenece a la HU 3.2 (y a la 3.3 en R2). No es una épica nueva ni cambia el Brief.

## Cuándo revisarla

Si la UCAB da acceso a sensores o al lector de placas reales: la maqueta pasa a ser solo una
herramienta de pruebas.
