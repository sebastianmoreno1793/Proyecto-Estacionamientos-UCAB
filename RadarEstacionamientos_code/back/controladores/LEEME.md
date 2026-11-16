# back/controladores · Control

Reciben la petición que les pasa la ruta, revisan la **precondición** con las tácticas, arman el DTO,
llaman al servicio y responden. Heredan de `Controlador.js` (`leerCuerpo()`, `responder()`, `error()`,
`atender()` convierte un `ErrorDeNegocio` en su código HTTP). **No validan datos.**

| Componente | Requisito | Responsabilidad | URL |
|---|---|---|---|
| `AvisoControlador` | HU 3.1, 4.1 | Recibir los avisos de los sensores y listar la actividad al administrador | `POST`, `GET /api/avisos` |
| `EstacionamientoControlador` | HU 4.2, 5.1, 5.4 | Entregar la ocupación y el semáforo; cambiar capacidad y estado | `GET /api/estacionamientos`, `PATCH /api/estacionamientos/:id` |
| `GaritaControlador` | HU 3.2 | Recibir las placas del lector y listarlas al administrador | `POST`, `GET /api/garita/lecturas` |
| `IncidenciaControlador` | HU 9.1 | Recibir el reporte, revisar la sesión y devolver la incidencia creada | `GET`, `POST /api/incidencias` |
| `CuentaControlador` | HU 1.1 | Crear la cuenta, entrar, salir y decir quién está conectado (cookie) | `POST /api/cuenta`, `GET·POST·DELETE /api/sesion` |
| `EdificioControlador` | HU 6.1 | Listar el catálogo y dejar al administrador cambiarlo | `/api/edificios`, `/api/edificios/:id` |
| `VehiculoControlador` | HU 2.1 | Listar y registrar los vehículos del usuario con sesión | `GET`, `POST /api/vehiculos` |
| `SugerenciaControlador` | HU 7.2 | Responder el estacionamiento libre más cercano a un edificio | `GET /api/sugerencia` |
| `EventoControlador` | HU 4.3 | Canal en vivo (Server-Sent Events) | `GET /api/eventos` |
| `PruebasControlador` | — | Volver a los datos de ejemplo (solo desarrollo) | `POST /api/pruebas/reiniciar` |
