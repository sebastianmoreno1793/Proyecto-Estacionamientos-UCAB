// @HU-9.1 Crear una incidencia · Sebastian — Dirección web /api/incidencias para los reportes
// GET y POST /api/incidencias → back/pedidos_y_respuestas/incidencias.js: listar y reportar incidencias (HU 9.1).
// Aquí solo se conecta la URL. [api] [postman]
export { GET, POST } from "@back/pedidos_y_respuestas/incidencias.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
