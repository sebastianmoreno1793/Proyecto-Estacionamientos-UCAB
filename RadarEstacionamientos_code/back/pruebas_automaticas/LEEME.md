# back/pruebas_automaticas · revisan solas que todo funcione

Se corren con `npm test` dentro de `back/` y dicen qué pasó y qué falló. `criterios_sprint1.test.js` tiene un `describe` por HU
y un `test` por criterio de aceptación; los demás prueban cada tema en detalle.

`api.test.js` hace los mismos pedidos que haría Postman a `back/pedidos_y_respuestas` y revisa
que la respuesta sea la correcta (200, 201, 400, 401, 403, 404), sin tener que prender el servidor.
