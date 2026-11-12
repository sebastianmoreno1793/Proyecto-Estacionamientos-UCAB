# front/app/api · conexión de las URL con el back

Next arma las URL con estas carpetas (`avisos/route.js` → `/api/avisos`). Cada `route.js` tiene una
sola línea que pasa el pedido al archivo del back que lo contesta (`back/pedidos_y_respuestas/`). Aquí no hay lógica.
**El simulador y Postman llaman a estas URL** (busca `[simulador]` y `[postman]` en VS Code).
