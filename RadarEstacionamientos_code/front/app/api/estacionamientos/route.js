// /api/estacionamientos: la atiende el back (back/api/estacionamientos.js). Aquí solo se conecta la URL.
export { GET } from "@back/api/estacionamientos.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
