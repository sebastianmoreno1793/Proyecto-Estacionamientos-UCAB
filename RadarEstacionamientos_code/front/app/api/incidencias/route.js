// @HU-9.1 Crear una incidencia · Sebastian — URL /api/incidencias
// GET y POST /api/incidencias → back/api/incidencias.js: listar y reportar incidencias (HU 9.1).
// Aquí solo se conecta la URL. [api] [postman]
export { GET, POST } from "@back/api/incidencias.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
