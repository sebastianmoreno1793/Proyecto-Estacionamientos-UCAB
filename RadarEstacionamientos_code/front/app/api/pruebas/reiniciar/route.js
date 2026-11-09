// /api/pruebas/reiniciar: la atiende el back (back/api/reiniciar.js). Aquí solo se conecta la URL.
export { POST } from "@back/api/reiniciar.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
