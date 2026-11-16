# back/modelos · Modelo

Entidades con su estado **privado** (`#capacidad`, `#ocupados`…) que solo cambia con sus métodos, y
las **reglas de negocio** como métodos. `desde(registro)` y `aRegistro()` los usan los repositorios.

| Componente | Requisito | Responsabilidad (métodos) |
|---|---|---|
| `Estacionamiento` | HU 4.1, 4.2, 5.1, 5.4 | `registrarEntrada()` `registrarSalida()` (lleno/vacío) · `libres()` `porcentaje()` `semaforo()` · `cambiarCapacidad()` `abrir()` `cerrar()` · `motivoDeRechazo()` |
| `Semaforo` | HU 4.2 (D-009) | `HAY_PUESTO`, `NO_HAY_PUESTO`, `CERRADO` · `segun({ libres, activo })` |
| `Movimiento` | HU 3.1 | Una entrada o salida con su hora · `TIPOS` |
| `AvisoRechazado` | HU 4.1 | Un aviso que no cambió el aforo, con su motivo · `esAnomalia()` |
| `LecturaDePlaca` | HU 3.2 | Placa leída: solo ENTRADA o SALIDA, nunca sin placa |
| `Placa` | HU 2.1, 3.2 | Mayúsculas y sin espacios ni guiones (la misma para la garita y Mis vehículos) |
| `Incidencia` | HU 9.1 | `crear()`: solo en abiertos, tres tipos, nace «pendiente» con fecha y hora |
| `Edificio` | HU 6.1 | `crearId()`, `cambiar()`, `tieneElMismoNombreQue()` |
| `Usuario` | HU 1.1 | `rolSegunCorreo()` (D-003), contraseña cifrada, `esAdministrador()` |
| `Sesion` | HU 1.1 | Código de la cookie `radar_sesion` |
| `Vehiculo` | HU 2.1 | Vehículo a nombre de su dueño · `esDe()` |
| `ErrorDeNegocio` | — | Lo lanza una regla de negocio; lleva el `motivo` para el código HTTP |
