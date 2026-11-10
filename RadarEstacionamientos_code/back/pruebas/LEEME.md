# back/pruebas · pruebas automáticas

Se corren con `npm test` dentro de `back/`. `criterios_sprint1.test.js` tiene un `describe` por HU
y un `test` por criterio de aceptación; los demás prueban cada tema en detalle.

`api.test.js` prueba los endpoints de `back/api` con sus códigos HTTP (200, 201, 400, 401, 403, 404),
igual que los vería Postman, sin levantar el servidor.
