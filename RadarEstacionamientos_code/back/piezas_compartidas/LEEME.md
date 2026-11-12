# back/piezas_compartidas · lo que usan todos los temas

| Archivo | Qué hace, dicho fácil | Simulador |
|---|---|---|
| `almacen.js` | Es donde se guardan los datos (estacionamientos, movimientos, incidencias…) mientras la app está prendida. Todavía no hay base de datos: al apagar el servidor se borra todo | — |
| `eventos_en_vivo.js` | Avisa a las pantallas abiertas cada vez que algo cambia (entra un carro, se cierra un estacionamiento), por la dirección `/api/eventos` | ✅ lo escucha |
| `fechas.js` | Escribe la fecha y la hora de la misma forma en toda la app | — |
