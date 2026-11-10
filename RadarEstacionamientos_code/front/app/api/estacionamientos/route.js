// GET /api/estacionamientos → back/api/estacionamientos.js: estado para el mapa y el semáforo (HU 4.2).
// Aquí solo se conecta la URL. [api] [postman]
export { GET } from "@back/api/estacionamientos.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
