# front/acciones · lo que los formularios le piden al back

Acciones del servidor (`"use server"`). Un formulario las llama al enviarse; cada una revisa la
sesión, llama a `back/logica` y devuelve un resultado o un error para mostrar.

| Archivo | Qué hace | HU |
|---|---|---|
| `cuenta.js` | Crear cuenta, entrar y salir | 1.1 |
| `incidencias.js` | Reportar una incidencia | 9.1 |
| `vehiculos.js` | Registrar un vehículo | 2.1 |
| `puestos.js` | Cambiar capacidad y estado de un estacionamiento | 5.4 |
| `edificios.js` | Agregar, modificar y quitar edificios | 6.1 |
