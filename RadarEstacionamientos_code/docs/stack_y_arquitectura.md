# Stack y arquitectura

**Estado:** 🟡 Vigente con reservas — stack elegido por el equipo; base de datos, mapa e
inicio de sesión todavía sin decidir.

## Elegido

- Aplicación web en JavaScript con **Next.js**, independiente de los sistemas oficiales de la UCAB.
- Repositorio en **GitHub**, despliegue en **Vercel**.
- Herramientas: VS Code. Planificación del sprint en **Trello**.

## Dos sistemas (D-006)

- **App del Radar** (`RadarEstacionamientos_code/`, puerto 3000): el producto para la persona.
- **Maqueta 3D del campus** (`RadarEstacionamientos_simulador/`, puerto 3001, Three.js con datos
  de OpenStreetMap y SRTM): le manda a la app las señales de sensores, garita, incidencias y
  administración, solo por su API pública.
- Especificación: `arquitectura_dual_app_y_maqueta.md`.

## Por decidir (ver `../preguntas_abiertas.md`)

- Base de datos.
- ~~Librería de mapa~~ → resuelto (27/oct/26): no hay mapa de calles. La pantalla de inicio es una
  imagen de la maqueta del campus con el semáforo en SVG encima (D-007), sin librerías ni costo.
- Mecanismo de inicio de sesión con correo institucional.
- ~~Canal de actualización en vivo del mapa~~ → resuelto en código: `GET /api/eventos` (lo usan la app y la maqueta).
