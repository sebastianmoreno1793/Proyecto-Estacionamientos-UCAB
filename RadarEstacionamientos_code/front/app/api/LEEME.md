# front/app/api · la RUTA del back

Next arma las URL con estas carpetas (`avisos/route.js` → `/api/avisos`). Cada `route.js` tiene una
línea por método, que pasa la petición a su controlador:
`export const POST = (peticion) => Fabrica.obtener().avisoControlador.recibir(peticion);`
La ruta no sabe qué le llega. **El simulador y Postman llaman a estas URL**.

| URL | Controlador |
|---|---|
| `POST`, `GET /api/avisos` | `AvisoControlador` (con `x-clave-sensor` para POST) |
| `GET /api/estacionamientos`, `PATCH /api/estacionamientos/:id` | `EstacionamientoControlador` |
| `POST`, `GET /api/garita/lecturas` | `GaritaControlador` |
| `GET`, `POST /api/incidencias` | `IncidenciaControlador` |
| `POST /api/cuenta`, `GET·POST·DELETE /api/sesion` | `CuentaControlador` |
| `GET`, `POST /api/edificios`, `PATCH`, `DELETE /api/edificios/:id` | `EdificioControlador` |
| `GET`, `POST /api/vehiculos` | `VehiculoControlador` |
| `GET /api/sugerencia` | `SugerenciaControlador` |
| `GET /api/eventos` | `EventoControlador` |
| `POST /api/pruebas/reiniciar` | `PruebasControlador` (solo desarrollo) |
