// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Dirección web /api/sesion para entrar, salir y saber quién está conectado
// LA RUTA: no sabe qué le llega, solo se lo pasa a su controlador del back (back/controladores/).
// GET    /api/sesion → CuentaControlador.sesionActual
// POST   /api/sesion → CuentaControlador.entrar
// DELETE /api/sesion → CuentaControlador.salir   [api] [postman]
import { Fabrica } from "@back/Fabrica.js";

export const GET = (peticion) => Fabrica.obtener().cuentaControlador.sesionActual(peticion);
export const POST = (peticion) => Fabrica.obtener().cuentaControlador.entrar(peticion);
export const DELETE = (peticion) => Fabrica.obtener().cuentaControlador.salir(peticion);

export const dynamic = "force-dynamic"; // datos en vivo: nunca se guardan en caché
