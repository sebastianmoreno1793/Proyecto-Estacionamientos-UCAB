// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Dirección web GET /api/estacionamientos con la ocupación y el semáforo
// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Dirección web GET /api/estacionamientos para dibujar el mapa
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/logica/controladores/).
// GET /api/estacionamientos → EstacionamientoControlador.listar   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const GET = (peticion) => Fabrica.obtener().estacionamientoControlador.listar(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
