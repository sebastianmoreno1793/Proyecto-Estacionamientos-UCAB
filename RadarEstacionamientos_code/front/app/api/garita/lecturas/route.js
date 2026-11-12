// @HU-3.2 Simular sensores y placas · Aaron — Dirección web POST /api/garita/lecturas para las placas
// POST /api/garita/lecturas → back/pedidos_y_respuestas/garita.js: el lector de la garita envía una placa leída (HU 3.2).
// Aquí solo se conecta la URL. [api] [postman]
export { POST } from "@back/pedidos_y_respuestas/garita.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
