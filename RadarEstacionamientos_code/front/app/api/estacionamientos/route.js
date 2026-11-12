// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Dirección web GET /api/estacionamientos con la ocupación
// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Dirección web GET /api/estacionamientos para dibujar el mapa
// GET /api/estacionamientos → back/pedidos_y_respuestas/estacionamientos.js: estado para el mapa y el semáforo (HU 4.2).
// Aquí solo se conecta la URL. [api] [postman]
export { GET } from "@back/pedidos_y_respuestas/estacionamientos.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
