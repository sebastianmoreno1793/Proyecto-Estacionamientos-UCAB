// /api/incidencias: la atiende el back (back/api/incidencias.js). Aquí solo se conecta la URL.
export { GET, POST } from "@back/api/incidencias.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
