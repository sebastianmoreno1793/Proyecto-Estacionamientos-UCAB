# front/controladores · Control

Como el «ManejoProducto» del ejemplo de la profesora: `+valida(datos)` `+muestra()` `+redirige()`
(clase base `Controlador.js`). La vista les pasa el formulario; ellos validan con su validador, llaman
al servicio y devuelven qué interfaz mostrar (`{ interfaz: "MensajeIncidenciaCreada", … }`).

| Componente | Requisito | Responsabilidad |
|---|---|---|
| `IncidenciaControlador` | HU 9.1 | Reportar: valida (`IncidenciaValidador`), manda (`IncidenciaServicio`) y elige `MensajeIncidenciaCreada`, `MensajeDatosNoValidos` o `MensajeEstacionamientoCerrado` |
| `CuentaControlador` | HU 1.1 | Crear cuenta, entrar y salir; redirige a `/mapa` o `/entrar` |
| `EstacionamientoControlador` | HU 4.2, 5.4 | Mapa e Inicio en vivo; capacidad y estado (`CapacidadValidador`) |
| `EdificioControlador` | HU 6.1 | Agregar, modificar y quitar edificios (`EdificioValidador`) |
| `VehiculoControlador` | HU 2.1 | Mis vehículos (`VehiculoValidador`) |
| `SugerenciaControlador` | HU 7.2 | Pide la sugerencia y recuerda el último edificio |
| `GaritaControlador` | HU 3.1, 3.2, 4.1 | Actividad de la garita y estado de los sensores |
| `NotificacionControlador` | HU 8.1 | Permiso del navegador, preferencia y notificación de prueba (antes `GestorNotificaciones`) |
| `NavegacionControlador` | HU 1.1 | Precondición de las pantallas: sin sesión → `/entrar`; `/admin` solo administrador |
