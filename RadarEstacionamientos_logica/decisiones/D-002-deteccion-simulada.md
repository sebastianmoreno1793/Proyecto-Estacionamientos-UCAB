# D-002 — Sensores y lector de placas se simulan por software

**Estado:** 🟢 Tomada
**Fecha:** 30/sep/26
**Decide:** Equipo 3

## Contexto

La UCAB no ha confirmado acceso al lector de placas de la garita ni hay sensores en los
estacionamientos.

## Decisión

Un panel de pruebas (HU 3.2) genera las entradas, salidas y lecturas de placa.

## Por qué

Permite construir y demostrar todo el sistema sin depender de hardware ni de permisos.

## Consecuencias

La demo prueba el software, no que se reduzca el tiempo de búsqueda real. Los avisos
simulados deben llegar por el mismo camino que llegarían los reales (HU 3.1).

## Cuándo revisarla

Si la UCAB da acceso al lector de placas o a datos reales de ocupación.
