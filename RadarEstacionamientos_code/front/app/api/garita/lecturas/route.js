// /api/garita/lecturas: la atiende el back (back/api/garita.js). Aquí solo se conecta la URL.
export { POST } from "@back/api/garita.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
