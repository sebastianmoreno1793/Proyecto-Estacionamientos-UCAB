// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Dirección web PATCH /api/estacionamientos/:id
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/controladores/).
// PATCH /api/estacionamientos/<id> → EstacionamientoControlador.cambiar   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const PATCH = (peticion, contexto) => Fabrica.obtener().estacionamientoControlador.cambiar(peticion, contexto);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
