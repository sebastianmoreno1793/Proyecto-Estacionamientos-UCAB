# Radar de Estacionamientos UCAB — código

Aplicación web en Next.js (ver `docs/stack_y_arquitectura.md`), separada en **front** y **back**.

## Cómo correrla

```bash
cd RadarEstacionamientos_code
npm run instalar   # instala las dependencias del front (el back no tiene)
npm run dev        # abre http://localhost:3000
npm test           # pruebas del back (119) y del front (12)
```

## Dónde está cada cosa

| Carpeta | Qué hay |
|---|---|
| `back/` | Lógica y API: `api/` (un archivo por endpoint), `logica/` (reglas y datos por tema), `campus/` (datos fijos del campus) y `pruebas/` |
| `front/` | Pantallas: `app/` (una carpeta por URL), `componentes/`, `notificaciones/` (HU 8.1), `servidor/` (cookie de sesión) y `public/` |
| `docs/` | Copia de la carpeta de lógica. **No se edita aquí.** |

Cada carpeta tiene un `LEEME.md` corto, y cada archivo empieza con un comentario que dice qué hace.

### Cómo se conectan

```
navegador (front) ──fetch /api/...──▶ front/app/api/.../route.js ──▶ back/api/<tema>.js ──▶ back/logica/<tema>/
Postman, simulador y sensores ──────▶ las mismas URL /api/...
acciones del front (formularios) ────────────────────────────────▶ back/logica/<tema>/ (directo, en el servidor)
```

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
