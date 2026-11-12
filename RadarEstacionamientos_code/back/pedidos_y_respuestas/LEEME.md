# back/pedidos_y_respuestas · recibe lo que le piden y contesta

Cada archivo atiende una dirección `/api/...`: recibe el pedido (de una pantalla, del simulador o
de Postman), revisa que esté bien, llama a `reglas_y_datos/` y contesta con los datos y un número
que dice cómo salió (200 = bien, 201 = creado, 400 = falta o está mal un dato, 401 = sin sesión o
sin clave, 403 = no tiene permiso, 404 = no existe, 409 = no se puede hacer ahora).
El front solo conecta la dirección con este código (`front/app/api/.../route.js`). **Postman** los llama todos; el **simulador** llama a los
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
