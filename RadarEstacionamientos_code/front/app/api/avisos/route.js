// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Dirección web POST /api/avisos donde llegan los avisos
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Dirección web POST /api/avisos que actualiza el aforo
// POST /api/avisos → back/pedidos_y_respuestas/avisos.js: los sensores avisan entradas y salidas (HU 3.1).
// Aquí solo se conecta la URL. [api] [postman]
export { POST } from "@back/pedidos_y_respuestas/avisos.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
