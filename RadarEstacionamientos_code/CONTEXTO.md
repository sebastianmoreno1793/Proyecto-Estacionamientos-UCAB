# Radar de Estacionamientos Libres UCAB — contexto raíz

Aplicación web que muestra a estudiantes y profesores de la UCAB Montalbán qué
estacionamientos tienen puestos libres, con un semáforo de ocupación. Proyecto de
Ingeniería de Software, Equipo 3.

> **Este archivo se relee en cada turno de cada sesión.** Manténlo corto y apunta a
> los documentos en vez de copiarlos.

## Lo que no se puede romper

- Sensores y lector de placas son **simulados**; los avisos simulados entran por el mismo
  camino que entrarían los reales (`docs/decisiones/D-002-deteccion-simulada.md`).
- Solo entran correos @est.ucab.edu.ve y @ucab.edu.ve (`docs/decisiones/D-003-solo-web-con-correo-ucab.md`).
- Semáforo: verde < 50%, amarillo 50% a < 80%, naranja 80% a < 95%, rojo ≥ 95%.
- Puestos libres: nunca menos de 0 ni más que la capacidad.

## Qué construir ahora

Iteración 1 (05/oct/26 → 16/oct/26): `docs/backlog_y_iteraciones.md`.
Stack: `docs/stack_y_arquitectura.md`.

## Cómo se trabaja aquí

- Las decisiones se escriben en la carpeta de lógica y llegan aquí por `sincronizar.sh`.
  **`docs/` es una copia: no se edita.**
- Si encuentras un documento equivocado, **dilo en vez de arreglarlo**: qué archivo, qué
  línea, qué debería decir y de dónde sale.
- Los commits los hace la persona, no tú.
- Antes de empezar, revisa `docs/ULTIMA_SINCRONIZACION.md`.

## Qué NO entra al repositorio

Datos personales reales (placas, correos, cédulas) y credenciales (`.env`).

## API para sensores, Postman y el simulador

- La app expone los caminos reales (D-002: lo simulado entra por el mismo camino que lo real):
  `POST /api/avisos` (sensores, HU 3.1/4.1), `POST /api/garita/lecturas` (lector de placas,
  HU 3.2), `POST /api/incidencias` (HU 9.1), `PATCH /api/estacionamientos/:id` (HU 5.4),
  `GET /api/estacionamientos` y el canal en vivo `GET /api/eventos` (HU 4.3).
- Avisos y lecturas piden el encabezado `x-clave-sensor` (`CLAVE_SENSORES`, ver `.env.example`).
- Al canal en vivo y a la API pública **nunca** van placas ni correos (`vistaPublica`).
- `POST /api/pruebas/reiniciar` existe solo en desarrollo.
- **La simulación NO vive aquí**: está en `../RadarEstacionamientos_simulador/` (maqueta 3D,
  menú de pruebas, colección de Postman) y solo usa esta API. No agregues código "para el
  simulador" en esta app.
