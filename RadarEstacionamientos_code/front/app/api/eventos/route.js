// Canal en vivo (HU 4.3) — Dirección web GET /api/eventos (Server-Sent Events)
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/controladores/).
// GET /api/eventos → EventoControlador.abrir   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const GET = (peticion) => Fabrica.obtener().eventoControlador.abrir(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
