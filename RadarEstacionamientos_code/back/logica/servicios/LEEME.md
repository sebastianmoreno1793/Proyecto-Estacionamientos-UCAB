# back/logica/servicios · reglas de negocio de cada HU

Coordinan modelos y repositorios. Devuelven DTO y lanzan `ErrorDeNegocio` cuando una regla no deja seguir.

| Componente | Requisito | Responsabilidad |
|---|---|---|
| `AforoServicio` | HU 3.1, 4.1 | Registrar cada entrada o salida y mantener los ocupados entre 0 y la capacidad, pasando por `FiltroDeAvisos` y `MonitorDeSensores` |
| `EstacionamientoServicio` | HU 4.2, 5.1, 5.4 | Consultar con libres y semáforo; cambiar capacidad y abrir/cerrar |
| `GaritaServicio` | HU 3.2 | Guardar cada placa leída sin duplicar reintentos; al canal en vivo nunca va la placa |
| `IncidenciaServicio` | HU 9.1 | Registrar la incidencia «pendiente», solo en estacionamientos que existen y están abiertos |
| `CuentaServicio` | HU 1.1 | Crear la cuenta sin repetir correo, comprobar la contraseña y manejar las sesiones |
| `EdificioServicio` | HU 6.1 | Agregar, modificar y quitar edificios; el nombre no se repite |
| `VehiculoServicio` | HU 2.1 | Registrar vehículos; la placa no se repite en el Radar |
| `SugerenciaServicio` | HU 7.2 | Elegir el abierto con libres más cercano (distancia de Haversine) |
| `EventosEnVivoServicio` | HU 4.3 | Avisar al mapa y al simulador cuando algo cambia |
| `PruebasServicio` | — | Reiniciar los datos de ejemplo (solo desarrollo) |
