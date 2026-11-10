# back/api · endpoints

Cada archivo atiende una URL de la API. El front solo conecta la URL con este código
(`front/app/api/.../route.js`). Responden JSON con el código HTTP que corresponde
(200, 201, 400, 401, 403, 404 o 409). **Postman** los llama todos; el **simulador** llama a los
que tienen ✅ a través de su puente (`RadarEstacionamientos_simulador/app/api/base/[...ruta]/route.js`).

| Archivo | URL | HU | Simulador |
|---|---|---|---|
| `estacionamientos.js` | `GET /api/estacionamientos` · `PATCH /api/estacionamientos/<id>` | 4.2, 5.1 · 5.4 | ✅ |
| `avisos.js` | `POST /api/avisos` (sensores) | 3.1, 4.1 | ✅ |
| `garita.js` | `POST /api/garita/lecturas` (lector de placas) | 3.2 | ✅ |
| `incidencias.js` | `GET` y `POST /api/incidencias` | 9.1 | ✅ |
| `eventos.js` | `GET /api/eventos` (canal en vivo) | 4.3 | ✅ |
| `reiniciar.js` | `POST /api/pruebas/reiniciar` (solo en desarrollo) | — | ✅ |
| `sugerencia.js` | `GET /api/sugerencia?edificio=<id>` | 7.2 | — |
