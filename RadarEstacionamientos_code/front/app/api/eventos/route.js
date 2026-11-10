// GET /api/eventos → back/api/eventos.js: canal en vivo con Server-Sent Events (HU 4.3).
// Aquí solo se conecta la URL. [api] [postman] [en-vivo]
export { GET } from "@back/api/eventos.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
