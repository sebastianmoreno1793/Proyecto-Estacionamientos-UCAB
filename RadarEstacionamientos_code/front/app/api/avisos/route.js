// POST /api/avisos → back/api/avisos.js: los sensores avisan entradas y salidas (HU 3.1).
// Aquí solo se conecta la URL. [api] [postman]
export { POST } from "@back/api/avisos.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
