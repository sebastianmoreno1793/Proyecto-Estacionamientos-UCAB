// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Dirección web GET /api/sugerencia
// GET /api/sugerencia → back/pedidos_y_respuestas/sugerencia.js: estacionamiento libre más cercano a un edificio (HU 7.2).
// Aquí solo se conecta la URL. [api] [postman]
export { GET } from "@back/pedidos_y_respuestas/sugerencia.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
