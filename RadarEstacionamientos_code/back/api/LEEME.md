# back/api · endpoints

Cada archivo atiende una URL de la API. El front solo conecta la URL con este código
(`front/app/api/.../route.js`). Responden JSON con `Response.json` y el código HTTP que corresponde
(200, 201, 400, 401, 403, 404 o 409).

| Archivo | URL | HU |
|---|---|---|
| `estacionamientos.js` | `GET /api/estacionamientos` · `PATCH /api/estacionamientos/<id>` | 4.2, 5.1 · 5.4 |
| `avisos.js` | `POST /api/avisos` (sensores) | 3.1, 4.1 |
| `garita.js` | `POST /api/garita/lecturas` (lector de placas) | 3.2 |
| `incidencias.js` | `GET` y `POST /api/incidencias` | 9.1 |
| `sugerencia.js` | `GET /api/sugerencia?edificio=<id>` | 7.2 |
| `eventos.js` | `GET /api/eventos` (canal en vivo) | 4.3 |
| `reiniciar.js` | `POST /api/pruebas/reiniciar` (solo en desarrollo) | — |
