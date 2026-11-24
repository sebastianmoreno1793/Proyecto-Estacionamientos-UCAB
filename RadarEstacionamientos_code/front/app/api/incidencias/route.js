// @HU-9.1 Crear una incidencia · Sebastian — Dirección web /api/incidencias para los reportes
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/logica/controladores/).
// GET  /api/incidencias → IncidenciaControlador.listar
// POST /api/incidencias → IncidenciaControlador.crear   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const GET = (peticion) => Fabrica.obtener().incidenciaControlador.listar(peticion);
export const POST = (peticion) => Fabrica.obtener().incidenciaControlador.crear(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
