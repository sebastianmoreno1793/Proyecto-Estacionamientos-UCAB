# conexion_app · lo que habla con la app

`cliente_api.js` tiene una función por cada cosa que el simulador le hace a la app: mandar un
aviso de sensor, una lectura de placa, reportar una incidencia, cambiar un estacionamiento o
reiniciar. Todas pasan por el puente `app/api/base/` y llegan a la **misma API pública** que usan
los sensores reales y Postman (D-002). Cada llamada devuelve método, ruta, estado HTTP y tiempo,
para mostrarlas en el Registro como en Postman.
