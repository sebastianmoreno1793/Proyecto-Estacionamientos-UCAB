# Simulador del Radar de Estacionamientos UCAB — contexto

Mundo virtual en 3D del Campus Montalbán (dimensiones reales) que le hace a la app base lo
mismo que le pasaría en la realidad: carros que entran y salen, placas en la garita,
incidencias y cambios del administrador. Es una **extensión aparte**: no es parte de la app.

> Resumen de una página del simulador. Se mantiene corto.

## Regla de oro

- El simulador **NUNCA toca la app base por dentro** (ni importa su código ni su almacén).
  Todo pasa por su API pública, igual que Postman, un sensor o una persona:
  `app/api/base/[...ruta]/route.js` reenvía a la app y le agrega la clave de sensores.
- Lo que pasa en la app vuelve por su canal en vivo (`GET /api/eventos`).
- Nada se fija "a mano": un escenario manda avisos uno por uno y la app aplica sus reglas.
- La app base no sabe que existe el simulador: no le agregues rutas ni código "para el simulador".
  Si hace falta algo, es una API real que también serviría a sensores o usuarios.

## Cómo correrlo

App base en `http://localhost:3000` (`RadarEstacionamientos_code`, `npm run dev`) y luego,
aquí, `npm install` y `npm run dev` → `http://localhost:3001`. Configuración en `.env.example`.

## Mapa 3D

- `components/Mapa3D.js`: la escena (Three.js). 1 unidad = 1 metro; origen en `CENTRO_CAMPUS`
  (`data/campus.js`, el mismo de la app base). NUNCA inventes posiciones: GPS → metros con
  `gpsAMetros` (`lib/mapa3d/geo.js`).
- Los estacionamientos llegan de la app base (`GET /api/estacionamientos`). Contorno, edificios,
  vías, garita y relieve: `data/campus.js` (OpenStreetMap + SRTM).
- El campus mide ~930 m (E-O) × 610 m (N-S). La garita está en la esquina **noreste**
  (Av. Teherán) y el terreno **sube de norte a sur** (~920 m → ~975 m).
- **Antes de modificar el mapa 3D**, revisa `lib/mapa3d/geo.js` (conversión GPS → metros) y
  `data/campus.js` (de dónde sale cada forma del campus).
- Valida con `npm test`.

## Qué NO entra al repositorio

Placas o correos reales y credenciales (`.env.local`). Las placas del simulador son al azar.
