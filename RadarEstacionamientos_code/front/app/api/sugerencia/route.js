// GET /api/sugerencia → back/api/sugerencia.js: estacionamiento libre más cercano a un edificio (HU 7.2).
// Aquí solo se conecta la URL. [api] [postman]
export { GET } from "@back/api/sugerencia.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
