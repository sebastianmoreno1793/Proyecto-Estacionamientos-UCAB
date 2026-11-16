// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Dirección web GET /api/sugerencia
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/controladores/).
// GET /api/sugerencia?edificio=<id> → SugerenciaControlador.sugerir   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const GET = (peticion) => Fabrica.obtener().sugerenciaControlador.sugerir(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
