// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Dirección web /api/edificios/:id para modificar y quitar
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/controladores/).
// PATCH  /api/edificios/<id> → EdificioControlador.modificar
// DELETE /api/edificios/<id> → EdificioControlador.quitar   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const PATCH = (peticion, contexto) => Fabrica.obtener().edificioControlador.modificar(peticion, contexto);
export const DELETE = (peticion, contexto) => Fabrica.obtener().edificioControlador.quitar(peticion, contexto);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
