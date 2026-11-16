// @HU-2.1 Registrar mis vehículos · Samuel — Dirección web /api/vehiculos para «Mis vehículos»
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/controladores/).
// GET  /api/vehiculos → VehiculoControlador.listar
// POST /api/vehiculos → VehiculoControlador.registrar   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const GET = (peticion) => Fabrica.obtener().vehiculoControlador.listar(peticion);
export const POST = (peticion) => Fabrica.obtener().vehiculoControlador.registrar(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
