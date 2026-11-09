// /api/eventos: la atiende el back (back/api/eventos.js). Aquí solo se conecta la URL.
export { GET } from "@back/api/eventos.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
