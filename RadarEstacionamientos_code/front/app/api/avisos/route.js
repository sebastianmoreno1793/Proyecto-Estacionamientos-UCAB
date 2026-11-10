// @HU-3.1 Recibir avisos de entrada y salida · Aaron — URL POST /api/avisos
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
// POST /api/avisos → back/api/avisos.js: los sensores avisan entradas y salidas (HU 3.1).
// Aquí solo se conecta la URL. [api] [postman]
export { POST } from "@back/api/avisos.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
