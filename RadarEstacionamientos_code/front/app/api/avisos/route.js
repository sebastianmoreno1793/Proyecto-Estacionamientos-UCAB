// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Dirección web /api/avisos: aquí llegan los avisos de los sensores
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Dirección web /api/avisos que actualiza el aforo
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/controladores/).
// POST /api/avisos → AvisoControlador.recibir (sensores, simulador y Postman, con x-clave-sensor)
// GET  /api/avisos → AvisoControlador.listar (Administrar › Garita)   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const POST = (peticion) => Fabrica.obtener().avisoControlador.recibir(peticion);
export const GET = (peticion) => Fabrica.obtener().avisoControlador.listar(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
