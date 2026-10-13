# Radar de Estacionamientos UCAB — código

Aplicación web en Next.js (ver `docs/stack_y_arquitectura.md`).

## Cómo correrla

```bash
cd RadarEstacionamientos_code
npm install
npm run dev      # abre http://localhost:3000
npm test         # pruebas de los datos
```

## Dónde está cada cosa

| Carpeta | Qué hay |
|---|---|
| `app/` | Páginas (Next.js App Router) |
| `components/` | Piezas de la interfaz, por ejemplo `MapaCampus.js` (HU 5.1) y el menú (`MenuPrincipal.js`) |
| `data/` | Datos fijos, por ejemplo la lista de estacionamientos (provisional) |
| `app/api/` | API pública: sensores, lector de placas, incidencias, administración y canal en vivo |
| `tests/` | Pruebas que se corren con `npm test` |
| `docs/` | Copia de la carpeta de lógica. **No se edita aquí.** |

## API (la usan los sensores, Postman y el simulador)

Lo simulado entra por el mismo camino que lo real (D-002). Copia `.env.example` como
`.env.local` si quieres otra clave de sensores (en desarrollo vale `clave-de-desarrollo`).

| Quién lo usa en la vida real | Llamada | HU |
|---|---|---|
| El sensor de un estacionamiento | `POST /api/avisos` con `x-clave-sensor` · `{ estacionamientoId, tipo: "ENTRADA" \| "SALIDA", idAviso? }` | 3.1, 4.1 |
| El lector de placas de la garita | `POST /api/garita/lecturas` con `x-clave-sensor` · `{ placa, sentido }` | 3.2 |
| Un conductor | `POST /api/incidencias` · `{ estacionamientoId, tipo }` | 9.1 |
| El administrador | `PATCH /api/estacionamientos/:id` · `{ capacidad?, activo? }` | 5.4 |
| Quien mira el mapa | `GET /api/estacionamientos` y el canal en vivo `GET /api/eventos` | 4.2, 4.3 |
| Solo en desarrollo | `POST /api/pruebas/reiniciar` (vuelve a los datos de ejemplo) | — |

El **simulador 3D** (con su menú de pruebas y una colección de Postman lista para importar)
es un proyecto aparte: `../RadarEstacionamientos_simulador/`. Esta app no sabe que existe.
