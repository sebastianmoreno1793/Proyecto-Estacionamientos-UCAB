# front/envio_de_formularios · lo que pasa al tocar «Enviar», «Guardar» o «Entrar»

Cada archivo empieza con `"use server"`: corre en el servidor, no en el navegador. Cuando el
usuario envía un formulario, revisa quién está conectado, llama a `back/reglas_y_datos` y devuelve
el mensaje que se muestra (lo que salió bien o qué hay que corregir).

| Archivo | Qué hace | HU |
|---|---|---|
| `cuenta.js` | Crear cuenta, entrar y salir | 1.1 |
| `incidencias.js` | Reportar una incidencia | 9.1 |
| `vehiculos.js` | Registrar un vehículo | 2.1 |
| `puestos.js` | Cambiar capacidad y estado de un estacionamiento | 5.4 |
| `edificios.js` | Agregar, modificar y quitar edificios | 6.1 |
