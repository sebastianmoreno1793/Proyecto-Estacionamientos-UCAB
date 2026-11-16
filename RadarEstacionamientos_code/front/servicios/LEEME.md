# front/servicios · hablan con el back por fetch

Heredan de `ClienteHttp` (`get()`, `post()`, `patch()`, `delete()`; nunca lanzan por un error HTTP:
devuelven `{ ok, estado, datos, error }`). Mandan y reciben DTO.

| Componente | Requisito | URL |
|---|---|---|
| `IncidenciaServicio` | HU 9.1 | `POST /api/incidencias` (y los tipos con `GET`) |
| `EstacionamientoServicio` | HU 4.2, 5.4 | `GET /api/estacionamientos`, `PATCH /api/estacionamientos/:id` |
| `CuentaServicio` | HU 1.1 | `POST /api/cuenta`, `GET·POST·DELETE /api/sesion` |
| `EdificioServicio` | HU 6.1 | `/api/edificios`, `/api/edificios/:id` |
| `VehiculoServicio` | HU 2.1 | `GET`, `POST /api/vehiculos` |
| `SugerenciaServicio` | HU 7.2 | `GET /api/sugerencia?edificio=` |
| `GaritaServicio` | HU 3.1, 3.2, 4.1 | `GET /api/avisos`, `GET /api/garita/lecturas` |
| `EventosEnVivoServicio` | HU 4.3 | Canal en vivo `GET /api/eventos` (EventSource) |
