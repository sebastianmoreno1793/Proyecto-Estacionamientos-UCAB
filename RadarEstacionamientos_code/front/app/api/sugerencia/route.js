// /api/sugerencia: la atiende el back (back/api/sugerencia.js). Aquí solo se conecta la URL.
export { GET } from "@back/api/sugerencia.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
