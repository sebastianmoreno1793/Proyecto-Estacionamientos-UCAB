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

## Mapa 3D del Campus

- El componente `components/Mapa3D.js` usa Three.js para renderizar una maqueta 3D
  del campus UCAB Montalbán con dimensiones y posiciones reales (`/simulacion`).
- Fuentes: estacionamientos en `data/estacionamientos.js`; contorno, edificios, vías,
  garita y relieve en `data/campus.js` (OpenStreetMap + SRTM). NUNCA inventes posiciones:
  siempre convierte GPS → metros con `gpsAMetros` (`lib/mapa3d/geo.js`).
- 1 unidad Three.js = 1 metro real. El campus mide ~930 m (E-O) × 610 m (N-S), ~20 ha.
  La garita está en la esquina **noreste** (Av. Teherán) y el terreno **sube de norte a
  sur** (~920 m en la Playa → ~975 m en las canchas).
- **Antes de modificar el mapa 3D**, lee los skills:
  - `.agents/skills/threejs-campus-3d/SKILL.md` — reglas de Three.js, conversión GPS,
    patrones de código, performance.
  - `.agents/skills/campus-ucab-datos/SKILL.md` — datos reales del campus: edificios,
    topografía, vías y de dónde sacar lo que falte.
- Para datos nuevos del campus, consulta **OpenStreetMap** antes que la web (la web casi no
  tiene información de los edificios). Valida con `npm test` (`tests/mapa3d.test.js`).
- Vista para el equipo, con capturas: `maqueta_3d/README.md`.
