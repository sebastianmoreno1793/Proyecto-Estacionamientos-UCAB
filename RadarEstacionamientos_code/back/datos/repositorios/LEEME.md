# back/datos/repositorios · acceso a datos

Lo único que toca los datos (`basedatos/AlmacenEnMemoria.js`). Reciben y devuelven **modelos**.
Todos heredan de `Repositorio.js`: `listar()`, `ultimos()`, `buscarPorId()`, `guardar()`, `eliminar()`.
Cuando el equipo elija la base de datos, se cambia esta carpeta y nada más.

| Componente | Requisito | Tabla |
|---|---|---|
| `EstacionamientoRepositorio` | HU 4.1, 4.2, 5.4, 9.1 | estacionamientos (`listarAbiertos()`) |
| `MovimientoRepositorio` | HU 3.1 | movimientos |
| `AvisoRechazadoRepositorio` | HU 4.1 | avisosRechazados |
| `LecturaDePlacaRepositorio` | HU 3.2 | lecturasDePlaca (`buscarPorIdLectura()`) |
| `IncidenciaRepositorio` | HU 9.1 | incidencias |
| `EdificioRepositorio` | HU 6.1 | edificios |
| `UsuarioRepositorio` | HU 1.1 | usuarios (id = correo) |
| `SesionRepositorio` | HU 1.1 | sesiones (id = código de la cookie) |
| `VehiculoRepositorio` | HU 2.1 | vehiculos (`listarDe()`, `buscarPorPlaca()`) |
