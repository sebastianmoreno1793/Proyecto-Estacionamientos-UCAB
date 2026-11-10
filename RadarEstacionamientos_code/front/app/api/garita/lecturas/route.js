// POST /api/garita/lecturas → back/api/garita.js: el lector de la garita envía una placa leída (HU 3.2).
// Aquí solo se conecta la URL. [api] [postman]
export { POST } from "@back/api/garita.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
