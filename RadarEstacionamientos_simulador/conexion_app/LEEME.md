# conexion_app · lo que habla con la app

- `ClienteAppBase` (navegador): un método por cada cosa que el simulador le hace a la app: mandar un
  aviso de sensor, una lectura de placa, reportar una incidencia, cambiar un estacionamiento o
  reiniciar. Todas pasan por el puente `/api/base/` y llegan a la **misma API pública** que usan los
  sensores reales y Postman (D-002). Cada llamada devuelve método, ruta, estado HTTP y tiempo, para
  mostrarlas en el Registro como en Postman.
- `PuenteAppBase` (servidor): reenvía a la app solo las rutas permitidas; a los sensores les agrega
  su clave y a lo demás, la sesión de quien entró a la app.
- `ExportadorDeMaqueta` (servidor, solo en desarrollo): guarda el render de `/maqueta` en `exportes/`.
