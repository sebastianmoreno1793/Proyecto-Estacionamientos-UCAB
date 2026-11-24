// Solo desarrollo — Dirección web POST /api/pruebas/reiniciar
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/logica/controladores/).
// POST /api/pruebas/reiniciar → PruebasControlador.reiniciar   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const POST = (peticion) => Fabrica.obtener().pruebasControlador.reiniciar(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
