// /api/avisos: la atiende el back (back/api/avisos.js). Aquí solo se conecta la URL.
export { POST } from "@back/api/avisos.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
