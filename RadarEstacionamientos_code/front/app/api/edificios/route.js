// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Dirección web /api/edificios para el catálogo
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/logica/controladores/).
// GET  /api/edificios → EdificioControlador.listar
// POST /api/edificios → EdificioControlador.agregar   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const GET = (peticion) => Fabrica.obtener().edificioControlador.listar(peticion);
export const POST = (peticion) => Fabrica.obtener().edificioControlador.agregar(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
