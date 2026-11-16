// @HU-3.2 Simular sensores y placas · Aaron — Dirección web /api/garita/lecturas para las placas
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/controladores/).
// POST /api/garita/lecturas → GaritaControlador.recibir (lector de placas, con x-clave-sensor)
// GET  /api/garita/lecturas → GaritaControlador.listar (Administrar › Garita)   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const POST = (peticion) => Fabrica.obtener().garitaControlador.recibir(peticion);
export const GET = (peticion) => Fabrica.obtener().garitaControlador.listar(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
