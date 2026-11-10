// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — URL PATCH /api/estacionamientos/:id
// PATCH /api/estacionamientos/<id> → back/api/estacionamientos.js: cambia capacidad y estado (HU 5.4).
// Aquí solo se conecta la URL. [api] [postman]
export { PATCH } from "@back/api/estacionamientos.js";

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
