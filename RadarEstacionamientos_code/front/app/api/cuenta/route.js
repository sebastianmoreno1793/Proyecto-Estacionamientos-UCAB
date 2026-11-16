// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Dirección web POST /api/cuenta para crear la cuenta
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/controladores/).
// POST /api/cuenta → CuentaControlador.crearCuenta   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const POST = (peticion) => Fabrica.obtener().cuentaControlador.crearCuenta(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
