# Tablero de decisiones

**Estado:** 🟢 Vigente — índice único de decisiones.

> ## ⭐ Obligatorias para todo el equipo (27/oct/26, Sebastian)
>
> Toda pantalla, estilo o funcionalidad que se agregue al Radar sigue estas decisiones.
> Un PR que no las cumpla no se fusiona. Para cambiarlas se propone una decisión nueva; no se
> cambian en el código.
>
> - **[D-007](D-007-diseno-ios-institucional-ucab.md) · Diseño iOS institucional UCAB.** Reglas en
>   `../producto/DESIGN.md`. Se revisa con la skill `impeccable` (`/impeccable critique`).
> - **[D-008](D-008-la-app-es-una-pwa.md) · El Radar es una PWA instalable.** Un solo service
>   worker (`public/sw.js`); los datos en vivo nunca salen de la caché.
> - **[D-009](D-009-semaforo-hay-o-no-hay-puesto.md) · Semáforo de dos estados:** verde = hay puesto,
>   rojo = no hay puesto, gris = cerrado. Nada de amarillo ni naranja.

| Ficha | Decisión | Estado |
|---|---|---|
| [D-001](D-001-brief-en-lenguaje-de-negocio.md) | El Brief se escribe en lenguaje de negocio, según la guía de la profesora | 🟢 Tomada |
| [D-002](D-002-deteccion-simulada.md) | Sensores y lector de placas se simulan por software | 🟢 Tomada |
| [D-003](D-003-solo-web-con-correo-ucab.md) | Solo web, solo comunidad UCAB con correo institucional | 🟡 Tomada con partes abiertas |
| [D-004](D-004-alcance-iteracion-1.md) | La Iteración 1 tiene 12 historias (05/oct/26 → 16/oct/26); la 1.2 cambió por la 2.1 el 16/oct | 🟢 Tomada |
| [D-005](D-005-sin-costos-adicionales.md) | Solo herramientas sin costo adicional | 🟡 Propuesta en revisión |
| [D-006](D-006-arquitectura-dual-app-y-maqueta-3d.md) | Dos sistemas: la app del Radar y la maqueta 3D del campus que le manda las señales | 🟢 Tomada (falta aprobación del equipo) |
| ⭐ [D-007](D-007-diseno-ios-institucional-ucab.md) | La app se ve como una app de iOS institucional de la UCAB (`producto/DESIGN.md`) | 🟢 Tomada · obligatoria |
| ⭐ [D-008](D-008-la-app-es-una-pwa.md) | El Radar es una PWA instalable, con un solo service worker | 🟢 Tomada · obligatoria |
| ⭐ [D-009](D-009-semaforo-hay-o-no-hay-puesto.md) | Semáforo de dos estados: hay puesto (verde) o no hay puesto (rojo); reemplaza al de cuatro colores | 🟢 Tomada · obligatoria |
